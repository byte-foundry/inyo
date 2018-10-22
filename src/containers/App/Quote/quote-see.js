import React, {Component} from 'react';
import styled from 'react-emotion';
import {Mutation, Query} from 'react-apollo';

import {
	FlexRow, FlexColumn, H1, Button,
} from '../../../utils/content';
import {GET_QUOTE_DATA} from '../../../utils/queries';

import TasksProgressBar from '../../../components/TasksProgressBar';
import Section from '../../../components/Section';

const TasksListUserMain = styled('div')``;
const TLTopBar = styled(FlexRow)``;
const TLCustomerName = styled('label')`
	flex: 1;
`;
const TLTimeIndicators = styled(FlexColumn)``;
const TLTimeLabel = styled('div')``;
const TLTimeValue = styled('div')`
	color: ${props => (props.warning ? 'red' : 'black')};
`;

class TasksListUser extends Component {
	render() {
		const {quoteId} = this.props.match.params;

		return (
			<Query query={GET_QUOTE_DATA} variables={{quoteId}}>
				{({loading, error, data}) => {
					const fetchedData = {...data};

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
									+ (item.updatedUnit
										? item.updatedUnit - item.unit
										: 0),
								0,
							),
						0,
					);

					const sectionsElems = sections.map(section => (
						<Section items={section.items} name={section.name} />
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
						<TasksListUserMain>
							<TLTopBar>
								<TLCustomerName>
									{customer.name} via {customer.email}
								</TLCustomerName>
								<TLTimeIndicators>
									<FlexRow>
										<TLTimeLabel>Temps prévu:</TLTimeLabel>
										<TLTimeValue>{timePlanned}</TLTimeValue>
									</FlexRow>
									<FlexRow>
										<TLTimeLabel>Overtime:</TLTimeLabel>
										<TLTimeValue warning={overtime > 0}>
											{overtime}
										</TLTimeValue>
									</FlexRow>
								</TLTimeIndicators>
								<Button disabled={!amendmentEnabled}>
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
					);
				}}
			</Query>
		);
	}
}

export default TasksListUser;
