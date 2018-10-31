import React, {Component} from 'react';
import styled from 'react-emotion';
import {Mutation, Query} from 'react-apollo';
import ReactGA from 'react-ga';
import {ToastContainer, toast} from 'react-toastify';
import Section from '../../../components/Section';

import {GET_QUOTE_DATA} from '../../../utils/queries';

import QuoteDisplay from '../../../components/QuoteDisplay';

class TasksListUser extends Component {
	editItem = async (itemId, sectionId, data, updateValidatedItem) => {
		const {name, unit, comment} = data;

		return updateValidatedItem({
			variables: {
				itemId,
				unit: parseFloat(unit),
				comment: {text: comment},
			},
			optimisticResponse: {
				__typename: 'Mutation',
				updateValidatedItem: {
					id: itemId,
					status: 'UPDATED',
					name,
					unit,
					comment: {text: comment},
					__typename: 'Item',
				},
			},
			update: (cache, {data: {updateValidatedItem}}) => {
				const data = cache.readQuery({
					query: GET_QUOTE_DATA,
					variables: {quoteId: this.props.match.params.quoteId},
				});
				const section = data.quote.options[0].sections.find(
					e => e.id === sectionId,
				);
				const itemIndex = section.items.find(
					e => e.id === updateValidatedItem.id,
				);

				section.items[itemIndex] = updateValidatedItem;
				try {
					cache.writeQuery({
						query: GET_QUOTE_DATA,
						variables: {quoteId: this.props.match.params.quoteId},
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

	sendAmendment = async (quoteId, sendAmendment) => sendAmendment({
		variables: {
			quoteId,
		},
		update: (cache, {data: {sendAmendment}}) => {
			const data = cache.readQuery({
				query: GET_QUOTE_DATA,
				variables: {quoteId: this.props.match.params.quoteId},
			});

			data.quote = sendAmendment;

			try {
				cache.writeQuery({
					query: GET_QUOTE_DATA,
					variables: {quoteId: this.props.match.params.quoteId},
					data,
				});
			}
			catch (e) {
				throw new Error(e);
			}
			ReactGA.event({
				category: 'Quote',
				action: 'Sent amendment',
			});
			toast.success(
				<div>
					<p>📬 L'avenant a été envoyé !</p>
				</div>,
				{
					position: toast.POSITION.TOP_RIGHT,
					autoClose: 3000,
					onClose: () => this.props.history.push('/app/quotes'),
				},
			);
			this.setState({apolloTriggerRenderTemporaryFix: true});
		},
	});

	addItem = (sectionId, addItem) => {
		addItem({
			variables: {sectionId, name: 'Nouvelle tâche'},
			update: (cache, {data: {addItem}}) => {
				const data = cache.readQuery({
					query: GET_QUOTE_DATA,
					variables: {quoteId: this.props.match.params.quoteId},
				});
				const section = data.quote.options[0].sections.find(
					e => e.id === sectionId,
				);

				section.items.push(addItem);
				try {
					cache.writeQuery({
						query: GET_QUOTE_DATA,
						variables: {quoteId: this.props.match.params.quoteId},
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
		const {quoteId} = this.props.match.params;

		return (
			<Query query={GET_QUOTE_DATA} variables={{quoteId}}>
				{({loading, error, data}) => {
					if (loading) return <p>Loading</p>;
					if (error) return <p>Error!: ${error.toString()}</p>;
					const {quote} = data;
					const option = quote.options[0];
					const timePlanned = option.sections.reduce(
						(timeSectionSum, section) => timeSectionSum
							+ section.items.reduce(
								(itemSum, item) => itemSum + item.unit,
								0,
							),
						0,
					);
					const amendmentEnabled = option.sections.reduce(
						(isSectionUpdated, section) => isSectionUpdated
							|| section.items.reduce(
								(isItemUpdated, item) => isItemUpdated || item.unit,
								false,
							),
						false,
					);
					const overtime = option.sections.reduce(
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

					const totalItems = option.sections.reduce(
						(sumItems, section) => sumItems + section.items.length,
						0,
					);

					const totalItemsFinished = option.sections.reduce(
						(sumItems, section) => sumItems
							+ section.items.filter(
								item => item.status === 'FINISHED',
							).length,
						0,
					);

					return (
						<div>
							<ToastContainer />
							<QuoteDisplay
								quoteOption={option}
								quote={quote}
								totalItems={totalItems}
								editItem={this.editItem}
								totalItemsFinished={totalItemsFinished}
								sendAmendment={this.sendAmendment}
								timePlanned={timePlanned}
								amendmentEnabled={amendmentEnabled}
								overtime={overtime}
								addItem={this.addItem}
								issuer={quote.issuer}
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
