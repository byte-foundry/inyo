import styled from '@emotion/styled/macro';
import React, {useState} from 'react';
import {Route, useHistory} from 'react-router-dom';

import CreateProjectModal from '../../../components/CreateProjectModal';
import HelpButton from '../../../components/HelpButton';
import IconButton from '../../../components/IconButton';
import RemoveProjectModal from '../../../components/RemoveProjectModal';
import TasksProgressBar from '../../../components/TasksProgressBar';
import Tooltip from '../../../components/Tooltip';
import fbt from '../../../fbt/fbt.macro';
import {useMutation, useQuery} from '../../../utils/apollo-hooks';
import {BREAKPOINTS} from '../../../utils/constants';
import {
	FlexColumn,
	FlexRow,
	ModalActions,
	ModalContainer,
	ModalElem,
} from '../../../utils/content';
import noArchivedIllus from '../../../utils/images/bermuda-no-message.svg';
import IllusBackground from '../../../utils/images/empty-project-background.svg';
import IllusFigure from '../../../utils/images/empty-project-illus.svg';
import {
	ARCHIVE_PROJECT,
	CREATE_PROJECT,
	UNARCHIVE_PROJECT,
} from '../../../utils/mutations';
import {
	accentGrey,
	Button,
	ButtonLink,
	Container,
	Content,
	IllusContainer,
	IllusFigureContainer,
	IllusText,
	IllusTextIcon,
	lightGrey,
	Main,
	P,
	primaryGrey,
	primaryPurple,
	primaryRed,
	SubHeading,
} from '../../../utils/new/design-system';
import {onboardingTemplate} from '../../../utils/project-templates';
import {GET_ALL_PROJECTS} from '../../../utils/queries';
import useUserInfos from '../../../utils/useUserInfos';

const ProjectTitle = styled(SubHeading)`
	color: ${primaryGrey};
	font-size: 1.3rem;
	font-weight: 400;
	text-transform: none;
	margin-bottom: 0.5rem;
	flex: 1;
	position: relative;
`;

const ProjectHeader = styled('div')`
	position: relative;
	display: flex;
	flex-direction: row;
	justify-content: space-between;

	:hover ${ProjectTitle} {
		&:before {
			content: '';
			display: block;
			background: ${lightGrey};
			position: absolute;
			left: -0.5rem;
			top: -0.5rem;
			right: -0.5rem;
			bottom: -0.5rem;
			border-radius: 8px;
			z-index: -1;
		}
	}
`;

const ActionsIconContainer = styled('div')`
	cursor: pointer;
	position: relative;
	padding: 0 0 0 0.5rem;
	margin-top: -0.25rem;
	margin-left: 1rem;
	display: flex;
	align-items: center;

	transition: all 300ms ease;
	margin-right: -3rem;
	opacity: 0;

	pointer-events: none;
`;

const ProjectItem = styled('div')`
	cursor: pointer;
	position: relative;
	margin-bottom: 0.5rem;
	background: ${props => (props.archived ? lightGrey : 'transparent')};
	${props => props.archived
		&& `
			margin: 0px -10px 0.5rem;
			border-radius: 5px;
			padding: 10px;
	`}

	:hover ${ProjectTitle} {
		color: ${primaryPurple};
	}

	:hover ${ActionsIconContainer} {
		pointer-events: all;
		margin-right: 0;
		opacity: 1;
	}
`;

const TrashButton = styled(Button)`
	padding: 0 0 0 0.25rem;
	border: none;
	border-radius: 50%;

	svg {
		fill: ${accentGrey};
	}

	&:hover {
		background: none;
		svg {
			fill: ${primaryRed};
		}
	}
`;

const ArchiveButton = styled(Button)`
	padding: 0 0 0 0.25rem;
	border: none;
	border-radius: 50%;

	svg {
		fill: ${accentGrey};
	}

	&:hover {
		background: none;
		svg {
			fill: ${primaryPurple};
		}
	}
`;

const ButtonsRow = styled(FlexRow)`
	margin: 3rem 0;
	justify-content: flex-end;

	@media (max-width: ${BREAKPOINTS.mobile}px) {
		margin: 0 0 2rem;

		${ButtonLink} {
			flex: 1;
		}
	}
`;

const EmptyProjectList = styled(FlexColumn)`
	align-items: center;
	margin: auto;
	width: 305px;
	margin-top: 1rem;
`;

const SubHeadingProject = styled(SubHeading)`
	margin-bottom: 1.5rem;
`;

const Projects = () => {
	const history = useHistory();
	const {language} = useUserInfos();
	const [removeProjectModal, setRemoveProjectModal] = useState(false);
	const [projectId, setProjectId] = useState(false);
	const [seeArchived, setSeeArchived] = useState(false);
	const [openModeleModal, setOpenModeleModal] = useState(false);
	const [openDuplicateModal, setOpenDuplicateModal] = useState(false);
	const {
		data: {
			me: {projects},
		},
	} = useQuery(GET_ALL_PROJECTS, {suspend: true});
	const [createProject] = useMutation(CREATE_PROJECT);
	const [archiveProject] = useMutation(ARCHIVE_PROJECT);
	const [unarchiveProject] = useMutation(UNARCHIVE_PROJECT);

	const unarchivedProject = projects.filter(
		project => project.status !== 'ARCHIVED' && project.status !== 'REMOVED',
	);
	const archivedProject = projects.filter(
		project => project.status === 'ARCHIVED',
	);

	return (
		<Container style={{minHeight: '100vh'}}>
			<HelpButton />
			<Main>
				<Content
					small={
						unarchivedProject.length > 0
						|| archivedProject.length > 0
					}
				>
					<ButtonsRow>
						<ButtonLink to="/app/projects/create" big>
							<fbt project="inyo" desc="create project">
								Nouveau projet
							</fbt>
						</ButtonLink>
					</ButtonsRow>
					{unarchivedProject.length === 0
						&& archivedProject.length === 0 && (
						<IllusContainer bg={IllusBackground}>
							<IllusFigureContainer fig={IllusFigure} big />
							<IllusText>
								<fbt project="inyo" desc="no project">
									<P>Aucun projet en cours?</P>
									<P>
											Créez un projet à partir de zéro, ou
											gagnez du temps en utilisant un
											modèle existant{' '}
										<IllusTextIcon
											onClick={() => setOpenModeleModal(true)
											}
										>
												?
										</IllusTextIcon>{' '}
											ou en vous basant sur un de vos
											anciens projets{' '}
										<fbt:param name="link">
											<IllusTextIcon
												onClick={() => setOpenDuplicateModal(
													true,
												)
												}
											>
													?
											</IllusTextIcon>
										</fbt:param>
											.
									</P>
									<P>
											Vous pouvez aussi tester notre
											projet fictif et comprendre comment
											inyo fonctionne.
									</P>
								</fbt>
								<Button
									grey
									big
									centered
									onClick={async () => {
										const deadLineForOnboardingProjet = new Date();

										deadLineForOnboardingProjet.setDate(
											new Date().getDate() + 10,
										);

										const {
											data: {
												createProject: createdProject,
											},
										} = await createProject({
											variables: {
												template: 'BLANK',
												customer: {
													name: 'Client test',
													email: 'edwige@inyo.me',
													firstName: 'Edwige',
												},
												sections:
														onboardingTemplate[
															language
														].sections,
												name: fbt(
													'Bienvenue, découvrez votre smart assistant!',
													'welcome project name',
												),
												deadline: deadLineForOnboardingProjet.toISOString(),
											},
										});

										history.push(
											`/app/tasks?projectId=${createdProject.id}`,
										);
									}}
								>
									<fbt project="inyo" desc="begin">
											Commencer
									</fbt>
								</Button>
							</IllusText>
						</IllusContainer>
					)}
					{openModeleModal && (
						<ModalContainer
							size="small"
							onDismiss={() => setOpenModeleModal(false)}
						>
							<ModalElem>
								<fbt project="inyo" desc="notification message">
									<SubHeading>
										Utiliser un de nos modèles
									</SubHeading>
									<P>
										Les modèles sont composés d'un ensemble
										de tâches prédéfinies. Ils vous
										permettront de démarrer vos projets sur
										de bonnes bases.
									</P>
									<P>
										Nous les avons construits en
										collaboration avec des freelances
										expérimentés dans leur domaines (design,
										développement, etc.)
									</P>
									<ModalActions>
										<Button
											onClick={() => setOpenModeleModal(false)
											}
										>
											J'ai compris
										</Button>
									</ModalActions>
								</fbt>
							</ModalElem>
						</ModalContainer>
					)}
					{openDuplicateModal && (
						<ModalContainer
							size="small"
							onDismiss={() => setOpenDuplicateModal(false)}
						>
							<ModalElem>
								<fbt project="inyo" desc="duplicate message">
									<SubHeading>
										Se baser sur l'un de vos anciens projets
									</SubHeading>
									<P>
										Vous avez le sentiment que beaucoup de
										vos projets se ressemblent?
									</P>
									<P>
										Utilisez votre expérience passée pour
										éviter de perdre du temps à recréer vos
										choses à faire, et devisez au plus juste
										en vous basant sur le temps réellement
										passés sur chacune des tâches.
									</P>
									<ModalActions>
										<Button
											onClick={() => setOpenDuplicateModal(false)
											}
										>
											J'ai compris
										</Button>
									</ModalActions>
								</fbt>
							</ModalElem>
						</ModalContainer>
					)}
					{(unarchivedProject.length > 0
						|| archivedProject.length > 0) && (
						<>
							<SubHeadingProject>
								<fbt project="inyo" desc="project in progress">
									Projets en cours
								</fbt>
							</SubHeadingProject>
							{unarchivedProject.map(project => (
								<ProjectItem
									key={project.id}
									onClick={() => history.push(
										`/app/tasks?projectId=${project.id}`,
									)
									}
								>
									<ProjectHeader>
										<ProjectTitle>
											{project.name}
										</ProjectTitle>
										<ActionsIconContainer>
											<Tooltip
												label={
													<fbt
														project="inyo"
														desc="delete project"
													>
														Supprimer ce projet
													</fbt>
												}
											>
												<TrashButton
													onClick={(e) => {
														e.stopPropagation();
														setRemoveProjectModal(
															true,
														);
														setProjectId(
															project.id,
														);
													}}
													link
												>
													<IconButton
														icon="delete_forever"
														size="tiny"
														danger
													/>
												</TrashButton>
											</Tooltip>
											<Tooltip
												label={fbt(
													'Archiver ce projet',
													'Archive project button',
												)}
											>
												<ArchiveButton
													link
													onClick={(e) => {
														e.stopPropagation();
														archiveProject({
															variables: {
																projectId:
																	project.id,
															},
														});
													}}
												>
													<IconButton
														icon="archive"
														size="tiny"
													/>
												</ArchiveButton>
											</Tooltip>
										</ActionsIconContainer>
									</ProjectHeader>
									<TasksProgressBar project={project} />
								</ProjectItem>
							))}
							<ButtonsRow>
								{!seeArchived && (
									<Button
										onClick={() => setSeeArchived(true)}
									>
										<fbt
											project="inyo"
											desc="see all project"
										>
											Voir tous les projets
										</fbt>
									</Button>
								)}
								{seeArchived && (
									<Button
										onClick={() => setSeeArchived(false)}
									>
										<fbt
											project="inyo"
											desc="see only in progress project"
										>
											Voir uniquement les projets en cours
										</fbt>
									</Button>
								)}
							</ButtonsRow>
							{seeArchived && (
								<>
									<SubHeadingProject>
										<fbt
											project="inyo"
											desc="archived projects"
										>
											Projets archivés
										</fbt>
									</SubHeadingProject>
									{archivedProject.length === 0 && (
										<EmptyProjectList>
											<img
												alt=""
												src={noArchivedIllus}
												height="300px"
											/>
											<P>
												<fbt
													project="inyo"
													desc="no archived project"
												>
													Une fois vos projets
													terminés, archivez-les pour
													vous concentrer sur les
													projets en cours.
												</fbt>
											</P>
										</EmptyProjectList>
									)}
									{archivedProject.map(project => (
										<ProjectItem
											key={project.id}
											onClick={() => history.push(
												`/app/tasks?projectId=${project.id}`,
											)
											}
											archived
										>
											<ProjectHeader>
												<ProjectTitle>
													{project.name}
												</ProjectTitle>
												<ActionsIconContainer>
													<Tooltip
														label={
															<fbt
																project="inyo"
																desc="delete project"
															>
																Supprimer ce
																projet
															</fbt>
														}
													>
														<TrashButton
															link
															onClick={(e) => {
																e.stopPropagation();
																setRemoveProjectModal(
																	true,
																);
																setProjectId(
																	project.id,
																);
															}}
														>
															<IconButton
																icon="delete_forever"
																size="tiny"
																danger
															/>
														</TrashButton>
													</Tooltip>
													<Tooltip
														label={
															<fbt
																project="inyo"
																desc="unarchive project"
															>
																Désarchiver ce
																projet
															</fbt>
														}
													>
														<ArchiveButton
															link
															onClick={(e) => {
																e.stopPropagation();
																unarchiveProject(
																	{
																		variables: {
																			projectId:
																				project.id,
																		},
																	},
																);
															}}
														>
															<IconButton
																icon="unarchive"
																size="tiny"
															/>
														</ArchiveButton>
													</Tooltip>
												</ActionsIconContainer>
											</ProjectHeader>
											<TasksProgressBar
												project={project}
											/>
										</ProjectItem>
									))}
								</>
							)}
						</>
					)}
				</Content>
			</Main>
			{removeProjectModal && (
				<RemoveProjectModal
					closeModal={() => setRemoveProjectModal(false)}
					projectId={projectId}
				/>
			)}
			<Route
				path="/app/projects/create"
				render={({location: {state = {}}, history}) => (
					<CreateProjectModal
						baseName={state.name}
						onDismiss={() => history.push('/app/projects')}
					/>
				)}
			/>
		</Container>
	);
};

export default Projects;
