import styled from '@emotion/styled/macro';
import moment from 'moment';
import React, {useRef, useState} from 'react';
import {withRouter} from 'react-router-dom';
import useOnClickOutside from 'use-onclickoutside';

import fbt from '../../fbt/fbt.macro';
import {useMutation, useQuery} from '../../utils/apollo-hooks';
import {BREAKPOINTS} from '../../utils/constants';
import {ModalContainer} from '../../utils/content';
import {getMarginUntilDeadline} from '../../utils/functions';
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
	CheckBoxFakeLabel,
	CheckBoxLabel,
	DateContainer,
	P,
	primaryGrey,
	primaryPurple,
	primaryWhite,
	SubHeading,
} from '../../utils/new/design-system';
import {GET_PROJECT_INFOS} from '../../utils/queries';
import useUserInfos from '../../utils/useUserInfos';
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
import RemoveProjectButton from '../RemoveProjectButton';
import StaticCustomerView from '../StaticCustomerView';
import Tooltip from '../Tooltip';

const SubSection = styled('div')`
	margin-bottom: 1.5rem;

	@media (max-width: ${BREAKPOINTS.mobile}px) {
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

	@media (max-width: ${BREAKPOINTS.mobile}px) {
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
	const {endWorkAt, workingTime} = useUserInfos();

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

	const taskArray = project.sections
		.map(s => s.items.filter(i => i.status === 'PENDING'))
		.flat();

	const margin = getMarginUntilDeadline(
		project.deadline,
		taskArray,
		endWorkAt,
		workingTime,
	);

	return (
		<Aside>
			<SubSection>
				<Tooltip
					label={
						<fbt
							project="inyo"
							desc="sidebar project main view tooltip"
						>
							Vue principale
						</fbt>
					}
				>
					<SidebarLink
						onClick={() => setView('tasks')}
						active={activeView === 'tasks' || !activeView}
					>
						<IconButton
							icon="format_list_bulleted"
							size="tiny"
							label={
								<fbt
									project="inyo"
									desc="sidebar project project task label"
								>
									Tâches du projet
								</fbt>
							}
							current={activeView === 'tasks' || !activeView}
						/>
					</SidebarLink>
				</Tooltip>
				<Tooltip
					label={
						<fbt
							project="inyo"
							desc="sidebar project main view tooltip"
						>
							Budget vendu
						</fbt>
					}
				>
					<SidebarLink
						onClick={() => setView('budget')}
						active={activeView === 'budget'}
					>
						<IconButton
							icon="attach_money"
							size="tiny"
							label={
								<fbt
									project="inyo"
									desc="sidebar project budget projet"
								>
									Budget du projet
								</fbt>
							}
							current={activeView === 'budget'}
						/>
					</SidebarLink>
				</Tooltip>
				<Tooltip
					label={
						<fbt
							project="inyo"
							desc="sidebar project personal notes tooltip"
						>
							Seulement visibles par vous
						</fbt>
					}
				>
					<SidebarLink
						onClick={() => setView('personal-notes')}
						active={activeView === 'personal-notes'}
					>
						<IconButton
							icon="lock_open"
							size="tiny"
							label={
								<fbt
									project="inyo"
									desc="sidebar project personal notes label"
								>
									Notes personnelles
								</fbt>
							}
							current={activeView === 'personal-notes'}
						/>
					</SidebarLink>
				</Tooltip>
				<Tooltip
					label={
						<fbt
							project="inyo"
							desc="sidebar project shared notes tooltip"
						>
							Visibles par tout le monde
						</fbt>
					}
				>
					<SidebarLink
						onClick={() => setView('shared-notes')}
						active={activeView === 'shared-notes'}
					>
						<IconButton
							icon="people_outline"
							size="tiny"
							label={
								<fbt
									project="inyo"
									desc="sidebar project shared notes label"
								>
									Notes partagées
								</fbt>
							}
							current={activeView === 'shared-notes'}
						/>
					</SidebarLink>
				</Tooltip>
				<Tooltip
					label={
						<fbt desc="sidebar project activity link tooltip">
							Historique des activités du projet
						</fbt>
					}
				>
					<SidebarLink
						onClick={() => setView('activity')}
						active={activeView === 'activity'}
					>
						<IconButton
							icon="history"
							size="tiny"
							label={
								<fbt
									project="inyo"
									desc="sidebar project activity link label"
								>
									Activité
								</fbt>
							}
							current={activeView === 'activity'}
						/>
					</SidebarLink>
				</Tooltip>
			</SubSection>
			<SubSection>
				{project.customer ? (
					<>
						<CustomerInfos>
							<Tooltip
								label={
									<fbt
										project="inyo"
										desc="sidebar project change customer tooltip"
									>
										Changer le client lié au projet
									</fbt>
								}
							>
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
						<Tooltip
							label={
								<fbt
									project="inyo"
									desc="sidebar project notify customer tooltip"
								>
									Évolution du projet, tâches qui requièrent
									une action, etc.
								</fbt>
							}
						>
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
								{project.notifyActivityToCustomer ? (
									<IconButton
										icon="check_box"
										size="tiny"
										color={primaryPurple}
									/>
								) : (
									<IconButton
										icon="check_box_outline_blank"
										size="tiny"
										color={primaryPurple}
									/>
								)}
								<CheckBoxFakeLabel>
									<fbt
										project="inyo"
										desc="sidebar project notify customer label"
									>
										Notifier mon client par email
									</fbt>
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
									<fbt
										project="inyo"
										desc="sidebar project notify customer modal warning"
									>
										En décochant cette option, votre client
										ne recevra aucune notification de
										l'avancée de votre projet.
									</fbt>
								</P>
								{hasClientAttributedTasks && (
									<P>
										<fbt
											project="inyo"
											desc="sidebar project notify customer modal task warning"
										>
											Cependant, certaines des tâches sont
											attribuées à votre client et
											nécessitent l'envoi d'emails à
											celui-ci. Désactiver les
											notifications changera aussi
											l'attribution de ces tâches et votre
											client n'en sera pas averti.
										</fbt>
									</P>
								)}
								<P>
									<fbt project="inyo" desc="are you sure">
										Êtes-vous sûr de vouloir continuer?
									</fbt>
								</P>
							</ConfirmModal>
						)}
						<Tooltip
							label={
								<fbt
									project="inyo"
									desc="sidebar project customer view tooltip"
								>
									Ce que verra votre client lorsqu'il se
									connecte au projet
								</fbt>
							}
						>
							<Button
								link
								onClick={() => setCustomerPreview(true)}
								id="show-customer-view"
							>
								<IconButton
									icon="visibility"
									size="tiny"
									label={
										<fbt
											project="inyo"
											desc="sidebar project customer view label"
										>
											Voir la vue de mon client
										</fbt>
									}
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
								<fbt
									project="inyo"
									desc="sidebar project add a customer"
								>
									Ajouter un client
								</fbt>
							</Button>
						</Actions>
					</>
				)}

				{isEditingCustomer && (
					<CustomerModalAndMail
						close={() => setEditCustomer(false)}
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
						<fbt
							project="inyo"
							desc="sidebar project customer view modal info "
						>
							Cette vue est celle que verra votre client lorsqu'il
							devra effectuer des actions.
						</fbt>
					</Notice>
					<StaticCustomerView projectId={project.id} />
				</PreviewModal>
			)}
			<SubSection>
				<Actions>
					{project.linkedCollaborators.length === 0 ? (
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
							<fbt
								project="inyo"
								desc="sidebar project add collaborator label"
							>
								Ajouter un collaborateur
							</fbt>
						</Button>
					) : (
						<CollabLinkToProjectContainer
							onClick={() => setEditCollab(true)}
						>
							<PencilElem icon="edit" size="tiny" />
							<SubHeading>
								<fbt
									project="inyo"
									desc="sidebar project collaborator list heading"
								>
									Collaborateurs du projet
								</fbt>
							</SubHeading>
							<CollabLinkToProjectList project={project} />
						</CollabLinkToProjectContainer>
					)}
				</Actions>
				{isEditingCollab && (
					<CollaboratorModal
						onDismiss={() => setEditCollab(false)}
						projectName={project.name}
						projectId={project.id}
						linkedCollaborators={project.linkedCollaborators}
					/>
				)}
			</SubSection>
			{project.budget !== null && (
				<SubSection>
					<SubHeading>
						<fbt project="inyo" desc="sidebar budget">
							Budget vendu
						</fbt>
					</SubHeading>
					<Tooltip
						label={
							<fbt project="inyo" desc="sidebar project budget">
								Budget du projet
							</fbt>
						}
					>
						<SidebarBigNumber>
							<fbt desc="sidebar budget amount">
								<fbt:param name="amount">
									{project.budget}
								</fbt:param>{' '}
								€
							</fbt>
						</SidebarBigNumber>
					</Tooltip>
				</SubSection>
			)}
			<SubSection>
				<DateContainer>
					{project.deadline ? (
						<>
							<SidebarHeading>
								<fbt
									project="inyo"
									desc="sidebar project deadline heading"
								>
									Deadline
								</fbt>
							</SidebarHeading>
							<Tooltip
								label={
									<fbt
										project="inyo"
										desc="sidebar proejct deadline tooltip"
									>
										Date limite du projet
									</fbt>
								}
							>
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
								<fbt
									project="inyo"
									desc="sidebar project add a deadline label"
								>
									Ajouter une deadline
								</fbt>
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
					<SubHeading>
						<fbt
							project="inyo"
							desc="sidebar proejct worked days before deadline heading"
						>
							Marge restantes
						</fbt>
					</SubHeading>
					<Tooltip
						label={
							<fbt
								project="inyo"
								desc="sidebar project worked days before deadline tooltip"
							>
								Nombre de jours travaillés avant deadline
							</fbt>
						}
					>
						<SidebarBigNumber urgent={margin.includes('retard')}>
							{margin}
						</SidebarBigNumber>
					</Tooltip>
				</SubSection>
			)}

			<div>
				<Actions>
					<Tooltip
						label={
							<fbt
								project="inyo"
								desc="duplicate project tooltip"
							>
								Copier ces tâches dans un nouveau projet
							</fbt>
						}
					>
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
							<fbt
								project="inyo"
								desc="duplicate project button label"
							>
								Dupliquer le projet
							</fbt>
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
								<fbt project="inyo" desc="unarchive project">
									Désarchiver le projet
								</fbt>
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
								<fbt project="inyo" desc="delete project">
									Supprimer le projet
								</fbt>
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
							<fbt project="inyo" desc="archive project">
								Archiver le projet
							</fbt>
						</Button>
					</Actions>
				)}
			</div>
		</Aside>
	);
};

export default withRouter(SidebarProjectInfos);
