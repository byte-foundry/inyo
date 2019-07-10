import styled from '@emotion/styled';
import React from 'react';

import {
	accentGrey,
	lightGrey,
	lightPurple,
	mediumGrey,
	mediumPurple,
	primaryPurple,
} from '../../utils/new/design-system';
import Plural from '../Plural';

const TasksProgressBarWrapper = styled('div')`
	display: flex;
	flex-direction: row-reverse;
	align-items: baseline;
`;

const TasksProgressBarMain = styled('div')`
	background: ${lightGrey};
	position: relative;
	height: 8px;
	width: 100%;
	margin-bottom: 2rem;
	border-radius: 5px;
	border: 1px dotted ${mediumGrey};
	z-index: 0;

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

	${props => (props.timeItTook === 0
		? ''
		: `&:before {
			border-radius: 5px;
			position: absolute;
			transition: width 0.2s ease;

			content: "";
			top: ${props.timeItTookPercentage >= 1 ? 0 : '1px'};
			left: calc(
				2px +
					${props.timeItTookPercentage >= 1 ? 0 : props.completionRate || 0}%
			);
			width: ${
		props.timeItTookPercentage >= 1
			? props.completionRate * props.timeItTookPercentage
			: props.completionRate * (1 - props.timeItTookPercentage)
		}%;
			height: ${props.timeItTookPercentage >= 1 ? '100%' : 'calc(100% - 2px)'};
			background: ${props.timeItTookPercentage >= 1 ? mediumPurple : lightPurple};
			border: 1px solid
				${props.timeItTookPercentage >= 1 ? mediumPurple : primaryPurple};
			transform: translate(
				${props.timeItTookPercentage >= 1 ? 0 : '-100%'}
			);
			z-index: ${props.timeItTookPercentage >= 1 ? 0 : 1};
		}`)}
`;

const TasksProgressBarLabel = styled('div')`
	color: ${primaryPurple};
	text-align: right;
	flex: 1 1 50px;
`;

const ExtraDaysLabel = styled('span')`
	color: ${accentGrey};
	font-size: 0.75rem;
	position: absolute;
	top: 10px;
	right: calc(100% - ${props => props.left}%);
`;

function TasksProgressBar({
	project,
	customerToken,
	showCompletionPercentage = true,
}) {
	const allItems = project.sections.reduce(
		(total, section) => total.concat(section.items),
		[],
	);
	const finishedItems = allItems.filter(item => item.status === 'FINISHED');

	function getCustomerOffsetedTimeItTook(item) {
		return customerToken && item.unit > item.timeItTook
			? item.unit
			: item.timeItTook;
	}

	const totalTimeItTook = finishedItems.reduce(
		(totalTimeItTookSum, item) => totalTimeItTookSum
			+ (getCustomerOffsetedTimeItTook(item) || item.unit)
			+ 1,
		0,
	);
	const totalTimePlanned = finishedItems.reduce(
		(totalItem, item) => totalItem + item.unit + 1,
		0,
	);

	const timeItTookPercentage = totalTimeItTook / (totalTimePlanned || 1);

	const timeItTook = finishedItems.reduce(
		(totalTimeItTookSum, item) => totalTimeItTookSum
			+ getCustomerOffsetedTimeItTook(item)
			- item.unit,
		0,
	);

	// additioner le temps de tous les itemItTook définis + item.unit des tâches pas encore finies
	// puis résultat divisé par la somme de tous les item.unit
	// ça donne un chiffre en dessous de zéro quand plus rapide que prévu
	// et plus de 1 si a pris du retard

	const tasksCompleted
		= finishedItems.length
		+ finishedItems.reduce((acc, item) => acc + item.unit, 0);
	const tasksTotal
		= allItems.length + allItems.reduce((acc, item) => acc + item.unit, 0);
	const tasksTotalWithTimeItTook
		= allItems.length
		+ allItems.reduce((acc, item) => acc + (item.timeItTook || item.unit), 0);
	// tasksTotal devrait prendre en compte timeItook.
	// en fait tasksTotal = additioner le temps de tous les itemItTook définis + item.unit des tâches pas encore finies
	// + allItems.length pour tenir compte des tâches avec durée = 0

	const completionRate
		= tasksTotal > tasksTotalWithTimeItTook
			? tasksCompleted / (tasksTotal || 1)
			: tasksCompleted / (tasksTotalWithTimeItTook || 1);

	const extraDaysLeftPos
		= (timeItTookPercentage >= 1 ? timeItTookPercentage : 1)
		* completionRate
		* 100;

	return (
		<TasksProgressBarWrapper>
			{showCompletionPercentage && (
				<TasksProgressBarLabel>
					{Math.round((tasksCompleted / tasksTotal) * 100)
						? Math.round((tasksCompleted / tasksTotal) * 100)
						: '0'}
					%
				</TasksProgressBarLabel>
			)}
			<TasksProgressBarMain
				completionRate={completionRate * 100}
				timeItTook={timeItTook}
				timeItTookPercentage={timeItTookPercentage}
			>
				{timeItTook !== 0 && (
					<ExtraDaysLabel left={extraDaysLeftPos}>
						{timeItTook >= 0 && '+'}
						{timeItTook.toFixed(2)}{' '}
						<Plural
							value={timeItTook}
							singular="jour"
							plural="jours"
						/>
					</ExtraDaysLabel>
				)}
			</TasksProgressBarMain>
		</TasksProgressBarWrapper>
	);
}

export default TasksProgressBar;
