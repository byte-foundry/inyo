import React, {Suspense} from 'react';
import styled from '@emotion/styled';
import {useQuery} from 'react-apollo-hooks';
import ReactTooltip from 'react-tooltip';
import moment from 'moment';

import {GET_ALL_TASKS} from '../../../utils/queries';
import {
	Loading,
	ModalContainer,
	ModalElem,
	ModalActions,
} from '../../../utils/content';
import {
	Heading,
	Button,
	P,
	Main,
	Container,
	Content,
} from '../../../utils/new/design-system';
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

const TaskAndArianne = styled('div')`
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
							Pour découvrir comment fonctionne Inyo, nous avons
							créé plusieurs tâches qui reprennent les
							fonctionnalités de base. Vous pouvez les retrouver
							sur la vue "Tâches" qui regroupe toutes les tâches
							créées tous projets confondus, ou les filtrer grâce
							aux filtres en haut de la page.
						</PA>
						<PA>
							À tout moment vous pouvez utiliser le champ
							principal pour créer une tâche personnelle ou pour
							un client, et même un projet complet à partir d'un
							modèle.
						</PA>
						<PA>
							Commencez par cliquer sur la 1ère tâche et optimisez
							votre activité dès aujourd'hui!
						</PA>

						<PA>
							Edwige,
							<br />
							votre Smart Assistant.
						</PA>
						<ModalActions>
							<Button
								big
								primary
								onClick={() => history.push('/app/tasks')}
							>
								C'est parti!
							</Button>
						</ModalActions>
					</ModalElem>
				</ModalContainer>
			)}
		</Container>
	);
}

export default TasksList;
