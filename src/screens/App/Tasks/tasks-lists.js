import React, {Suspense, memo} from 'react';
import styled from '@emotion/styled';
import {useQuery} from 'react-apollo-hooks';
import ReactTooltip from 'react-tooltip';

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

const PA = styled(P)`
	font-size: 16px;
`;

const Container = styled('div')`
	display: flex;
	justify-content: center;
	flex: 1;

	@media (max-width: ${BREAKPOINTS}px) {
		flex-direction: column;
	}
`;

const TaskAndArianne = styled('div')`
	flex: auto;
	max-width: 980px;
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

		if (selected) {
			const {value: selectedFilterId} = selected;

			newQuery.set('filter', selectedFilterId);
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
					selectFilter={setFilterSelected}
					filterId={filter}
				/>
				{projectId && <ProjectHeader projectId={projectId} />}
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
			</TaskAndArianne>
			{query.get('projectId') && (
				<SidebarProjectInfos projectId={query.get('projectId')} />
			)}
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
