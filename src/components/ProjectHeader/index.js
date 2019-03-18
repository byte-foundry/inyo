import React from 'react';
import {useQuery, useMutation} from 'react-apollo-hooks';
import styled from '@emotion/styled';
import {css} from '@emotion/core';

import {
	accentGrey,
	lightGrey,
	primaryPurple,
	primaryGrey,
} from '../../utils/new/design-system';
import {GET_PROJECT_INFOS} from '../../utils/queries';
import {UPDATE_PROJECT} from '../../utils/mutations';

import TasksProgressBar from '../TasksProgressBar';
import InlineEditable from '../InlineEditable';

const ProjectHeaderContainer = styled('div')`
	margin-bottom: 25px;
`;

const ProjectHeading = styled(InlineEditable)`
	color: ${primaryGrey};
	font-size: 32px;
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

export default function ProjectHeader({projectId}) {
	const {data, error} = useQuery(GET_PROJECT_INFOS, {
		variables: {projectId},
	});
	const updateProject = useMutation(UPDATE_PROJECT);

	if (error) throw error;

	const {project} = data;

	const allItems = project.sections.reduce(
		(total, section) => total.concat(section.items),
		[],
	);
	const finishedItems = allItems.filter(item => item.status === 'FINISHED');

	const totalTimeItTook = finishedItems.reduce(
		(totalTimeItTook, item) => totalTimeItTook + (item.timeItTook || item.unit) + 1,
		0,
	);
	const totalTimePlanned = finishedItems.reduce(
		(totalItem, item) => totalItem + item.unit + 1,
		0,
	);

	const timeItTookPercentage = totalTimeItTook / (totalTimePlanned || 1);

	const timeItTook = finishedItems.reduce(
		(totalTimeItTook, item) => totalTimeItTook + item.timeItTook - item.unit,
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
