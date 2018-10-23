import React, {Component} from 'react';
import styled from 'react-emotion';
import {Mutation, Query} from 'react-apollo';

import {
	FlexRow, FlexColumn, H1, Button,
} from '../../../utils/content';
import {GET_QUOTE_DATA} from '../../../utils/queries';
import {SEND_AMENDMENT} from '../../../utils/mutations';

import TasksProgressBar from '../../../components/TasksProgressBar';
import Section from '../../../components/Section';

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

class TasksListUserLegacy extends Component {
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
					const {
						quote: {
							options: [{sections}],
							customer,
							name,
						},
					} = data;
					const timePlanned = sections.reduce(
						(timeSectionSum, section) => timeSectionSum
							+ section.items.reduce(
								(itemSum, item) => itemSum + item.unit,
								0,
							),
						0,
					);
					const amendmentEnabled = sections.reduce(
						(isSectionUpdated, section) => isSectionUpdated
							|| section.items.reduce(
								(isItemUpdated, item) => isItemUpdated || item.unit,
								false,
							),
						false,
					);
					const overtime = sections.reduce(
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

					const sectionsElems = sections.map(section => (
						<Section
							items={section.items}
							name={section.name}
							id={section.id}
						/>
					));

					const totalItems = sections.reduce(
						(sumItems, section) => sumItems + section.items.length,
						0,
					);

					const totalItemsFinished = sections.reduce(
						(sumItems, section) => sumItems
							+ section.items.filter(
								item => item.status === 'FINISHED',
							).length,
						0,
					);

					return (
						<Mutation mutation={SEND_AMENDMENT}>
							{sendAmendment => (
								<TasksListUserMain>
									<BackButton
										theme="Link"
										size="XSmall"
										onClick={() => this.props.history.push(
											'/app/quotes',
										)
										}
									>
										Retour à la liste des devis
									</BackButton>
									<TLTopBar>
										<TLCustomerName>
											{customer.name} via {customer.email}
										</TLCustomerName>
										<TLTimeIndicators>
											<FlexRow>
												<TLTimeLabel>
													Temps prévu:
												</TLTimeLabel>
												<TLTimeValue>
													{timePlanned}
												</TLTimeValue>
											</FlexRow>
											<FlexRow>
												<TLTimeLabel>
													Overtime:
												</TLTimeLabel>
												<TLTimeValue
													warning={overtime > 0}
												>
													{overtime}
												</TLTimeValue>
											</FlexRow>
										</TLTimeIndicators>
										<Button
											disabled={!amendmentEnabled}
											onClick={() => {
												this.sendAmendment(
													quoteId,
													sendAmendment,
												);
											}}
										>
											Send amendment
										</Button>
									</TLTopBar>
									<H1>{name}</H1>
									<TasksProgressBar
										tasksCompleted={totalItemsFinished}
										tasksTotal={totalItems}
									/>
									{sectionsElems}
								</TasksListUserMain>
							)}
						</Mutation>
					);
				}}
			</Query>
		);
	}
}

export default TasksListUserLegacy;
