import React from 'react';
import {useMutation} from 'react-apollo-hooks';
import styled from '@emotion/styled/macro';

import TaskInput from '../TaskInput';
import {TaskContainer} from '../TasksList/task';

import {ADD_ITEM, CREATE_PROJECT} from '../../utils/mutations';

const TaskInputContainer = styled('div')`
	& + ${TaskContainer} {
		margin-top: 3rem;
	}
`;

const CreateTask = ({setProjectSelected, currentProjectId}) => {
	const createTask = useMutation(ADD_ITEM);
	const createProject = useMutation(CREATE_PROJECT);

	return (
		<TaskInputContainer>
			<TaskInput
				onSubmitTask={task => createTask({
					variables: {projectId: currentProjectId, ...task},
				})
				}
				onSubmitProject={async (name) => {
					const {
						data: {
							createProject: {id},
						},
					} = await createProject({variables: name});

					setProjectSelected({value: id});
				}}
			/>
		</TaskInputContainer>
	);
};

export default CreateTask;
