import React, {useState} from 'react';
import styled from '@emotion/styled/macro';
import {withRouter} from 'react-router-dom';
import {useQuery, useMutation} from 'react-apollo-hooks';
import ReactTooltip from 'react-tooltip';

import TasksProgressBar from '../../../components/TasksProgressBar';
import {ReactComponent as TrashIcon} from '../../../utils/icons/trash-icon.svg';
import {ReactComponent as ArchiveIcon} from '../../../utils/icons/archive-icon.svg';
import {ReactComponent as UnarchiveIcon} from '../../../utils/icons/unarchive-icon.svg';
import noArchivedIllus from '../../../utils/images/bermuda-no-message.svg';

import {TOOLTIP_DELAY} from '../../../utils/constants';
import {
	ModalContainer,
	ModalElem,
	ModalActions,
	FlexRow,
	FlexColumn,
} from '../../../utils/content';

import {GET_ALL_PROJECTS} from '../../../utils/queries';
import {
	REMOVE_PROJECT,
	ARCHIVE_PROJECT,
	UNARCHIVE_PROJECT,
	CREATE_PROJECT,
} from '../../../utils/mutations';
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
	Heading,
	P,
} from '../../../utils/new/design-system';

const SmallContent = styled(Content)`
	max-width: 640px;
	margin: 0 auto;
`;

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
	const {
		data: {
			me: {projects},
		},
		errors: errorsProject,
	} = useQuery(GET_ALL_PROJECTS);
	const createProject = useMutation(CREATE_PROJECT);
	const removeProject = useMutation(REMOVE_PROJECT);
	const archiveProject = useMutation(ARCHIVE_PROJECT);
	const unarchiveProject = useMutation(UNARCHIVE_PROJECT);

	const unarchivedProject = projects.filter(
		project => project.status !== 'ARCHIVED' && project.status !== 'REMOVED',
	);
	const archivedProject = projects.filter(
		project => project.status == 'ARCHIVED',
	);

	return (
		<Container>
			<ReactTooltip effect="solid" delayShow={TOOLTIP_DELAY} />
			<Main>
				<SmallContent>
					<ButtonsRow>
						<Button
							big
							onClick={async () => {
								const {
									data: {
										createProject: {id, name},
									},
								} = await createProject();

								history.push(`/app/tasks?projectId=${id}`);
							}}
						>
							Nouveau projet
						</Button>
					</ButtonsRow>
					<SubHeadingProject>Projets en cours</SubHeadingProject>
					{unarchivedProject.map(project => (
						<ProjectItem
							onClick={() => history.push(
								`/app/tasks?projectId=${project.id}`,
							)
							}
						>
							<ProjectHeader>
								<ProjectTitle>{project.name}</ProjectTitle>
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
													projectId: project.id,
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
							<Button onClick={() => setSeeArchived(true)}>
								Voir tous les projets
							</Button>
						)}
						{seeArchived && (
							<Button onClick={() => setSeeArchived(false)}>
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
									<img src={noArchivedIllus} height="300px" />
									<P>
										Une fois vos projets terminés,
										archivez-les pour vous concentrer sur
										les projets en cours.
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
									<TasksProgressBar project={project} />
								</ProjectItem>
							))}
						</>
					)}
				</SmallContent>
			</Main>
			{removeProjectModal && (
				<ModalContainer onDismiss={() => setRemoveProjectModal(false)}>
					<ModalElem>
						<Heading>
							Êtes-vous sûr de vouloir supprimer ce projet ?
						</Heading>
						<P>
							En ce supprimant ce projet vous perdrez toutes les
							données.
						</P>
						<P>
							Cette option est présente pour supprimer un projet
							créé par erreur.
						</P>
						<P>
							Pour les projets terminés, préférez l'archivage :)
						</P>
						<ModalActions>
							<Button
								grey
								onClick={() => setRemoveProjectModal(false)}
							>
								Annuler
							</Button>
							<Button
								primary
								onClick={() => archiveProject({
									variables: {
										projectId,
									},
								})
								}
							>
								Archiver le projet
							</Button>
							<Button
								red
								onClick={() => removeProject({
									variables: {
										projectId,
									},
								})
								}
							>
								Supprimer le projet
							</Button>
						</ModalActions>
					</ModalElem>
				</ModalContainer>
			)}
		</Container>
	);
}

export default withRouter(Projects);
