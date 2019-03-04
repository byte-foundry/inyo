import React, {Component} from 'react';
import styled from '@emotion/styled';
import {gray20} from '../../utils/content';
import {
	primaryPurple,
	lightGrey,
	mediumGrey,
	accentGrey,
} from '../../utils/new/design-system';

const TasksProgressBarMain = styled('div')`
	background: ${lightGrey};
	position: relative;
	height: 8px;
	width: 100%;
	margin-bottom: 2rem;
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

const TasksProgressBarLabel = styled('div')`
	margin-top: 2rem;
	color: ${accentGrey};
	text-align: right;

	&::after {
		content: '%';
	}
`;

class TasksProgressBar extends Component {
	render() {
		const {tasksCompleted, tasksTotal} = this.props;

		return (
			<>
				<TasksProgressBarLabel>
					{Math.round((tasksCompleted / tasksTotal) * 100)
						? Math.round((tasksCompleted / tasksTotal) * 100)
						: '0'}
				</TasksProgressBarLabel>
				<TasksProgressBarMain
					completionRate={(tasksCompleted / tasksTotal) * 100}
				/>
			</>
		);
	}
}

export default TasksProgressBar;
