import React, {Component} from 'react';
import styled from '@emotion/styled';
import {gray20} from '../../utils/content';
import {
	primaryPurple,
	lightGrey,
	mediumGrey,
} from '../../utils/new/design-system';

const TasksProgressBarMain = styled('div')`
	background: ${lightGrey};
	position: relative;
	height: 8px;
	width: 100%;
	margin: 2rem 0;
	border-radius: 5px;
	border: 1px dotted ${mediumGrey};

	&:after {
		position: absolute;
		top: 0;
		left: 0;
		content: ' ';
		width: ${props => props.completionRate || 1.5}%;
		height: 100%;
		background: ${primaryPurple};
		transition: width 0.2s ease;
		border-radius: 5px;
		border: 1px solid ${primaryPurple};
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
