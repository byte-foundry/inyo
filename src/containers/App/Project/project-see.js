import React, {Component} from 'react';
import styled from 'react-emotion';
import {Mutation, Query} from 'react-apollo';
import ReactGA from 'react-ga';
import {ToastContainer, toast} from 'react-toastify';
import Section from '../../../components/Section';

import {GET_PROJECT_DATA} from '../../../utils/queries';

import {Loading} from '../../../utils/content';

import ProjectDisplay from '../../../components/ProjectDisplay';

class TasksListUser extends Component {
	editItem = async (itemId, sectionId, data, updateValidatedItem) => {
		const {name, unit, comment} = data;

		return updateValidatedItem({
			variables: {
				itemId,
				name,
				unit: parseFloat(unit),
				comment: {text: comment},
			},
			update: (cache, {data: {updateValidatedItem}}) => {
				window.$crisp.push([
					'set',
					'session:event',
					[[['item_edited', {}, 'yellow']]],
				]);
				const data = cache.readQuery({
					query: GET_PROJECT_DATA,
					variables: {projectId: this.props.match.params.projectId},
				});
				const section = data.project.options[0].sections.find(
					e => e.id === sectionId,
				);
				const itemIndex = section.items.find(
					e => e.id === updateValidatedItem.id,
				);

				section.items[itemIndex] = updateValidatedItem;
				try {
					cache.writeQuery({
						query: GET_PROJECT_DATA,
						variables: {
							projectId: this.props.match.params.projectId,
						},
						data,
					});
				}
				catch (e) {
					console.log(e);
				}
				this.setState({apolloTriggerRenderTemporaryFix: true});
			},
		});
	};

	sendAmendment = async (projectId, sendAmendment) => sendAmendment({
		variables: {
			projectId,
		},
		update: (cache, {data: {sendAmendment}}) => {
			const data = cache.readQuery({
				query: GET_PROJECT_DATA,
				variables: {projectId: this.props.match.params.projectId},
			});

			data.project = sendAmendment;

			try {
				cache.writeQuery({
					query: GET_PROJECT_DATA,
					variables: {
						projectId: this.props.match.params.projectId,
					},
					data,
				});
			}
			catch (e) {
				throw new Error(e);
			}
			window.$crisp.push([
				'set',
				'session:event',
				[[['amendment_sent', {}, 'blue']]],
			]);
			ReactGA.event({
				category: 'Project',
				action: 'Sent amendment',
			});
			toast.success(
				<div>
					<p>📬 L'avenant a été envoyé !</p>
				</div>,
				{
					position: toast.POSITION.TOP_RIGHT,
					autoClose: 3000,
					onClose: () => this.props.history.push('/app/projects'),
				},
			);
			this.setState({apolloTriggerRenderTemporaryFix: true});
		},
	});

	addItem = (sectionId, addItemValues, addItem) => {
		const {
			name, vatRate, unit, unitPrice, description,
		} = addItemValues;

		addItem({
			variables: {
				sectionId,
				name,
				vatRate,
				unit: parseFloat(unit),
				unitPrice,
				description,
			},
			update: (cache, {data: {addItem}}) => {
				window.$crisp.push([
					'set',
					'session:event',
					[[['item_added', {}, 'yellow']]],
				]);
				const data = cache.readQuery({
					query: GET_PROJECT_DATA,
					variables: {projectId: this.props.match.params.projectId},
				});
				const section = data.project.sections.find(
					e => e.id === sectionId,
				);

				section.items.push(addItem);
				try {
					cache.writeQuery({
						query: GET_PROJECT_DATA,
						variables: {
							projectId: this.props.match.params.projectId,
						},
						data,
					});
				}
				catch (e) {
					throw new Error(e);
				}
				this.setState({apolloTriggerRenderTemporaryFix: true});
			},
		});
	};

	render() {
		const {projectId} = this.props.match.params;

		return (
			<Query query={GET_PROJECT_DATA} variables={{projectId}}>
				{({
					loading, error, data, refetch,
				}) => {
					if (loading) return <Loading />;
					if (error) {
						throw new Error(error);
						return <span />;
					}
					const {project} = data;
					const timePlanned = project.sections.reduce(
						(timeSectionSum, section) => timeSectionSum
							+ section.items.reduce(
								(itemSum, item) => itemSum + item.unit,
								0,
							),
						0,
					);
					const amendmentEnabled = project.sections.reduce(
						(isSectionUpdated, section) => isSectionUpdated
							|| section.items.reduce(
								(isItemUpdated, item) => isItemUpdated
									|| item.status === 'UPDATED'
									|| item.status === 'ADDED',
								false,
							),
						false,
					);
					const overtime = project.sections.reduce(
						(sectionOvertime, section) => sectionOvertime
							+ section.items.reduce(
								(itemOvertime, item) => itemOvertime
									+ (item.pendingUnit
										? item.pendingUnit - item.unit
										: 0),
								0,
							),
						0,
					);

					const totalItems = project.sections.reduce(
						(sumItems, section) => sumItems + section.items.length,
						0,
					);

					const totalItemsFinished = project.sections.reduce(
						(sumItems, section) => sumItems
							+ section.items.filter(
								item => item.status === 'FINISHED',
							).length,
						0,
					);

					return (
						<div>
							<ToastContainer />
							<ProjectDisplay
								project={project}
								totalItems={totalItems}
								editItem={this.editItem}
								totalItemsFinished={totalItemsFinished}
								sendAmendment={this.sendAmendment}
								timePlanned={timePlanned}
								amendmentEnabled={amendmentEnabled}
								overtime={overtime}
								addItem={this.addItem}
								issuer={project.issuer}
								refetch={refetch}
								mode="see"
							/>
						</div>
					);
				}}
			</Query>
		);
	}
}

export default TasksListUser;
