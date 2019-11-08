import styled from '@emotion/styled';
import moment from 'moment';
import React, {Suspense, useCallback} from 'react';
import {Redirect} from 'react-router-dom';

import ActivityFeed from '../../../components/ActivityFeed';
import ArianneThread from '../../../components/ArianneThread';
import CreateTask from '../../../components/CreateTask';
import HelpButton from '../../../components/HelpButton';
import PendingActionsTray from '../../../components/PendingActionsTray';
import ProjectBudget from '../../../components/ProjectBudget';
import ProjectHeader from '../../../components/ProjectHeader';
import ProjectPersonalNotes from '../../../components/ProjectPersonalNotes';
import ProjectSharedNotes from '../../../components/ProjectSharedNotes';
import ProjectList from '../../../components/ProjectTasksList';
import SidebarProjectInfos from '../../../components/SidebarProjectInfos';
import {useQuery} from '../../../utils/apollo-hooks';
import {Loading} from '../../../utils/content';
import {Container, Content, Main} from '../../../utils/new/design-system';
import {GET_PROJECT_DATA} from '../../../utils/queries';

const TaskAndArianne = styled('div')`
	display: flex;
	flex-direction: column;
	flex: auto;
`;

function TasksListContainer({projectId, filter, tags}) {
	const {data, error} = useQuery(GET_PROJECT_DATA, {
		variables: {projectId},
		suspend: true,
	});

	if (error) throw error;

	const {sections} = data.project;
	const allTasks = sections.reduce(
		(arr, section) => arr.concat(section.items),
		[],
	);

	const tasks = allTasks.filter(
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

	return (
		<ProjectList
			projectId={projectId}
			items={tasks.filter(
				item => item.section && item.section.project.id === projectId,
			)}
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

	const setFilterSelected = useCallback(
		(selected) => {
			const newQuery = new URLSearchParams(query);

			newQuery.delete('view');

			if (selected) {
				const {value: selectedFilterId} = selected;

				newQuery.set('filter', selectedFilterId);
			}

			history.push(`/app/tasks?${newQuery.toString()}`);
		},
		[query, history],
	);

	const setTagSelected = useCallback(
		(selected) => {
			const newQuery = new URLSearchParams(query);

			newQuery.delete('view');

			if (selected) {
				newQuery.delete('tags');
				selected.forEach(tag => newQuery.append('tags', tag.value));
			}

			history.push(`/app/tasks?${newQuery.toString()}`);
		},
		[query, history],
	);

	// the tasks list page doesn't exist anymore, redirecting to dashboard with the same filters
	if (!projectId || linkedCustomerId) {
		const redirectQuery = new URLSearchParams();

		if (linkedCustomerId) redirectQuery.append('customerId', linkedCustomerId);
		if (filter) redirectQuery.append('filter', filter);
		if (tags.length) redirectQuery.append('tags', tags);

		return (
			<Redirect
				to={{
					pathname: '/app/dashboard',
					search: `?${redirectQuery.toString()}`,
				}}
			/>
		);
	}

	const isTasksView = view === 'tasks' || !view;

	return (
		<Container>
			<HelpButton />
			<TaskAndArianne>
				<ProjectHeader
					projectId={projectId}
					showProgress={isTasksView}
				/>
				<Main>
					<SidebarProjectInfos projectId={projectId} />
					<Suspense fallback={<Loading />}>
						{view === 'shared-notes' && (
							<ProjectSharedNotes projectId={projectId} />
						)}
						{view === 'personal-notes' && (
							<ProjectPersonalNotes projectId={projectId} />
						)}
						{view === 'budget' && (
							<ProjectBudget projectId={projectId} />
						)}
						{view === 'activity' && (
							<ActivityFeed projectId={projectId} />
						)}
					</Suspense>
					{isTasksView && (
						<Content>
							<CreateTask currentProjectId={projectId} />
							<ArianneThread
								selectFilter={setFilterSelected}
								selectTag={setTagSelected}
								filterId={filter}
								tagsSelected={tags}
								marginTop
							/>
							<div
								style={{
									position: 'relative',
									minHeight: '200px',
								}}
							>
								<Suspense fallback={<Loading />}>
									<TasksListContainer
										projectId={projectId}
										filter={filter}
										tags={tags}
									/>
								</Suspense>
							</div>
						</Content>
					)}
					<Suspense fallback={null}>
						<PendingActionsTray projectId={projectId} />
					</Suspense>
				</Main>
			</TaskAndArianne>
		</Container>
	);
}

export default TasksList;
