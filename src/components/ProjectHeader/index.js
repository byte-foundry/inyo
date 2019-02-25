import React from 'react';
import {useQuery} from 'react-apollo-hooks';
import styled from '@emotion/styled';

import {ProjectHeading} from '../../utils/new/design-system';
import {GET_PROJECT_INFOS} from '../../utils/queries';

import TasksProgressBar from '../TasksProgressBar';

const ProjectHeaderContainer = styled('div')`
	margin-bottom: 25px;
`;

export default function ProjectHeader({projectId}) {
	const {data, error} = useQuery(GET_PROJECT_INFOS, {
		variables: {projectId},
	});
	const {project} = data;
	const allItems = project.sections.reduce(
		(total, section) => total.concat(section.items),
		[],
	);
	const finishedItems = allItems.filter(item => item.status === 'FINISHED');

	return (
		<ProjectHeaderContainer>
			<ProjectHeading>{project.name}</ProjectHeading>
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
