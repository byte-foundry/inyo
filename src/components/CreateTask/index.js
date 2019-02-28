import React from 'react';
import {useMutation} from 'react-apollo-hooks';
import styled from '@emotion/styled/macro';

import TaskInput from '../TaskInput';
import {TaskContainer} from '../TasksList/task';

import {ADD_ITEM, CREATE_PROJECT, ADD_SECTION} from '../../utils/mutations';
import {GET_PROJECT_DATA} from '../../utils/queries';

const TaskInputContainer = styled('div')`
	& + ${TaskContainer} {
		margin-top: 3rem;
	}
`;

const CreateTask = ({setProjectSelected, currentProjectId}) => {
	const createTask = useMutation(ADD_ITEM);
	const createProject = useMutation(CREATE_PROJECT);
	const addSection = useMutation(ADD_SECTION);

	const props = {};

	if (currentProjectId) {
		props.onSubmitSection = section => addSection({
			variables: {
				projectId: currentProjectId,
				position: 0,
				...section,
			},
			update: (cache, {data: {addSection: addedSection}}) => {
				const data = cache.readQuery({
					query: GET_PROJECT_DATA,
					variables: {projectId: currentProjectId},
				});

				const {project} = data;

				project.sections.unshift(addedSection);

				cache.writeQuery({
					query: GET_PROJECT_DATA,
					variables: {projectId: currentProjectId},
					data,
				});
			},
		});
	}
	else {
		props.onSubmitProject = async (project) => {
			const {
				data: {
					createProject: {id},
				},
			} = await createProject({variables: project});

			setProjectSelected({value: id});
		};
	}

	return (
		<TaskInputContainer>
			<TaskInput
				onSubmitTask={task => createTask({
					variables: {projectId: currentProjectId, ...task},
				})
				}
				{...props}
			/>
		</TaskInputContainer>
	);
};

export default CreateTask;
