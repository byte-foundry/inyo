import styled from '@emotion/styled/macro';
import moment from 'moment';
import React, {useRef, useState} from 'react';
import {useMutation, useQuery} from 'react-apollo-hooks';
import {withRouter} from 'react-router-dom';
import useOnClickOutside from 'use-onclickoutside';

import {BREAKPOINTS} from '../../utils/constants';
import {ModalContainer} from '../../utils/content';
import noNotificationsIllus from '../../utils/images/bermuda-no-comments.svg';
import noClientIllus from '../../utils/images/bermuda-page-not-found.svg';
import {
	ARCHIVE_PROJECT,
	UNARCHIVE_PROJECT,
	UPDATE_PROJECT,
} from '../../utils/mutations';
import {
	Aside,
	BigNumber,
	Button,
	DateContainer,
	P,
	primaryGrey,
	primaryPurple,
	primaryWhite,
	SubHeading,
} from '../../utils/new/design-system';
import {GET_PROJECT_INFOS} from '../../utils/queries';
import CollabLinkToProjectList from '../CollabLinkToProjectList';
import CollaboratorModal from '../CollaboratorModal';
import ConfirmModal from '../ConfirmModal';
import CreateProjectLinkButton from '../CreateProjectLinkButton';
import CustomerModalAndMail from '../CustomerModalAndMail';
import CustomerNameAndAddress from '../CustomerNameAndAddress';
import DateInput from '../DateInput';
import DuplicateProjectButton from '../DuplicateProjectButton';
import IconButton from '../IconButton';
import MaterialIcon from '../MaterialIcon';
import Plural from '../Plural';
import RemoveProjectButton from '../RemoveProjectButton';
import StaticCustomerView from '../StaticCustomerView';
import Tooltip from '../Tooltip';

const SubSection = styled('div')`
	margin-bottom: 1.5rem;

	@media (max-width: ${BREAKPOINTS}px) {
		margin-bottom: 1rem;
	}
`;

const Actions = styled('div')`
	margin-bottom: 0.5rem;

	svg {
		max-width: 1rem;
		max-height: 1rem;
		margin-right: 0.5rem;
	}
`;

const PreviewModal = styled(ModalContainer)`
	min-height: 500px;
	padding: 0;
`;

const Notice = styled(P)`
	color: #fff;
	background: ${primaryPurple};
	padding: 10px;
	text-align: center;
	margin: 0;
`;

const Checked = styled('div')``;
const NotChecked = styled('div')``;

const CheckBoxFakeLabel = styled('div')`
	margin-left: 10px;
`;

const CheckBoxLabel = styled('label')`
	font-size: 13px;
	margin: 0.5em 0;
	color: ${primaryPurple};
	cursor: pointer;

	display: flex;
	align-items: center;

	input[type='checkbox'] {
		position: absolute;
		opacity: 0;
		cursor: pointer;
		height: 0;
		width: 0;
	}

	${NotChecked} {
		display: ${props => (props.checked ? 'none' : 'inline-flex')};
	}
	${Checked} {
		display: ${props => (props.checked ? 'inline-flex' : 'none')};
	}
`;

const SidebarLink = styled('div')`
	display: block;
	align-items: center;
	color: ${props => (props.active ? primaryPurple : primaryGrey)};
	text-decoration: none;
	font-weight: 500;
	margin-bottom: 0.4rem;
	cursor: ${props => (props.active ? 'default' : 'pointer')};
	pointer-events: ${props => (props.active ? 'none' : 'all')};
	position: relative;
	max-width: calc(100% - 2rem);

	@media (max-width: ${BREAKPOINTS}px) {
		display: flex;
	}

	div {
		&:after {
			display: ${props => (props.active ? 'block' : 'none')};
		}
		i {
			color: ${props => (props.active ? primaryWhite : '')} !important;
		}
	}
`;

const SidebarHeading = styled(SubHeading)`
	display: flex;
	justify-content: space-between;
`;

const SidebarBigNumber = styled(BigNumber)`
	margin: 15px 0;
`;

const Illus = styled('img')`
	max-width: 80%;
	max-height: 200px;
	margin: 1rem auto;
`;

const PencilElem = styled(IconButton)`
	cursor: pointer;
	position: absolute;
	left: 0;
	top: -2px;

	display: none;
`;

const CustomerInfos = styled('div')`
	position: relative;
	margin-left: -2rem;
	padding-left: 2rem;

	&:hover {
		${PencilElem} {
			display: flex;
		}
	}
`;

const CollabLinkToProjectContainer = styled('div')`
	position: relative;
	margin-left: -2rem;
	padding-left: 2rem;
	cursor: pointer;

	&:hover {
		${PencilElem} {
			display: flex;
		}
	}
`;

const SidebarProjectInfos = ({
	projectId,
	hasClientAttributedTasks,
	history,
	location,
}) => {
	const query = new URLSearchParams(location.search);
	const activeView = query.get('view');
	const [isEditingCustomer, setEditCustomer] = useState(false);
	const [isEditingCollab, setEditCollab] = useState(false);
	const [editDueDate, setEditDueDate] = useState(false);
	const [isCustomerPreviewOpen, setCustomerPreview] = useState(false);
	const [askNotifyActivityConfirm, setAskNotifyActivityConfirm] = useState(
		{},
	);
	const [updateProject] = useMutation(UPDATE_PROJECT);
	const [archiveProject] = useMutation(ARCHIVE_PROJECT);
	const [unarchiveProject] = useMutation(UNARCHIVE_PROJECT);
	const {data, error} = useQuery(GET_PROJECT_INFOS, {
		variables: {projectId},
		suspend: true,
	});

	const dateRef = useRef();

	useOnClickOutside(dateRef, () => {
		setEditDueDate(false);
	});

	if (error) throw error;

	const {project} = data;
	const isArchived = project.status === 'ARCHIVED';

	function setView(view) {
		const newQuery = new URLSearchParams(location.search);

		newQuery.delete('filter');
		newQuery.set('view', view);
		history.push(`/app/tasks/?${newQuery.toString()}`);
	}

	const timeItTookPending = project.sections.reduce(
		(sectionsSum, section) => sectionsSum
			+ section.items.reduce((itemsSum, item) => itemsSum + item.unit, 0),
		0,
	);
	const margin = project.daysUntilDeadline - timeItTookPending;

	return (
		<Aside>
			<SubSection>
				<Tooltip label="Vue principale">
					<SidebarLink
						onClick={() => setView('tasks')}
						active={activeView === 'tasks' || !activeView}
					>
						<IconButton
							icon="format_list_bulleted"
							size="tiny"
							label="Tâches du projet"
							current={activeView === 'tasks' || !activeView}
						/>
					</SidebarLink>
				</Tooltip>
				<Tooltip label="Seulement visibles par vous">
					<SidebarLink
						onClick={() => setView('personal-notes')}
						active={activeView === 'personal-notes'}
					>
						<IconButton
							icon="lock_open"
							size="tiny"
							label="Notes personnelles"
							current={activeView === 'personal-notes'}
						/>
					</SidebarLink>
				</Tooltip>
				<Tooltip label="Visibles par tout le monde">
					<SidebarLink
						onClick={() => setView('shared-notes')}
						active={activeView === 'shared-notes'}
					>
						<IconButton
							icon="people_outline"
							size="tiny"
							label="Notes partagées"
							current={activeView === 'shared-notes'}
						/>
					</SidebarLink>
				</Tooltip>
			</SubSection>
			<SubSection>
				{project.customer ? (
					<>
						<CustomerInfos>
							<Tooltip label="Changer le client lié au projet">
								<div>
									<PencilElem
										icon="edit"
										size="tiny"
										onClick={() => setEditCustomer(true)}
									/>
								</div>
							</Tooltip>
							<CustomerNameAndAddress
								customer={project.customer}
							/>
						</CustomerInfos>
						<Tooltip label="Évolution du projet, tâches qui requièrent une action, etc.">
							<CheckBoxLabel
								checked={project.notifyActivityToCustomer}
							>
								<input
									type="checkbox"
									checked={project.notifyActivityToCustomer}
									onChange={async () => {
										if (project.notifyActivityToCustomer) {
											const confirmed = await new Promise(
												resolve => setAskNotifyActivityConfirm(
													{
														resolve,
													},
												),
											);

											setAskNotifyActivityConfirm({});

											if (!confirmed) {
												return;
											}
										}

										await updateProject({
											variables: {
												projectId: project.id,
												notifyActivityToCustomer: !project.notifyActivityToCustomer,
											},
										});
									}}
								/>
								<Checked>
									<IconButton
										icon="check_box"
										size="tiny"
										color={primaryPurple}
									/>
								</Checked>
								<NotChecked>
									<IconButton
										icon="check_box_outline_blank"
										size="tiny"
										color={primaryPurple}
									/>
								</NotChecked>
								<CheckBoxFakeLabel>
									Notifier mon client par email
								</CheckBoxFakeLabel>
							</CheckBoxLabel>
						</Tooltip>
						{askNotifyActivityConfirm.resolve && (
							<ConfirmModal
								onConfirm={confirmed => askNotifyActivityConfirm.resolve(confirmed)
								}
								closeModal={() => askNotifyActivityConfirm.resolve(false)
								}
							>
								<Illus src={noNotificationsIllus} />
								<P>
									En décochant cette option, votre client ne
									recevra aucune notification de l'avancée de
									votre projet.
								</P>
								{hasClientAttributedTasks && (
									<P>
										Cependant, certaines des tâches sont
										attribuées à votre client et nécessitent
										l'envoi d'emails à celui-ci. Désactiver
										les notifications changera aussi
										l'attribution de ces tâches et votre
										client n'en sera pas averti.
									</P>
								)}
								<P>Êtes-vous sûr de vouloir continuer?</P>
							</ConfirmModal>
						)}
						<Tooltip label="Ce que verra votre client lorsqu'il se connecte au projet">
							<Button
								link
								onClick={() => setCustomerPreview(true)}
								id="show-customer-view"
							>
								<IconButton
									icon="visibility"
									size="tiny"
									label="Voir la vue de mon client"
									color={primaryPurple}
								/>
							</Button>
						</Tooltip>
					</>
				) : (
					<>
						<Illus src={noClientIllus} />
						<Actions>
							<Button
								materialIcon
								onClick={() => setEditCustomer(true)}
							>
								<MaterialIcon
									icon="person_outline"
									size="tiny"
									color="inherit"
								/>{' '}
								Ajouter un client
							</Button>
						</Actions>
					</>
				)}

				{isEditingCustomer && (
					<CustomerModalAndMail
						onValidate={async (customer) => {
							if (
								project.customer
								&& project.customer.id === customer.id
							) {
								return project;
							}

							const updatedProject = await updateProject({
								variables: {
									projectId: project.id,
									customerId: customer.id,
								},
							});

							return updatedProject;
						}}
						selectedCustomerId={
							project.customer && project.customer.id
						}
						onDismiss={() => setEditCustomer(false)}
					/>
				)}
			</SubSection>

			{isCustomerPreviewOpen && (
				<PreviewModal
					size="large"
					onDismiss={() => setCustomerPreview(false)}
				>
					<Notice>
						Cette vue est celle que verra votre client lorsqu'il
						devra effectuer des actions.
					</Notice>
					<StaticCustomerView projectId={project.id} />
				</PreviewModal>
			)}

			<SubSection>
				<DateContainer>
					{project.deadline ? (
						<>
							<SidebarHeading>Deadline</SidebarHeading>
							<Tooltip label="Date limite du projet">
								<SidebarBigNumber
									onClick={() => setEditDueDate(true)}
								>
									{(project.deadline
										&& moment(project.deadline).format(
											'DD/MM/YYYY',
										)) || <>&mdash;</>}
								</SidebarBigNumber>
							</Tooltip>
						</>
					) : (
						<Actions>
							<Button
								materialIcon
								onClick={() => setEditDueDate(true)}
							>
								<MaterialIcon
									icon="event"
									size="tiny"
									color="inherit"
								/>{' '}
								Ajouter une deadline
							</Button>
						</Actions>
					)}
					{editDueDate && (
						<DateInput
							innerRef={dateRef}
							date={moment(project.deadline || new Date())}
							onDateChange={(date) => {
								updateProject({
									variables: {
										projectId: project.id,
										deadline: date.toISOString(),
									},
									optimisticResponse: {
										__typename: 'Mutation',
										updateProject: {
											__typename: 'Project',
											...project,
											dueDate: date.toISOString(),
										},
									},
								});
								setEditDueDate(false);
							}}
							duration={project.total}
							position="right"
						/>
					)}
				</DateContainer>
			</SubSection>

			{project.daysUntilDeadline !== null && (
				<SubSection>
					<SubHeading>Marge jours restants</SubHeading>
					<Tooltip label="Nombre de jours travaillés avant deadline">
						<SidebarBigNumber urgent={margin < 1}>
							{+margin.toFixed(2)}&nbsp;
							<Plural
								value={margin}
								singular="jour"
								plural="jours"
							/>
						</SidebarBigNumber>
					</Tooltip>
				</SubSection>
			)}
			<SubSection>
				<Actions>
					{project.collabLinkToProject.length === 0 ? (
						<Button
							materialIcon
							onClick={() => {
								setEditCollab(true);
							}}
						>
							<MaterialIcon
								icon="face"
								size="tiny"
								color="inherit"
							/>{' '}
							Ajouter un collaborateur
						</Button>
					) : (
						<CollabLinkToProjectContainer
							onClick={() => setEditCollab(true)}
						>
							<PencilElem icon="edit" size="tiny" />
							<SubHeading>Collaborateurs du projet</SubHeading>
							<CollabLinkToProjectList project={project} />
						</CollabLinkToProjectContainer>
					)}
				</Actions>
				{isEditingCollab && (
					<CollaboratorModal
						onDismiss={() => setEditCollab(false)}
						projectName={project.name}
						projectId={project.id}
						projectCollabLink={project.collabLinkToProject}
					/>
				)}
			</SubSection>

			<div>
				<Actions>
					<Tooltip label="Copier ces tâches dans un nouveau projet">
						<DuplicateProjectButton
							id="duplicate-project-button"
							projectId={project.id}
							onCreate={({id}) => history.push(`/app/tasks?projectId=${id}`)
							}
						>
							<MaterialIcon
								icon="redo"
								size="tiny"
								color="inherit"
							/>{' '}
							Dupliquer le projet
						</DuplicateProjectButton>
					</Tooltip>
				</Actions>
				<Actions>
					<CreateProjectLinkButton project={project} />
				</Actions>
				{isArchived ? (
					<>
						<Actions>
							<Button
								onClick={() => unarchiveProject({
									variables: {
										projectId: project.id,
									},
								})
								}
							>
								<MaterialIcon
									icon="unarchive"
									size="tiny"
									color="inherit"
								/>{' '}
								Désarchiver le projet
							</Button>
						</Actions>
						<Actions>
							<RemoveProjectButton
								red
								projectId={project.id}
								onRemove={() => history.push('/app/projects')}
							>
								<MaterialIcon
									icon="delete_forever"
									size="tiny"
									color="inherit"
								/>{' '}
								Supprimer le projet
							</RemoveProjectButton>
						</Actions>
					</>
				) : (
					<Actions>
						<Button
							onClick={() => archiveProject({
								variables: {
									projectId: project.id,
								},
							})
							}
						>
							<MaterialIcon
								icon="archive"
								size="tiny"
								color="inherit"
							/>{' '}
							Archiver le projet
						</Button>
					</Actions>
				)}
			</div>
		</Aside>
	);
};

export default withRouter(SidebarProjectInfos);
