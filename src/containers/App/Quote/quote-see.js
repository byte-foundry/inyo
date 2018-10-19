import React, {Component} from 'react';
import styled from 'react-emotion';

import {
	FlexRow, FlexColumn, H1, Button,
} from '../../../utils/content';

import TasksProgressBar from '../../../components/TasksProgressBar';
import TasksList from '../../../components/TasksList';

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

const tasksListStatic = [
	{
		id: 1,
		name: 'Task',
		unit: 2,
		price: 1337,
		status: 'FINISHED',
	},
	{
		id: 2,
		name: 'Task 2',
		unit: 0.5,
		price: 137,
		status: 'FINISHED',
	},
	{
		id: 3,
		name: 'Task 3',
		unit: 1,
		updatedUnit: 1.5,
		price: 337,
		status: 'UPDATED_SENT',
	},
	{
		id: 4,
		name: 'Task 4',
		unit: 2,
		updatedUnit: 3,
		price: 1337,
		status: 'UPDATED_SENT',
	},
	{
		id: 5,
		name: 'Task 4',
		unit: 2,
		price: 1337,
		status: 'PENDING',
	},
];

const quote = {
	customer: {
		name: 'Yolo Inc.',
		email: 'roger@yolo.head',
	},
	projectName: 'Yolo website',
	tasks: tasksListStatic,
};

class TasksListUser extends Component {
	render() {
		const {customer, tasks, projectName} = quote;
		const timePlanned = tasks.reduce((acc, task) => acc + task.unit, 0);
		const amendmentEnabled = tasks.reduce(
			(acc, task) => (acc |= task.status === 'UPDATED'),
			false,
		);
		const overtime = tasks.reduce(
			(acc, task) => acc + (task.updatedUnit ? task.updatedUnit - task.unit : 0),
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
					<Button disabled={!amendmentEnabled}>Send amendment</Button>
				</TLTopBar>
				<H1>{projectName}</H1>
				<TasksProgressBar tasksCompleted={1} tasksTotal={5} />
				<TasksList tasks={tasksListStatic} />
			</TasksListUserMain>
		);
	}
}

export default TasksListUser;
