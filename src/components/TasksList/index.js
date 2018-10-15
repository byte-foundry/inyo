import React, {Component} from 'react';
import styled from 'react-emotion';

import Task from '../Task';

const TasksListMain = styled('div')`
	width: 70%;
`;

class TasksList extends Component {
	render() {
		const {tasks} = this.props;

		const tasksList = tasks.map(task => <Task task={task} />);

		return <TasksListMain>{tasksList}</TasksListMain>;
	}
}

export default TasksList;
