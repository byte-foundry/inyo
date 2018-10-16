import React, {Component} from 'react';
import styled from 'react-emotion';

import Task from '../Task';
import TaskForm from '../TaskForm';

const TasksListMain = styled('div')`
	width: 70%;
`;

class TasksList extends Component {
	constructor(props) {
		super(props);
		this.state = {};
	}

	selectTask = (id) => {
		this.setState({
			selectedTask: id,
		});
	};

	addItem = () => {
		this.setState({
			addingItem: true,
		});
	};

	removeAddItem = () => {
		this.setState({
			addingItem: false,
		});
	};

	updateTask = (id) => {
		// update task
		// unselect task
		this.selectTask();
	};

	unselectTask = () => {
		this.selectTask();
	};

	render() {
		const {tasks} = this.props;
		const {selectedTask, addingItem} = this.state;

		const tasksList = tasks.map(
			task => (selectedTask === task.id ? (
				<TaskForm
					task={task}
					done={this.updateTask}
					cancel={this.unselectTask}
				/>
			) : (
				<Task task={task} select={this.selectTask} />
			)),
		);

		const addItem = addingItem && (
			<TaskForm
				task={{}}
				done={this.saveNewItem}
				cancel={this.removeAddItem}
			/>
		);

		return (
			<TasksListMain>
				{tasksList}
				{addItem}
				<button onClick={this.addItem}>Add Item</button>
			</TasksListMain>
		);
	}
}

export default TasksList;
