import React, {Component} from 'react';
import styled from 'react-emotion';
import AddTask from './add-task';
import {H4, H5, FlexRow} from '../../utils/content';

const QuoteAddItem = styled('button')``;
const TaskName = styled(H5)`
	margin: 0;
`;
const TaskMain = styled(FlexRow)`
	padding: 10px 20px;
	margin-bottom: 5px;
	border: 1px solid black;
`;

class Task extends Component {
	constructor(props) {
		super(props);
		this.state = {
			shouldDisplayAddTask: false,
		};
	}

	render() {
		const {
			task, sectionIndex, taskIndex, editTask,
		} = this.props;
		const {shouldDisplayAddTask} = this.state;

		return shouldDisplayAddTask ? (
			<AddTask
				task={task}
				cancel={() => {
					this.setState({shouldDisplayAddTask: false});
				}}
				done={(data) => {
					editTask(sectionIndex, taskIndex, data);
					this.setState({shouldDisplayAddTask: false});
				}}
			/>
		) : (
			<TaskMain
				justifyContent="space-between"
				onClick={() => {
					this.setState({shouldDisplayAddTask: true});
				}}
			>
				<TaskName>{task.name}</TaskName>
				<span>{task.amount}</span>
				<span>{task.price}€</span>
			</TaskMain>
		);
	}
}

export default Task;
