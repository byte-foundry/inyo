import React from 'react';
import styled from '@emotion/styled';
import {useQuery} from 'react-apollo-hooks';

import {GET_ALL_TASKS} from '../../../utils/queries';

import TasksListComponent from '../../../components/TasksList';
import ArianneThread from '../../../components/ArianneThread';
import CreateTask from '../../../components/CreateTask';
import SidebarProjectInfos from '../../../components/SidebarProjectInfos';

const Container = styled('div')`
	display: flex;
	justify-content: center;
	flex: 1;
`;

const TaskAndArianne = styled('div')`
	flex: auto 1;
	max-width: 1200px;
`;

function TasksList({location, history}) {
	const query = new URLSearchParams(location.search);
	const {data, error} = useQuery(GET_ALL_TASKS);

	if (error) throw error;

	const setProjectSelected = (projectId) => {
		const newQuery = new URLSearchParams(query);

		newQuery.set('projectId', projectId);

		history.push(`/app/tasks?${newQuery.toString()}`);
	};

	const setCustomerSelected = (customerId) => {
		const newQuery = new URLSearchParams(query);

		newQuery.set('customerId', customerId);

		history.push(`/app/tasks?${newQuery.toString()}`);
	};

	const {tasks} = data.me;

	// order by creation date
	tasks.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

	return (
		<Container>
			<TaskAndArianne>
				<ArianneThread
					selectCustomer={setCustomerSelected}
					selectProjects={setProjectSelected}
				/>
				<CreateTask />
				<TasksListComponent items={tasks} />
			</TaskAndArianne>
			{query.get('projectId') && (
				<SidebarProjectInfos projectId={query.get('projectId')} />
			)}
		</Container>
	);
}

export default TasksList;
