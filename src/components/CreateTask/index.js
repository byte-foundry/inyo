import React from 'react';
import {useMutation} from 'react-apollo-hooks';
import styled from '@emotion/styled/macro';

import TaskInput from '../TaskInput';
import {TaskContainer} from '../TasksList/task';

import {ADD_ITEM} from '../../utils/mutations';

const TaskInputContainer = styled('div')`
	& + ${TaskContainer} {
		margin-top: 3rem;
	}
`;

const CreateTask = () => {
	const createTask = useMutation(ADD_ITEM);

	return (
		<TaskInputContainer>
			<TaskInput onSubmitTask={task => createTask({variables: task})} />
		</TaskInputContainer>
	);
};

export default CreateTask;
