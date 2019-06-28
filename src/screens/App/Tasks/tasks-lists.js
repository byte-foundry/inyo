import styled from '@emotion/styled';
import moment from 'moment';
import React, {Suspense} from 'react';
import {useQuery} from 'react-apollo-hooks';
import YouTube from 'react-youtube';

import ArianneThread from '../../../components/ArianneThread';
import CreateTask from '../../../components/CreateTask';
import ProjectHeader from '../../../components/ProjectHeader';
import ProjectPersonalNotes from '../../../components/ProjectPersonalNotes';
import ProjectSharedNotes from '../../../components/ProjectSharedNotes';
import ProjectList from '../../../components/ProjectTasksList';
import SidebarProjectInfos from '../../../components/SidebarProjectInfos';
import TasksListComponent from '../../../components/TasksList';
import Tooltip from '../../../components/Tooltip';
import {
	Loading,
	ModalActions,
	ModalContainer,
	ModalElem,
} from '../../../utils/content';
import {
	A,
	Button,
	Container,
	Content,
	Heading,
	Help,
	Main,
	P,
	UL,
} from '../../../utils/new/design-system';
import {GET_ALL_TASKS} from '../../../utils/queries';

const PA = styled(P)`
	font-size: 16px;
`;

const IframeYouTube = styled(YouTube)`
	position: absolute;
	width: 100%;
	height: 100%;
`;

const YoutubeContainer = styled('div')`
	position: relative;
	overflow: hidden;
	width: 100%;
	height: 0;
	padding-bottom: 56.25%;
`;

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

	const tasks = data.me.tasks.filter(
		task => (!filter || task.status === filter || filter === 'ALL')
			&& (!task.section
				|| task.section.project.status === 'ONGOING'
				|| projectId)
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
		/>
	);
}

function TasksList({location, history}) {
	const {prevSearch} = location.state || {};
	const query = new URLSearchParams(prevSearch || location.search);
	const linkedCustomerId = query.get('customerId');
	const openModal = query.get('openModal');
	const openHelpModal = query.get('openHelpModal');
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
			<Tooltip label="Instructions pour utiliser l'interface">
				<Help
					id="help-button"
					customerToken
					onClick={() => history.push('?openHelpModal=true')}
				>
					?
				</Help>
			</Tooltip>
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
			{openModal && (
				<ModalContainer onDismiss={() => history.push('/app/tasks')}>
					<ModalElem>
						<Heading>Bienvenue sur Inyo,</Heading>
						<PA>
							Découvrez en 1'30min les options de bases de Inyo et
							commencez dès maintenant à optimiser vos journées!
						</PA>
						<YoutubeContainer>
							<IframeYouTube videoId="qBJvclaZ-yQ" />
						</YoutubeContainer>
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
			{openHelpModal && (
				<ModalContainer
					size="small"
					onDismiss={() => history.push('/app/tasks')}
				>
					<ModalElem>
						<Heading>Aide</Heading>
						<PA>
							Voici quelques liens pour vous aider à utiliser
							Inyo.
						</PA>
						<PA>
							<UL noBullet>
								<li>
									<span
										aria-labelledby="presentation-link"
										role="img"
									>
										🎬
									</span>{' '}
									-{' '}
									<A
										id="presentation-link"
										href=""
										onClick={() => history.push('?openModal=true')
										}
									>
										Voir la vidéo de présentation
									</A>
								</li>
								<li>
									<span
										aria-labelledby="new-task-link"
										role="img"
									>
										✅
									</span>{' '}
									-{' '}
									<A
										id="new-task-link"
										target="_blank"
										href="https://inyo.me/documentation/creer-une-nouvelle-tache/"
									>
										Créer une nouvelle tâche
									</A>
								</li>
								<li>
									<span
										aria-labelledby="new-client-link"
										role="img"
									>
										🤑
									</span>{' '}
									-{' '}
									<A
										id="new-client-link"
										target="_blank"
										href="https://inyo.me/documentation/liste-de-mes-clients/"
									>
										Créer un nouveau client
									</A>
								</li>
								<li>
									<span
										aria-labelledby="new-project-link"
										role="img"
									>
										🗂️
									</span>{' '}
									-{' '}
									<A
										id="new-project-link"
										target="_blank"
										href="https://inyo.me/documentation/creer-un-nouveau-projet/"
									>
										Créer un nouveau projet
									</A>
								</li>
								<li>
									<span
										aria-labelledby="use-template-link"
										role="img"
									>
										📝
									</span>{' '}
									-{' '}
									<A
										id="use-template-link"
										target="_blank"
										href="https://inyo.me/documentation/creer-un-nouveau-projet/utiliser-un-modele-predefini/"
									>
										Utiliser un modèle de projet
									</A>
								</li>
								<li>
									<span
										aria-labelledby="client-view-link"
										role="img"
									>
										🕵️
									</span>{' '}
									-{' '}
									<A
										id="client-view-link"
										target="_blank"
										href="https://inyo.me/documentation/les-principales-vues/vue-du-client-d-un-projet/"
									>
										Voir ce que voit le client
									</A>
								</li>
								<li>
									<span
										aria-labelledby="client-presentation-link"
										role="img"
									>
										🌀
									</span>{' '}
									-{' '}
									<A
										id="client-presentation-link"
										target="_blank"
										href="https://inyo.pro"
									>
										Présenter Inyo à votre client
									</A>
								</li>
							</UL>
						</PA>
						<PA>
							Une information est manquante? Contactez-nous via la
							messagerie en bas à droite, ou proposez des
							fonctionnalités sur{' '}
							<A
								target="_blank"
								href="https://inyo.me/produit/fonctionnalites/proposer-une-fonctionnalite/"
							>
								notre roadmap collaborative.
							</A>
						</PA>
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
