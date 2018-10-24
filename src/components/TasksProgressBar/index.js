import React, {Component} from 'react';
import styled from 'react-emotion';
import {gray20, signalGreen} from '../../utils/content';

const TasksProgressBarMain = styled('div')`
	background: ${gray20};
	position: relative;
	height: 5px;
	width: 200px;
	margin-top: 15px;

	&:after {
		position: absolute;
		top: 0;
		left: 0;
		content: ' ';
		width: ${props => props.completionRate || 0}%;
		height: 100%;
		background: ${signalGreen};
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
