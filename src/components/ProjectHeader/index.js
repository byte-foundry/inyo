import React from 'react';
import {useQuery, useMutation} from 'react-apollo-hooks';
import styled from '@emotion/styled';
import {css} from '@emotion/core';

import {
	primaryBlack,
	lightRed,
	lightGrey,
	accentGrey,
} from '../../utils/new/design-system';
import Pencil from '../../utils/icons/pencil.svg';
import {GET_PROJECT_INFOS} from '../../utils/queries';
import {UPDATE_PROJECT} from '../../utils/mutations';
import {BREAKPOINTS} from '../../utils/constants';

import TasksProgressBar from '../TasksProgressBar';
import InlineEditable from '../InlineEditable';

const ProjectHeaderContainer = styled('div')`
	margin-bottom: 4rem;

	@media (max-width: ${BREAKPOINTS}px) {
		margin-bottom: 1rem;
	}
`;

const ProjectHeading = styled(InlineEditable)`
	color: ${primaryBlack};
	font-size: 32px;

	${props => props.missingTitle
		&& `
		&:before {
			content: '';
			display: block;
			background: ${lightRed};
			position: absolute;
			left: -1rem;
			top: 0;
			right: -0.5rem;
			bottom: 0;
			border-radius: 8px;
			z-index: -1;
		}
	`}

	:hover {
		cursor: text;

		&:before {
			content: '';
			display: block;
			background: ${lightGrey};
			position: absolute;
			left: -1rem;
			top: 0;
			right: -0.5rem;
			bottom: 0;
			border-radius: 8px;
			z-index: -1;
		}
		&:after {
			content: '';
			display: block;
			background-color: ${accentGrey};
			mask-size: 35%;
			mask-position: center;
			mask-repeat: no-repeat;
			mask-image: url(${Pencil});
			position: absolute;
			top: 0;
			right: 0;
			bottom: 0;
			width: 50px;
		}
	}
`;

const placeholderCss = css`
	font-style: italic;
	padding: 0;
	display: block;
	line-height: 1.5;
`;

const nameCss = css`
	padding: 0;
	display: block;
	line-height: 1.5;
`;

const editableCss = css`
	padding: 0;
	line-height: 1.5;
	display: block;
`;

export default function ProjectHeader({projectId, customerToken}) {
	const {data, error} = useQuery(GET_PROJECT_INFOS, {
		variables: {projectId, token: customerToken},
	});
	const updateProject = useMutation(UPDATE_PROJECT);

	if (error) throw error;

	const {project} = data;

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
		(totalTimeItTook, item) => totalTimeItTook
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
		(totalTimeItTook, item) => totalTimeItTook + getCustomerOffsetedTimeItTook(item) - item.unit,
		0,
	);

	// additioner le temps de tous les itemItTook définis + item.unit des tâches pas encore finies
	// puis résultat divisé par la somme de tous les item.unit
	// ça donne un chiffre en dessous de zéro quand plus rapide que prévu
	// et plus de 1 si a pris du retard

	return (
		<ProjectHeaderContainer>
			<ProjectHeading
				placeholder="Ajouter un titre à ce projet"
				value={project.name}
				placeholderCss={placeholderCss}
				nameCss={nameCss}
				editableCss={editableCss}
				missingTitle={
					project.name === 'Nom du projet' || project.name === ''
				}
				onFocusOut={(value) => {
					if (value) {
						updateProject({
							variables: {
								projectId,
								name: value,
							},
						});
					}
				}}
			/>
			<TasksProgressBar
				tasksCompleted={
					finishedItems.length
					+ finishedItems.reduce((acc, item) => acc + item.unit, 0)
				}
				tasksTotal={
					allItems.length
					+ allItems.reduce((acc, item) => acc + item.unit, 0)
				}
				tasksTotalWithTimeItTook={
					allItems.length
					+ allItems.reduce(
						(acc, item) => acc + (item.timeItTook || item.unit),
						0,
					)
				}
				// tasksTotal devrait prendre en compte timeItook.
				// en fait tasksTotal = additioner le temps de tous les itemItTook définis + item.unit des tâches pas encore finies
				// + allItems.length pour tenir compte des tâches avec durée = 0
				allItems={allItems.length}
				finishedItems={finishedItems.length}
				timeItTook={timeItTook}
				timeItTookPercentage={timeItTookPercentage}
			/>
		</ProjectHeaderContainer>
	);
}
