import React, {Suspense} from 'react';
import styled from '@emotion/styled';
import {useQuery} from 'react-apollo-hooks';
import ReactTooltip from 'react-tooltip';
import YouTube from 'react-youtube';

import {GET_ALL_TASKS} from '../../../utils/queries';
import {
	Loading,
	ModalContainer,
	ModalElem,
	ModalActions,
} from '../../../utils/content';
import {Heading, Button, P} from '../../../utils/new/design-system';
import {TOOLTIP_DELAY, BREAKPOINTS} from '../../../utils/constants';

import ProjectHeader from '../../../components/ProjectHeader';
import ProjectList from '../../../components/ProjectTasksList';
import TasksListComponent from '../../../components/TasksList';
import ArianneThread from '../../../components/ArianneThread';
import CreateTask from '../../../components/CreateTask';
import SidebarProjectInfos from '../../../components/SidebarProjectInfos';
import ProjectSharedNotes from '../../../components/ProjectSharedNotes';
import ProjectPersonalNotes from '../../../components/ProjectPersonalNotes';

const PA = styled(P)`
	font-size: 16px;
`;

const Container = styled('div')`
	display: flex;
	flex: 1;
	max-width: 1280px;
	margin: 0 auto;

	@media (max-width: ${BREAKPOINTS}px) {
		flex-direction: column;
	}
`;

const IframeYouTube = styled(YouTube)`
	width: 100%;
`;

const TaskAndArianne = styled('div')`
	display: flex;
	flex-direction: column;
	flex: auto;
`;

const Main = styled('div')`
	display: flex;
	flex-direction: row;
	justify-content: space-between;

	@media (max-width: ${BREAKPOINTS}px) {
		flex-direction: column-reverse;
	}
`;

const Content = styled('div')`
	display: flex;
	flex-direction: column;
	flex: auto;
`;

function TasksListContainer({projectId, linkedCustomerId, filter}) {
	const {data, error} = useQuery(GET_ALL_TASKS, {
		variables: {
			linkedCustomerId: linkedCustomerId || undefined,
		},
	});

	if (error) throw error;

	const tasks = data.me.tasks.filter(
		task => !filter || task.status === filter || filter === 'ALL',
	);

	// order by creation date
	tasks.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

	if (projectId) {
		return (
			<>
				<ProjectList
					projectId={projectId}
					items={tasks.filter(
						item => item.section
							&& item.section.project.id === projectId,
					)}
				/>
				<ReactTooltip effect="solid" delayShow={TOOLTIP_DELAY} />
			</>
		);
	}

	return (
		<>
			<TasksListComponent
				items={[...tasks]}
				projectId={projectId}
				customerId={linkedCustomerId}
			/>
			<ReactTooltip effect="solid" delayShow={TOOLTIP_DELAY} />
		</>
	);
}

function TasksList({location, history}) {
	const {prevSearch} = location.state || {};
	const query = new URLSearchParams(prevSearch || location.search);
	const linkedCustomerId = query.get('customerId');
	const openModal = query.get('openModal');
	const projectId = query.get('projectId');
	const filter = query.get('filter');
	const view = query.get('view');

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

	const tasksView = (projectId && (view === 'tasks' || !view)) || !projectId;

	return (
		<Container>
			<TaskAndArianne>
				<ArianneThread
					projectId={projectId}
					linkedCustomerId={linkedCustomerId}
					selectCustomer={setCustomerSelected}
					selectProjects={setProjectSelected}
					selectFilter={setFilterSelected}
					filterId={filter}
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
								setCustomerSelected={setCustomerSelected}
							/>
							<Suspense fallback={<Loading />}>
								<TasksListContainer
									projectId={projectId}
									linkedCustomerId={linkedCustomerId}
									filter={filter}
								/>
							</Suspense>
						</Content>
					)}
				</Main>
			</TaskAndArianne>
			{openModal && (
				<ModalContainer onDismiss={() => history.push('/app/tasks')}>
					<ModalElem>
						<Heading>Bienvenue sur Inyo,</Heading>
						<PA>
							Découvrez en 1'30min les options de bases de Inyo et
							commencez dès maintenant à optimiser vos journées!
						</PA>
						<IframeYouTube videoId="qBJvclaZ-yQ" />
						<ModalActions>
							<Button
								big
								primary
								onClick={() => history.push('/app/tasks')}
							>
								J'ai compris!
							</Button>
						</ModalActions>
					</ModalElem>
				</ModalContainer>
			)}
		</Container>
	);
}

export default TasksList;
