import React, {Component} from 'react';
import {Query} from 'react-apollo';
import ReactGA from 'react-ga';
import {ToastContainer, toast} from 'react-toastify';
import {Route} from 'react-router-dom';

import {GET_PROJECT_DATA} from '../../../utils/queries';

import ItemView from '../../../components/ItemView';
import {
	Loading,
	ModalContainer as Modal,
	ModalElem,
} from '../../../utils/content';

import ProjectDisplay from '../../../components/ProjectDisplay';

class TasksListUser extends Component {
	editItem = async (itemId, sectionId, data, updateItem) => {
		const {
			name, unit, comment, reviewer, description,
		} = data;

		return updateItem({
			variables: {
				itemId,
				name,
				reviewer,
				description,
				unit: parseFloat(unit),
				comment: comment && {text: comment},
			},
			update: (cache, {data: {updateItem: updatedItem}}) => {
				window.$crisp.push([
					'set',
					'session:event',
					[[['item_edited', undefined, 'yellow']]],
				]);
				const projectData = cache.readQuery({
					query: GET_PROJECT_DATA,
					variables: {projectId: this.props.match.params.projectId},
				});
				const section = projectData.project.sections.find(
					e => e.id === sectionId,
				);
				const itemIndex = section.items.find(
					e => e.id === updatedItem.id,
				);

				section.items[itemIndex] = updatedItem;
				try {
					cache.writeQuery({
						query: GET_PROJECT_DATA,
						variables: {
							projectId: this.props.match.params.projectId,
						},
						projectData,
					});
				}
				catch (e) {
					throw e;
				}
				this.setState({apolloTriggerRenderTemporaryFix: true});
			},
		});
	};

	removeItem = (itemId, sectionId, removeItem) => {
		window.$crisp.push([
			'set',
			'session:event',
			[[['item_removed', undefined, 'yellow']]],
		]);
		removeItem({
			variables: {itemId},
			update: (cache, {data: {removeItem: removedItem}}) => {
				const data = cache.readQuery({
					query: GET_PROJECT_DATA,
					variables: {projectId: this.props.match.params.projectId},
				});
				const section = data.project.sections.find(
					e => e.id === sectionId,
				);
				const itemIndex = section.items.findIndex(
					e => e.id === removedItem.id,
				);

				section.items.splice(itemIndex, 1);
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

	sendAmendment = async (projectId, sendAmendment) => sendAmendment({
		variables: {
			projectId,
		},
		update: (cache, {data: {sendAmendment: sentAmendment}}) => {
			const data = cache.readQuery({
				query: GET_PROJECT_DATA,
				variables: {projectId: this.props.match.params.projectId},
			});

			data.project = sentAmendment;

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
				[[['amendment_sent', undefined, 'blue']]],
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
			name, unit, description, reviewer,
		} = addItemValues;

		addItem({
			variables: {
				sectionId,
				name,
				unit: parseFloat(unit),
				description,
				reviewer,
			},
			update: (cache, {data: {addItem: addedItem}}) => {
				window.$crisp.push([
					'set',
					'session:event',
					[[['item_added', undefined, 'yellow']]],
				]);
				const data = cache.readQuery({
					query: GET_PROJECT_DATA,
					variables: {projectId: this.props.match.params.projectId},
				});
				const section = data.project.sections.find(
					e => e.id === sectionId,
				);

				section.items.push(addedItem);
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

	removeItem = (itemId, sectionId, removeItem) => {
		window.$crisp.push([
			'set',
			'session:event',
			[[['item_removed', undefined, 'yellow']]],
		]);
		removeItem({
			variables: {itemId},
			update: (cache, {data: {removeItem: removedItem}}) => {
				const data = cache.readQuery({
					query: GET_PROJECT_DATA,
					variables: {projectId: this.props.match.params.projectId},
				});
				const section = data.project.sections.find(
					e => e.id === sectionId,
				);
				const itemIndex = section.items.findIndex(
					e => e.id === removedItem.id,
				);

				section.items.splice(itemIndex, 1);
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

	editSectionTitle = (sectionId, name, updateSection) => {
		updateSection({
			variables: {sectionId, name},
			update: (cache, {data: {updateSection: updatedSection}}) => {
				window.$crisp.push([
					'set',
					'session:event',
					[[['section_edited', undefined, 'orange']]],
				]);
				const data = cache.readQuery({
					query: GET_PROJECT_DATA,
					variables: {projectId: this.props.match.params.projectId},
				});
				const sectionIndex = data.project.sections.findIndex(
					e => e.id === sectionId,
				);

				data.project.sections[sectionIndex] = updatedSection;
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

	addSection = (projectId, addSection) => {
		addSection({
			variables: {projectId, name: 'Nouvelle section'},
			update: (cache, {data: {addSection: addedSection}}) => {
				window.$crisp.push([
					'set',
					'session:event',
					[[['section_added', undefined, 'orange']]],
				]);
				const data = cache.readQuery({
					query: GET_PROJECT_DATA,
					variables: {projectId: this.props.match.params.projectId},
				});

				data.project.sections.push(addedSection);
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

	removeSection = (sectionId, removeSection) => {
		removeSection({
			variables: {sectionId},
			update: (cache, {data: {removeSection: removedSection}}) => {
				window.$crisp.push([
					'set',
					'session:event',
					[[['section_removed', undefined, 'orange']]],
				]);
				const data = cache.readQuery({
					query: GET_PROJECT_DATA,
					variables: {projectId: this.props.match.params.projectId},
				});
				const sectionIndex = data.project.sections.findIndex(
					e => e.id === removedSection.id,
				);

				data.project.sections.splice(sectionIndex, 1);
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

	finishItem = async (itemId, sectionId, finishItem, token, finishProject) => finishItem({
		variables: {
			itemId,
			token,
		},
		optimisticResponse: {
			__typename: 'Mutation',
			finishItem: {
				id: itemId,
				status: 'FINISHED',
			},
		},
		update: (cache, {data: {finishItem: finishedItem}}) => {
			window.$crisp.push([
				'set',
				'session:event',
				[[['item_finished', undefined, 'yellow']]],
			]);
			const data = cache.readQuery({
				query: GET_PROJECT_DATA,
				variables: {projectId: this.props.match.params.projectId},
			});
			const section = data.project.sections.find(
				e => e.id === sectionId,
			);
			const itemIndex = section.items.findIndex(
				e => e.id === finishedItem.id,
			);

			section.items[itemIndex].status = finishedItem.status;

			const projectIsFinished = data.project.sections.every(
				sectionVerification => sectionVerification.items.every(
					itemVerification => itemVerification.status === 'FINISHED',
				),
			);

			if (projectIsFinished) {
				finishProject({
					variables: {
						projectId: this.props.match.params.projectId,
					},
					optimisticResponse: {
						__typename: 'Mutation',
						finishProject: {
							id: this.props.match.params.projectId,
							status: 'FINISHED',
						},
					},
					update: (
						cacheProject,
						{data: {finishProject: finishedProject}},
					) => {
						window.$crisp.push([
							'set',
							'session:event',
							[[['project_finished', undefined, 'green']]],
						]);

						data.project.status = finishedProject.status;

						try {
							cache.writeQuery({
								query: GET_PROJECT_DATA,
								variables: {
									projectId: this.props.match.params
										.projectId,
								},
								data,
							});
						}
						catch (e) {
							throw e;
						}
					},
				});
			}
			else {
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
					throw e;
				}
			}
			this.setState({apolloTriggerRenderTemporaryFix: true});
		},
	});

	render() {
		const {projectId} = this.props.match.params;

		return (
			<Query query={GET_PROJECT_DATA} variables={{projectId}}>
				{({
					loading, error, data, refetch,
				}) => {
					if (loading) return <Loading />;
					if (error) throw error;

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
					const overtime = 0;

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
								removeItem={this.removeItem}
								editSectionTitle={this.editSectionTitle}
								addSection={this.addSection}
								removeSection={this.removeSection}
								addItem={this.addItem}
								removeItem={this.removeItem}
								finishItem={this.finishItem}
								issuer={project.issuer}
								refetch={refetch}
								mode="see"
							/>
							<Route
								path="/app/projects/:projectId/see/items/:itemId"
								render={({match, history}) => (
									<Modal
										onDismiss={() => history.push(
											`/app/projects/${projectId}/see`,
										)
										}
									>
										<ModalElem>
											<ItemView
												id={match.params.itemId}
												finishItem={this.finishItem}
											/>
										</ModalElem>
									</Modal>
								)}
							/>
						</div>
					);
				}}
			</Query>
		);
	}
}

export default TasksListUser;
