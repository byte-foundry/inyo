import React, {Component} from 'react';
import styled from 'react-emotion';

import {FlexRow, FlexColumn, H1} from '../../../utils/content';

import TasksProgressBar from '../../../components/TasksProgressBar';
import TasksList from '../../../components/TasksList';

const TasksListUserMain = styled('div')``;
const TLTopBar = styled(FlexRow)``;
const TLCustomerName = styled('label')`
	flex: 1;
`;
const TLTimeIndicators = styled(FlexColumn)``;
const TLTimeLabel = styled('div')``;
const TLTimeValue = styled('div')``;

const tasksListStatic = [
	{
		id: 1,
		name: 'Task',
		time: 2,
		price: 1337,
		status: 'FINISHED',
	},
	{
		id: 2,
		name: 'Task 2',
		time: 0.5,
		price: 137,
		status: 'FINISHED',
	},
	{
		id: 3,
		name: 'Task 3',
		time: 1,
		price: 337,
		status: 'UPDATED',
	},
	{
		id: 4,
		name: 'Task 4',
		time: 2,
		price: 1337,
		status: 'UPDATED_SENT',
	},
	{
		id: 5,
		name: 'Task 4',
		time: 2,
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
		const timePlanned = tasks.reduce((acc, task) => acc + task.time, 0);

		return (
			<TasksListUserMain>
				<FlexRow>
					<H1>{projectName}</H1>
					<TasksProgressBar tasksCompleted={1} tasksTotal={5} />
					<TasksList tasks={tasksListStatic} />
				</FlexRow>
			</TasksListUserMain>
		);
	}
}

export default TasksListUser;
