import React, {Component} from 'react';
import styled from 'react-emotion';

const TasksProgressBarMain = styled('div')`
	background: grey;
	position: relative;
	height: 5px;
	width: 200px;

	&:after {
		position: absolute;
		top: 0;
		left: 0;
		content: ' ';
		width: ${props => props.completionRate || 0}%;
		height: 100%;
		background: lightgreen;
		transition: width 0.2s ease;
	}
`;

class TasksProgressBar extends Component {
	render() {
		const {tasksCompleted, tasksTotal} = this.props;

		return (
			<TasksProgressBarMain
				completionRate={(tasksCompleted / tasksTotal) * 100}
			/>
		);
	}
}

export default TasksProgressBar;
