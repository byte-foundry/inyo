import styled from '@emotion/styled';
import moment from 'moment';
import React, {Suspense} from 'react';
import {useQuery} from 'react-apollo-hooks';

import ArianneThread from '../../../components/ArianneThread';
import CreateTask from '../../../components/CreateTask';
import HelpButton from '../../../components/HelpButton';
import ProjectHeader from '../../../components/ProjectHeader';
import ProjectPersonalNotes from '../../../components/ProjectPersonalNotes';
import ProjectSharedNotes from '../../../components/ProjectSharedNotes';
import ProjectList from '../../../components/ProjectTasksList';
import SidebarProjectInfos from '../../../components/SidebarProjectInfos';
import TasksListComponent from '../../../components/TasksList';
import {Loading} from '../../../utils/content';
import {Container, Content, Main} from '../../../utils/new/design-system';
import {GET_ALL_TASKS} from '../../../utils/queries';

const TaskAndArianne = styled('div')`
	display: flex;
	flex-direction: column;
	flex: auto;
`;

function TasksListContainer({
	projectId, linkedCustomerId, filter, tags,
}) {
	const {data, error} = useQuery(GET_ALL_TASKS, {
		variables: {
			linkedCustomerId: linkedCustomerId || undefined,
		},
		suspend: true,
	});

	if (error) throw error;

	const ongoingProjectAndNoProjectTask = data.me.tasks.filter(
		task => !task.section
			|| task.section.project.status === 'ONGOING'
			|| projectId,
	);

	const tasks = ongoingProjectAndNoProjectTask.filter(
		task => (!filter || task.status === filter || filter === 'ALL')
			&& tags.every(tag => task.tags.some(taskTag => taskTag.id === tag)),
	);

	// order by creation date
	tasks.sort((a, b) => {
		const bDeadline = b.dueDate || (b.project && b.project.deadline);
		const aDeadline = a.dueDate || (a.project && a.project.deadline);

		if ((a.unit && !b.unit) || (aDeadline && !bDeadline)) return -1;
		if ((!a.unit && b.unit) || (!aDeadline && bDeadline)) return 1;
		if ((!a.unit && !b.unit) || (!aDeadline && !bDeadline)) return 0;

		return (
			moment(aDeadline).diff(moment(), 'days')
			- a.unit
			- (moment(bDeadline).diff(moment(), 'days') - b.unit)
		);
	});

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
			items={[...tasks]}
			projectId={projectId}
			customerId={linkedCustomerId}
			hasFilteredItems={
				tasks.length !== ongoingProjectAndNoProjectTask.length
			}
		/>
	);
}

function TasksList({location, history}) {
	const {prevSearch} = location.state || {};
	const query = new URLSearchParams(prevSearch || location.search);
	const linkedCustomerId = query.get('customerId');
	const projectId = query.get('projectId');
	const filter = query.get('filter');
	const view = query.get('view');
	const tags = query.getAll('tags');

	const setProjectSelected = (selected, removeCustomer) => {
		const newQuery = new URLSearchParams(query);

		if (selected) {
			const {value: selectedProjectId} = selected;

			newQuery.set('projectId', selectedProjectId);
		}
		else if (newQuery.has('projectId')) {
			newQuery.delete('projectId');
		}

		if (removeCustomer) {
			newQuery.delete('customerId');
		}

		history.push(`/app/tasks?${newQuery.toString()}`);
	};

	const setCustomerSelected = (selected) => {
		const newQuery = new URLSearchParams(query);

		newQuery.delete('view');

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

	const setFilterSelected = (selected) => {
		const newQuery = new URLSearchParams(query);

		newQuery.delete('view');

		if (selected) {
			const {value: selectedFilterId} = selected;

			newQuery.set('filter', selectedFilterId);
		}

		history.push(`/app/tasks?${newQuery.toString()}`);
	};

	const setTagSelected = (selected) => {
		const newQuery = new URLSearchParams(query);

		newQuery.delete('view');

		if (selected) {
			newQuery.delete('tags');
			selected.forEach(tag => newQuery.append('tags', tag.value));
		}

		history.push(`/app/tasks?${newQuery.toString()}`);
	};

	const tasksView = (projectId && (view === 'tasks' || !view)) || !projectId;

	return (
		<Container>
			<HelpButton />
			<TaskAndArianne>
				<ArianneThread
					projectId={projectId}
					linkedCustomerId={linkedCustomerId}
					selectCustomer={setCustomerSelected}
					selectProjects={setProjectSelected}
					selectFilter={setFilterSelected}
					selectTag={setTagSelected}
					filterId={filter}
					tagsSelected={tags}
					marginBottom
				/>
				{projectId && (
					<ProjectHeader
						projectId={projectId}
						showProgress={tasksView}
					/>
				)}
				<Main>
					{projectId && <SidebarProjectInfos projectId={projectId} />}
					<Suspense fallback={<Loading />}>
						{projectId && view === 'shared-notes' && (
							<ProjectSharedNotes projectId={projectId} />
						)}
						{projectId && view === 'personal-notes' && (
							<ProjectPersonalNotes projectId={projectId} />
						)}
					</Suspense>
					{tasksView && (
						<Content>
							<CreateTask
								setProjectSelected={setProjectSelected}
								currentProjectId={projectId}
							/>
							<Suspense fallback={<Loading />}>
								<TasksListContainer
									projectId={projectId}
									linkedCustomerId={linkedCustomerId}
									filter={filter}
									tags={tags}
								/>
							</Suspense>
						</Content>
					)}
				</Main>
			</TaskAndArianne>
		</Container>
	);
}

export default TasksList;
