import React from 'react';
import {useQuery, useMutation} from 'react-apollo-hooks';
import styled from '@emotion/styled';
import {css} from '@emotion/core';

import {
	accentGrey,
	lightGrey,
	primaryPurple,
} from '../../utils/new/design-system';
import {GET_PROJECT_INFOS} from '../../utils/queries';
import {UPDATE_PROJECT} from '../../utils/mutations';

import TasksProgressBar from '../TasksProgressBar';
import InlineEditable from '../InlineEditable';

const ProjectHeaderContainer = styled('div')`
	margin-bottom: 25px;
`;

const ProjectHeading = styled(InlineEditable)`
	color: ${accentGrey};
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

	return (
		<ProjectHeaderContainer>
			<ProjectHeading
				data-tip="Titre du projet"
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
			/>
		</ProjectHeaderContainer>
	);
}
