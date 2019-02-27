import React, {Suspense, memo} from 'react';
import styled from '@emotion/styled';
import {useQuery} from 'react-apollo-hooks';

import {GET_ALL_TASKS} from '../../../utils/queries';
import {Loading} from '../../../utils/content';

import ProjectHeader from '../../../components/ProjectHeader';
import ProjectList from '../../../components/ProjectTasksList';
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
	flex: auto;
	max-width: 980px;
`;

function TasksListContainer({projectId, linkedCustomerId}) {
	const {data, error} = useQuery(GET_ALL_TASKS, {
		variables: {
			linkedCustomerId: linkedCustomerId || undefined,
			// projectId: projectId || undefined,
		},
	});

	if (error) throw error;

	const {tasks} = data.me;

	// order by creation date
	tasks.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

	if (projectId) {
		return (
			<ProjectList
				projectId={projectId}
				items={tasks.filter(
					item => item.section && item.section.project.id === projectId,
				)}
			/>
		);
	}

	return (
		<TasksListComponent
			items={tasks}
			projectId={projectId}
			customerId={linkedCustomerId}
		/>
	);
}

function TasksList({location, history}) {
	const {prevSearch} = location.state || {};
	const query = new URLSearchParams(prevSearch || location.search);
	const linkedCustomerId = query.get('customerId');
	const projectId = query.get('projectId');

	const setProjectSelected = (selected) => {
		const newQuery = new URLSearchParams(query);

		if (selected) {
			const {value: selectedProjectId} = selected;

			newQuery.set('projectId', selectedProjectId);
		}
		else if (newQuery.has('projectId')) {
			newQuery.delete('projectId');
		}

		history.push(`/app/tasks?${newQuery.toString()}`);
	};

	const setCustomerSelected = (selected) => {
		const newQuery = new URLSearchParams(query);

		if (selected) {
			const {value: selectedCustomerId} = selected;

			newQuery.set('customerId', selectedCustomerId);
		}
		else if (newQuery.has('customerId')) {
			newQuery.delete('customerId');
		}

		if (newQuery.has('projectId')) {
			newQuery.delete('projectId');
		}

		history.push(`/app/tasks?${newQuery.toString()}`);
	};

	return (
		<Container>
			<TaskAndArianne>
				<ArianneThread
					projectId={projectId}
					linkedCustomerId={linkedCustomerId}
					selectCustomer={setCustomerSelected}
					selectProjects={setProjectSelected}
				/>
				{projectId && <ProjectHeader projectId={projectId} />}
				<CreateTask
					setProjectSelected={setProjectSelected}
					currentProjectId={projectId}
				/>
				<Suspense fallback={<Loading />}>
					<TasksListContainer
						projectId={projectId}
						linkedCustomerId={linkedCustomerId}
					/>
				</Suspense>
			</TaskAndArianne>
			{query.get('projectId') && (
				<SidebarProjectInfos projectId={query.get('projectId')} />
			)}
		</Container>
	);
}

export default TasksList;
