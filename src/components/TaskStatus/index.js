import React, {Component} from 'react';
import styled from 'react-emotion';

const TaskStatusMain = styled('div')`
	width: 50px;
	height: 50px;
	background-image: url(${props => taskImageByStatus[props.status]});
`;

const taskImageByStatus = {
	PENDING: require('./pending.svg'),
	FINISHED: require('./finished.svg'),
	UPDATED: require('./updated.svg'),
	UPDATED_SENT: require('./updated_sent.svg'),
};

class TaskStatus extends Component {
	select = () => {
		this.props.select(this.props.task.id);
	};

	render() {
		const {status} = this.props;

		return <TaskStatusMain status={status} />;
	}
}

export default TaskStatus;
