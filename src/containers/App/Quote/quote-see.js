import React, {Component} from 'react';
import styled from 'react-emotion';
import {Mutation, Query} from 'react-apollo';
import Section from '../../../components/Section';

import {
	FlexRow, FlexColumn, H1, Button,
} from '../../../utils/content';
import {GET_QUOTE_DATA} from '../../../utils/queries';
import {SEND_AMENDMENT} from '../../../utils/mutations';

import TasksProgressBar from '../../../components/TasksProgressBar';

import QuoteDisplay from '../../../components/QuoteDisplay';

const TasksListUserMain = styled('div')``;
const TLTopBar = styled(FlexRow)``;
const TLCustomerName = styled('label')`
	flex: 1;
`;
const BackButton = styled(Button)`
	margin-top: 10px;
	margin-bottom: 10px;
`;
const TLTimeIndicators = styled(FlexColumn)``;
const TLTimeLabel = styled('div')``;
const TLTimeValue = styled('div')`
	color: ${props => (props.warning ? 'red' : 'black')};
`;

class TasksListUser extends Component {
	editItem = async (itemId, sectionId, data, updateValidatedItem) => {
		const {name, unit, comment} = data;

		return updateValidatedItem({
			variables: {
				itemId,
				unit,
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
				console.log(e);
			}
			this.setState({apolloTriggerRenderTemporaryFix: true});
		},
	});

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

					const sectionsElems = option.sections.map(section => (
						<Section
							items={section.items}
							name={section.name}
							id={section.id}
						/>
					));

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
							mode="see"
						/>
					);
				}}
			</Query>
		);
	}
}

export default TasksListUser;
