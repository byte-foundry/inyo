import React from 'react';
import styled from '@emotion/styled';
import {withRouter} from 'react-router-dom';
import {useQuery} from 'react-apollo-hooks';

import TasksProgressBar from '../../../components/TasksProgressBar';

import {GET_ALL_PROJECTS} from '../../../utils/queries';
import {
	Main,
	Container,
	Content,
	Heading,
} from '../../../utils/new/design-system';

const ProjectItem = styled('div')`
	cursor: pointer;
`;

function Projects({history}) {
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
						<ProjectItem
							onClick={() => history.push(
								`/app/tasks?projectId=${project.id}`,
							)
							}
						>
							<Heading>{project.name}</Heading>
							<TasksProgressBar project={project} />
						</ProjectItem>
					))}
				</Content>
			</Main>
		</Container>
	);
}

export default withRouter(Projects);
