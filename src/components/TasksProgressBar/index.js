import React, {Component} from 'react';
import styled from '@emotion/styled';
import {gray20, signalGreen} from '../../utils/content';

const TasksProgressBarMain = styled('div')`
	background: ${gray20};
	position: relative;
	height: 10px;
	width: 100%;
	margin-top: 6px;
	border-radius: 5px;

	&:after {
		position: absolute;
		top: 0;
		left: 0;
		content: ' ';
		width: ${props => props.completionRate || 1.5}%;
		height: 100%;
		background: ${signalGreen};
		transition: width 0.2s ease;
		border-radius: 5px;
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
