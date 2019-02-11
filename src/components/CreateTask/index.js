import React from 'react';
import {useMutation} from 'react-apollo-hooks';

import TaskInput from '../TaskInput';

import {ADD_ITEM} from '../../utils/mutations';

const CreateTask = () => {
	const createTask = useMutation(ADD_ITEM, {
		update: (proxy, result) => {
			// update tasks query
		},
	});

	return <TaskInput onSubmitTask={task => createTask({variables: task})} />;
};

export default CreateTask;
