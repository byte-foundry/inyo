import React, {Suspense, useState} from 'react';
import styled from '@emotion/styled';
import {useQuery} from 'react-apollo-hooks';
import {withRouter} from 'react-router-dom';

import {GET_ALL_TASKS} from '../../../utils/queries';

import TopBar, {
	TopBarMenu,
	TopBarLogo,
	TopBarMenuLink,
} from '../../../components/TopBar';
import {Button} from '../../../utils/new/design-system';

import TasksListComponent from '../../../components/TasksList';
import ArianneThread from '../../../components/ArianneThread';
import CreateTask from '../../../components/CreateTask';

const TasksMain = styled('div')`
	min-height: 100vh;
	display: flex;
	flex-direction: column;
`;

const TasksListContainer = styled('div')`
	display: flex;
	justify-content: center;
	flex: 1;
`;

const TasksListSidebar = styled('div')``;

const TaskAndArianne = styled('div')`
	flex: auto 1;
	max-width: 1200px;
`;

function TasksList() {
	const [customerSelected, setCustomerSelected] = useState();
	const [projectSelected, setProjectSelected] = useState();
	const {data, error} = useQuery(GET_ALL_TASKS);

	if (error) throw error;

	const {tasks} = data.me;

	// order by creation date
	tasks.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

	return (
		<TasksMain>
			<TopBar>
				<TopBarLogo />
				<TopBarMenu>
					<Button>Dashboard</Button>
					<TopBarMenuLink>Options</TopBarMenuLink>
					<TopBarMenuLink>Options</TopBarMenuLink>
				</TopBarMenu>
			</TopBar>
			<TasksListContainer>
				<TaskAndArianne>
					<ArianneThread
						selectCustomer={setCustomerSelected}
						selectProjects={setProjectSelected}
					/>
					<CreateTask />
					<TasksListComponent items={tasks} />
				</TaskAndArianne>
				<TasksListSidebar />
			</TasksListContainer>
		</TasksMain>
	);
}

export default TasksList;
