import React from 'react';
import styled from '@emotion/styled';
import {useQuery} from 'react-apollo-hooks';

import TasksProgressBar from '../../../components/TasksProgressBar';

import {GET_ALL_PROJECTS} from '../../../utils/queries';
import {
	Main,
	Container,
	Content,
	Heading,
} from '../../../utils/new/design-system';

function Projects() {
	const {
		data: {
			me: {projects},
		},
		errors: errorsProject,
	} = useQuery(GET_ALL_PROJECTS);

	return (
		<Container>
			<Main>
				<Content>
					{projects.map(project => (
						<div>
							<Heading>{project.name}</Heading>
							<TasksProgressBar project={project} />
						</div>
					))}
				</Content>
			</Main>
		</Container>
	);
}

export default Projects;
