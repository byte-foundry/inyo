import React, {Component} from 'react';
import styled from '@emotion/styled';
import {gray20} from '../../utils/content';
import {
	primaryPurple,
	lightGrey,
	mediumGrey,
	accentGrey,
	lightPurple,
	mediumPurple,
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

	&:hover {
		&:before {
			color: ${mediumPurple};
			transition: color 0.2s ease;
		}
	}

	&:before {
		font-size: 0.75rem;
		line-height: 3rem;
		text-align: right;
		overflow: visible;
		color: ${accentGrey};
		border-radius: 5px;
		position: absolute;
		transition: width 0.2s ease;

		content: ${props => (props.timeItTook >= 1 ? '"+XX jours"' : '"-XX jours"')};
		top: ${props => (props.timeItTook >= 1 ? 0 : '1px')};
		left: calc(
			2px +
				${props => (props.timeItTook >= 1 ? 0 : props.completionRate || 0)}%
		);
		width: ${props => (props.timeItTook >= 1
		? props.completionRate * props.timeItTook
		: props.completionRate * (1 - props.timeItTook))}%;
		height: ${props => (props.timeItTook >= 1 ? '100%' : 'calc(100% - 2px)')};
		background: ${props => (props.timeItTook >= 1 ? mediumPurple : lightPurple)};
		border: 1px solid
			${props => (props.timeItTook >= 1 ? mediumPurple : primaryPurple)};
		transform: translate(${props => (props.timeItTook >= 1 ? 0 : '-100%')});
		z-index: ${props => (props.timeItTook >= 1 ? 0 : 1)};
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
		const {
			tasksCompleted,
			tasksTotal,
			finishedItems,
			allItems,
			timeItTook,
		} = this.props;

		return (
			<>
				<TasksProgressBarLabel>
					{Math.round((tasksCompleted / tasksTotal) * 100)
						? Math.round((tasksCompleted / tasksTotal) * 100)
						: '0'}
				</TasksProgressBarLabel>
				<TasksProgressBarMain
					completionRate={(tasksCompleted / tasksTotal) * 100}
					timeItTook={timeItTook}
				/>
			</>
		);
	}
}

export default TasksProgressBar;
