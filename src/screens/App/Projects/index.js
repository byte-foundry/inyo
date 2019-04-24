import React, {useState} from 'react';
import styled from '@emotion/styled/macro';
import {withRouter} from 'react-router-dom';
import {useQuery, useMutation} from 'react-apollo-hooks';
import ReactTooltip from 'react-tooltip';

import RemoveProjectModal from '../../../components/RemoveProjectModal';
import TasksProgressBar from '../../../components/TasksProgressBar';

import {ReactComponent as TrashIcon} from '../../../utils/icons/trash-icon.svg';
import {ReactComponent as ArchiveIcon} from '../../../utils/icons/archive-icon.svg';
import {ReactComponent as UnarchiveIcon} from '../../../utils/icons/unarchive-icon.svg';
import noArchivedIllus from '../../../utils/images/bermuda-no-message.svg';
import IllusBackground from '../../../utils/images/empty-project-background.svg';
import IllusFigure from '../../../utils/images/empty-project-illus.svg';

import {TOOLTIP_DELAY} from '../../../utils/constants';
import {FlexRow, FlexColumn} from '../../../utils/content';
import {onboardingTemplate} from '../../../utils/project-templates';

import {GET_ALL_PROJECTS} from '../../../utils/queries';
import {
	ARCHIVE_PROJECT,
	UNARCHIVE_PROJECT,
	CREATE_PROJECT,
} from '../../../utils/mutations';
import {ModalContainer, ModalElem, ModalActions} from '../../../utils/content';
import {
	Main,
	Container,
	Content,
	SubHeading,
	Button,
	primaryGrey,
	primaryPurple,
	lightGrey,
	accentGrey,
	primaryRed,
	P,
	IllusFigureContainer,
	IllusContainer,
	IllusText,
	IllusTextIcon,
} from '../../../utils/new/design-system';

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

function Projects({history}) {
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
	const createProject = useMutation(CREATE_PROJECT);
	const archiveProject = useMutation(ARCHIVE_PROJECT);
	const unarchiveProject = useMutation(UNARCHIVE_PROJECT);

	const unarchivedProject = projects.filter(
		project => project.status !== 'ARCHIVED' && project.status !== 'REMOVED',
	);
	const archivedProject = projects.filter(
		project => project.status === 'ARCHIVED',
	);

	return (
		<Container>
			<ReactTooltip effect="solid" delayShow={TOOLTIP_DELAY} />
			<Main>
				<Content
					small={
						unarchivedProject.length > 0
						|| archivedProject.length > 0
					}
				>
					<ButtonsRow>
						<Button
							big
							onClick={async () => {
								const {
									data: {
										createProject: {id},
									},
								} = await createProject();

								history.push(`/app/tasks?projectId=${id}`);
							}}
						>
							Nouveau projet
						</Button>
					</ButtonsRow>
					{unarchivedProject.length === 0
						&& archivedProject.length === 0 && (
						<IllusContainer bg={IllusBackground}>
							<IllusFigureContainer fig={IllusFigure} big />
							<IllusText>
								<P>Aucun projet en cours?</P>
								<P>
										Créez un projet à partir de zéro, ou
										gagnez du temps en utilisant un modèle
										existant{' '}
									<IllusTextIcon
										onClick={() => setOpenModeleModal(true)
										}
									>
											?
									</IllusTextIcon>{' '}
										ou en vous basant sur un de vos anciens
										projets{' '}
									<IllusTextIcon
										onClick={() => setOpenDuplicateModal(true)
										}
									>
											?
									</IllusTextIcon>
										.
								</P>
								<P>
										Vous pouvez aussi tester notre projet
										fictif et comprendre comment inyo
										fonctionne.
								</P>
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
														onboardingTemplate.sections,
												name:
														'Bienvenue, découvrez votre smart assistant!',
												deadline: deadLineForOnboardingProjet.toISOString(),
											},
										});

										history.push(
											`/app/tasks?projectId=${
												createdProject.id
											}`,
										);
									}}
								>
										Commencer
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
								<SubHeading>
									Utiliser un de nos modèles
								</SubHeading>
								<P>
									Les modèles sont composés d'un ensemble de
									tâches prédéfinies. Ils vous permettront de
									démarrer vos projets sur de bonnes bases.
								</P>
								<P>
									Nous les avons construits en collaboration
									avec des freelances expérimentés dans leur
									domaines (design, développement, etc.)
								</P>
								<ModalActions>
									<Button
										onClick={() => setOpenModeleModal(false)
										}
									>
										J'ai compris
									</Button>
								</ModalActions>
							</ModalElem>
						</ModalContainer>
					)}
					{openDuplicateModal && (
						<ModalContainer
							size="small"
							onDismiss={() => setOpenDuplicateModal(false)}
						>
							<ModalElem>
								<SubHeading>
									Se baser sur l'un de vos anciens projets
								</SubHeading>
								<P>
									Vous avez le sentiment que beaucoup de vos
									projets se ressemblent?
								</P>
								<P>
									Utilisez votre expérience passée pour éviter
									de perdre du temps à recréer vos choses à
									faire, et devisez au plus juste en vous
									basant sur le temps réellement passés sur
									chacune des tâches.
								</P>
								<ModalActions>
									<Button
										onClick={() => setOpenDuplicateModal(false)
										}
									>
										J'ai compris
									</Button>
								</ModalActions>
							</ModalElem>
						</ModalContainer>
					)}
					{(unarchivedProject.length > 0
						|| archivedProject.length > 0) && (
						<>
							<SubHeadingProject>
								Projets en cours
							</SubHeadingProject>
							{unarchivedProject.map(project => (
								<ProjectItem
									onClick={() => history.push(
										`/app/tasks?projectId=${
											project.id
										}`,
									)
									}
								>
									<ProjectHeader>
										<ProjectTitle>
											{project.name}
										</ProjectTitle>
										<ActionsIconContainer>
											<TrashButton
												onClick={(e) => {
													e.stopPropagation();
													setRemoveProjectModal(true);
													setProjectId(project.id);
												}}
												data-tip="Supprimer ce projet"
											>
												<TrashIcon />
											</TrashButton>
											<ArchiveButton
												onClick={(e) => {
													e.stopPropagation();
													archiveProject({
														variables: {
															projectId:
																project.id,
														},
													});
												}}
												data-tip="Archiver ce projet"
											>
												<ArchiveIcon />
											</ArchiveButton>
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
										Voir tous les projets
									</Button>
								)}
								{seeArchived && (
									<Button
										onClick={() => setSeeArchived(false)}
									>
										Voir uniquement les projets en cours
									</Button>
								)}
							</ButtonsRow>
							{seeArchived && (
								<>
									<SubHeadingProject>
										Projets archivés
									</SubHeadingProject>
									{archivedProject.length === 0 && (
										<EmptyProjectList>
											<img
												src={noArchivedIllus}
												height="300px"
											/>
											<P>
												Une fois vos projets terminés,
												archivez-les pour vous
												concentrer sur les projets en
												cours.
											</P>
										</EmptyProjectList>
									)}
									{archivedProject.map(project => (
										<ProjectItem
											onClick={() => history.push(
												`/app/tasks?projectId=${
													project.id
												}`,
											)
											}
											archived
										>
											<ProjectHeader>
												<ProjectTitle>
													{project.name}
												</ProjectTitle>
												<ActionsIconContainer>
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
														data-tip="Supprimer ce projet"
													>
														<TrashIcon />
													</TrashButton>
													<ArchiveButton
														onClick={(e) => {
															e.stopPropagation();
															unarchiveProject({
																variables: {
																	projectId:
																		project.id,
																},
															});
														}}
														data-tip="Désarchiver ce projet"
													>
														<UnarchiveIcon />
													</ArchiveButton>
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
		</Container>
	);
}

export default withRouter(Projects);
