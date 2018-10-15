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
		name: 'Task',
		time: 2,
		price: 1337,
		finished: true,
	},
	{
		name: 'Task 2',
		time: 0.5,
		price: 137,
		finished: true,
	},
	{
		name: 'Task 3',
		time: 1,
		price: 337,
	},
	{
		name: 'Task 4',
		time: 2,
		price: 1337,
	},
];

const quote = {
	customer: {
		name: 'Yolo Inc.',
		email: 'roger@yolo.head',
		tasks: tasksListStatic,
	},
};

class TasksListUser extends Component {
	render() {
		return (
			<TasksListUserMain>
				<TLTopBar>
					<TLCustomerName>Dashboard</TLCustomerName>
					<TLTimeIndicators>
						<FlexRow>
							<TLTimeLabel>Time spent:</TLTimeLabel>
							<TLTimeValue>5.5</TLTimeValue>
						</FlexRow>
						<FlexRow>
							<TLTimeLabel>Overtime:</TLTimeLabel>
							<TLTimeValue>0.5</TLTimeValue>
						</FlexRow>
					</TLTimeIndicators>
					<button>Send amendment</button>
				</TLTopBar>
				<H1>Name of The Project</H1>
				<TasksProgressBar tasksCompleted={1} tasksTotal={5} />
				<TasksList tasks={tasksListStatic} />
			</TasksListUserMain>
		);
	}
}

export default TasksListUser;
