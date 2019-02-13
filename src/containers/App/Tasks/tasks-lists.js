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

const TasksMain = styled('div')`
	min-height: 100vh;
`;

const TasksListContainer = styled('div')`
	display: flex;
	justify-content: center;
	width: 100%;
`;

const TasksListSidebar = styled('div')``;

const TaskAndArianne = styled('div')`
	display: flex;
	flex-direction: column;
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
					<TasksListComponent items={tasks} />
				</TaskAndArianne>
				<TasksListSidebar />
			</TasksListContainer>
		</TasksMain>
	);
}

export default TasksList;
