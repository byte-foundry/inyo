import React, {Component} from 'react';
import styled from '@emotion/styled';
import {Formik} from 'formik';
import {withRouter} from 'react-router-dom';
import {Mutation, Query} from 'react-apollo';
import DayPickerInput from 'react-day-picker/DayPickerInput';
import * as Yup from 'yup';

import TopBar, {TopBarLogo, TopBarMenu} from '../TopBar';
import CustomerNameAndAddress from '../CustomerNameAndAddress';
import IssuerNameAndAddress from '../IssuerNameAndAddress';
import InlineEditable from '../InlineEditable';
import ProjectData from '../ProjectData';
import TasksProgressBar from '../TasksProgressBar';
import Plural from '../Plural';
import CreateTask from '../CreateTask';

import {
	UPDATE_PROJECT,
	ADD_SECTION,
	START_PROJECT,
	REMOVE_PROJECT,
	FINISH_PROJECT,
} from '../../utils/mutations';
import {GET_USER_INFOS, GET_PROJECT_DATA} from '../../utils/queries';
import {
	H4,
	H3,
	FlexRow,
	FlexColumn,
	Button,
	primaryNavyBlue,
	primaryBlue,
	gray20,
	gray10,
	gray50,
	signalRed,
	Loading,
	ModalContainer,
	P,
	DateInput,
} from '../../utils/content';
import {
	MONTHS,
	WEEKDAYS_LONG,
	WEEKDAYS_SHORT,
	FIRST_DAY_OF_WEEK,
	LABELS,
} from '../../utils/constants';
import {formatDate, parseDate} from '../../utils/functions';
import StaticCustomerView from '../StaticCustomerView';
import {ReactComponent as FoldersIcon} from '../../utils/icons/folders.svg';
import {ReactComponent as DashboardIcon} from '../../utils/icons/dashboard.svg';
import {ReactComponent as SettingsIcon} from '../../utils/icons/settings.svg';
import {ReactComponent as EyeIcon} from '../../utils/icons/eye.svg';
import 'react-toastify/dist/ReactToastify.css';
import SectionList from '../SectionList';
import ConfirmModal from '../ConfirmModal';

const ProjectDisplayMain = styled('div')`
	min-height: 100vh;
`;

const ProjectSections = styled('div')``;
const SideActions = styled(FlexColumn)`
	min-width: 260px;
	flex: 0.1 295px;
	padding: 20px 40px;
`;
const ProjectName = styled(H3)`
	color: ${primaryBlue};
	margin: 10px 0 20px;
	flex: 1;
`;
const CenterContent = styled(FlexColumn)`
	background: ${gray10};
	padding: 20px 40px;
`;

const ProjectRow = styled(FlexRow)`
	padding-left: 40px;
	padding-right: 40px;
	padding-top: 10px;
	padding-bottom: ${props => (props.noPadding ? '0px' : '10px')};
	border-top: 1px solid ${gray20};
	border-bottom: 1px solid ${gray20};
`;

const ProjectContent = styled('div')`
	max-width: 750px;
	width: fill-available;
	margin-left: auto;
	margin-right: auto;
	padding-bottom: 40px;
`;

const ProjectAction = styled(Button)`
	text-decoration: none;
	color: ${props => (props.theme === 'DeleteOutline' ? signalRed : primaryBlue)};
	font-size: 13px;
	margin: 0.4em 0;
`;

const TaskLegend = styled('div')`
	margin-top: 20px;
	margin-bottom: 20px;
`;

const InfosOnItems = styled('div')`
	display: flex;
	margin-bottom: 8px;
	font-size: 14px;
	&::before {
		content: ' ';
		box-sizing: border-box;
		border: solid 1px ${gray50};
		border-right: ${props => (props.color === primaryBlue ? '4px' : '1px')}
			solid ${props => props.color};
		margin-right: 10px;
		width: 16px;
		height: 16px;
		display: block;
		position: relative;
		top: 0.18em;
	}
`;

const CustomerIssuerContainer = styled('div')``;

const TotalContainer = styled('div')``;

const TotalNumber = styled(H4)`
	color: ${primaryNavyBlue};
	margin: 0;
	cursor: ${props => (props.editable ? 'pointer' : 'default')};

	&:hover {
		color: ${props => (props.editable ? primaryBlue : primaryNavyBlue)};
	}
`;

const StartProjectButton = styled(Button)`
	width: auto;
	margin-left: 10px;
	margin-bottom: 10px;
`;

const DateButton = styled('div')`
	margin-left: 10px;
	margin-top: 10px;
	color: ${props => (props.cancel ? 'orange' : 'green')};
	cursor: pointer;
	font-size: 12px;
	&:hover {
		text-decoration: underline;
	}
`;

const ClientPreviewIcon = styled(EyeIcon)`
	vertical-align: middle;
	margin-top: -2px;
`;

const PreviewModal = styled(ModalContainer)`
	min-height: 500px;
	padding: 0;
`;

const Notice = styled(P)`
	color: #fff;
	background: ${primaryBlue};
	padding: 10px;
	text-align: center;
	margin: 0;
`;

const CheckBoxLabel = styled('label')`
	font-size: 13px;
	margin: 0.5em 0;
	color: ${primaryBlue};
	cursor: pointer;

	input[type='checkbox'] {
		margin-left: 0.4em;
		margin-right: 0.8em;
		margin-top: -1px;
	}
`;

class ProjectDisplay extends Component {
	state = {
		mode: 'project',
		apolloTriggerRenderTemporaryFix: false,
		askNotifyActivityConfirm: null,
		askCustomerAttributionConfirm: null,
	};

	duplicateProject = (project) => {
		this.props.history.push(`/app/projects/create/from/${project.id}`);
	};

	getProjectTotal = (project) => {
		let sumDays = 0;

		project.sections.forEach((section) => {
			section.items.forEach((item) => {
				sumDays += item.unit;
			});
		});
		return sumDays.toLocaleString();
	};

	render() {
		const {
			project,
			mode,
			startProject,
			editProjectTitle,
			addItem,
			editItem,
			finishItem,
			unfinishItem,
			removeItem,
			editSection,
			removeSection,
			addSection,
			askForInfos,
			issuer,
			refetch,
			customerToken,
			style,
		} = this.props;

		const {
			isCustomerPreviewOpen,
			askNotifyActivityConfirm,
			askCustomerAttributionConfirm,
		} = this.state;

		const hasAllTasksDone = project.sections.every(section => section.items.every(item => item.status === 'FINISHED'));
		const hasClientAttributedTasks = project.sections.some(section => section.items.some(
			item => item.status === 'PENDING' && item.reviewer === 'CUSTOMER',
		));

		let title = 'Project en cours';

		if (mode === 'edit' && project.status === 'DRAFT') {
			title = 'Remplissez le projet';
		}
		else if (project.status === 'FINISHED') {
			title = 'Project archivé';
		}

		const allItems = project.sections.reduce(
			(total, section) => total.concat(section.items),
			[],
		);
		const finishedItems = allItems.filter(
			item => item.status === 'FINISHED',
		);

		return (
			<Query query={GET_USER_INFOS}>
				{({loading, data}) => {
					if (loading) return <Loading />;

					if (!(data && data.me) && !customerToken) return false;
					return (
						<Mutation mutation={UPDATE_PROJECT}>
							{updateProject => (
								<ProjectDisplayMain style={style}>
									{!customerToken && (
										<TopBar>
											<TopBarLogo>{title}</TopBarLogo>
											<TopBarMenu />
										</TopBar>
									)}

									<ProjectRow
										noPadding
										justifyContent="space-between"
									>
										<ProjectName>
											<InlineEditable
												value={project.name}
												type="text"
												placeholder="Nom de votre projet"
												disabled={mode !== 'edit'}
												onFocusOut={(value) => {
													editProjectTitle(
														value,
														project.id,
														updateProject,
													);
												}}
											/>
										</ProjectName>
										{!customerToken
											&& hasAllTasksDone
											&& project.status === 'ONGOING' && (
											<Mutation
												mutation={FINISH_PROJECT}
												variables={{
													projectId: project.id,
												}}
												optimisticResponse={{
													__typename: 'Mutation',
													finishProject: {
														id: project.id,
														status: 'FINISHED',
													},
												}}
												update={(
													cache,
													{
														data: {
															finishProject: finishedProject,
														},
													},
												) => {
													window.Intercom(
														'trackEvent',
														'project-finished',
													);

													const data = cache.readQuery(
														{
															query: GET_PROJECT_DATA,
															variables: {
																projectId:
																		project.id,
															},
														},
													);

													data.project.status
															= finishedProject.status;

													cache.writeQuery({
														query: GET_PROJECT_DATA,
														variables: {
															projectId:
																	project.id,
														},
														data,
													});
												}}
											>
												{finishProject => (
													<StartProjectButton
														theme="Primary"
														size="Medium"
														onClick={() => finishProject()
														}
													>
															Archiver ce projet
													</StartProjectButton>
												)}
											</Mutation>
										)}
										{!customerToken && (
											<StartProjectButton
												size="Medium"
												onClick={() => this.duplicateProject(
													project,
												)
												}
											>
												Dupliquer ce projet
											</StartProjectButton>
										)}
										{mode === 'edit' && (
											<Mutation
												mutation={START_PROJECT}
												onError={(error) => {
													if (
														error.message.includes(
															'NEED_MORE_INFOS',
														)
														|| error.message.includes(
															'Missing required data',
														)
													) {
														return askForInfos();
													}
													return false;
												}}
											>
												{StartProject => (
													<StartProjectButton
														theme="Primary"
														size="Medium"
														onClick={() => {
															startProject(
																project.id,
																StartProject,
															);
														}}
													>
														Commencer le projet
													</StartProjectButton>
												)}
											</Mutation>
										)}
									</ProjectRow>
									<FlexRow justifyContent="space-between">
										<CenterContent flexGrow="2">
											<ProjectContent>
												{mode === 'see' && (
													<TasksProgressBar
														tasksCompleted={
															finishedItems.length
															+ finishedItems.reduce(
																(acc, item) => acc
																	+ item.unit,
																0,
															)
														}
														tasksTotal={
															allItems.length
															+ allItems.reduce(
																(acc, item) => acc
																	+ item.unit,
																0,
															)
														}
													/>
												)}
												{!customerToken
													&& project.status
														!== 'FINISHED' && (
													<CreateTask />
												)}
												<FlexColumn fullHeight>
													<ProjectSections>
														<SectionList
															projectId={
																project.id
															}
															addItem={async (
																itemId,
																data,
																...rest
															) => {
																if (
																	!project.notifyActivityToCustomer
																	&& data.reviewer
																		=== 'CUSTOMER'
																) {
																	const confirmed = await new Promise(
																		resolve => this.setState(
																			{
																				askCustomerAttributionConfirm: resolve,
																			},
																		),
																	);

																	this.setState(
																		{
																			askCustomerAttributionConfirm: null,
																		},
																	);

																	if (
																		!confirmed
																	) {
																		return;
																	}

																	await updateProject(
																		{
																			variables: {
																				projectId:
																					project.id,
																				notifyActivityToCustomer: !project.notifyActivityToCustomer,
																			},
																		},
																	);
																}

																await addItem(
																	itemId,
																	data,
																	...rest,
																);
															}}
															editItem={async (
																itemId,
																sectionId,
																data,
																...rest
															) => {
																if (
																	!project.notifyActivityToCustomer
																	&& data.reviewer
																		=== 'CUSTOMER'
																) {
																	const confirmed = await new Promise(
																		resolve => this.setState(
																			{
																				askCustomerAttributionConfirm: resolve,
																			},
																		),
																	);

																	this.setState(
																		{
																			askCustomerAttributionConfirm: null,
																		},
																	);

																	if (
																		!confirmed
																	) {
																		return;
																	}

																	await updateProject(
																		{
																			variables: {
																				projectId:
																					project.id,
																				notifyActivityToCustomer: !project.notifyActivityToCustomer,
																			},
																		},
																	);
																}

																await editItem(
																	itemId,
																	sectionId,
																	data,
																	...rest,
																);
															}}
															removeItem={
																removeItem
															}
															finishItem={
																finishItem
															}
															unfinishItem={
																unfinishItem
															}
															customerToken={
																customerToken
															}
															mode={mode}
															editSection={
																editSection
															}
															removeSection={
																removeSection
															}
															refetch={refetch}
															projectStatus={
																project.status
															}
															sections={
																project.sections
															}
														/>
														{!customerToken && (
															<Mutation
																mutation={
																	ADD_SECTION
																}
															>
																{AddSection => (
																	<ProjectAction
																		theme="Link"
																		size="XSmall"
																		onClick={() => {
																			addSection(
																				project.id,
																				AddSection,
																			);
																		}}
																	>
																		Ajouter
																		une
																		section
																	</ProjectAction>
																)}
															</Mutation>
														)}
													</ProjectSections>
												</FlexColumn>
											</ProjectContent>
										</CenterContent>
										<SideActions>
											<CustomerIssuerContainer>
												{customerToken
													&& issuer && (
													<IssuerNameAndAddress
														issuer={issuer}
													/>
												)}
												{!customerToken && (
													<>
														<CustomerNameAndAddress
															customer={
																project.customer
															}
														/>
														<CheckBoxLabel>
															<input
																type="checkbox"
																checked={
																	project.notifyActivityToCustomer
																}
																onChange={async () => {
																	if (
																		project.notifyActivityToCustomer
																	) {
																		const confirmed = await new Promise(
																			resolve => this.setState(
																				{
																					askNotifyActivityConfirm: resolve,
																				},
																			),
																		);

																		this.setState(
																			{
																				askNotifyActivityConfirm: null,
																			},
																		);

																		if (
																			!confirmed
																		) {
																			return;
																		}
																	}

																	await updateProject(
																		{
																			variables: {
																				projectId:
																					project.id,
																				notifyActivityToCustomer: !project.notifyActivityToCustomer,
																			},
																			update: (
																				cache,
																				{
																					data: {
																						updateProject: updatedProject,
																					},
																				},
																			) => {
																				const query = {
																					query: GET_PROJECT_DATA,
																					variables: {
																						projectId:
																							project.id,
																					},
																				};

																				query.data = cache.readQuery(
																					query,
																				);

																				const {
																					data,
																				} = query;

																				data.project.notifyActivityToCustomer
																					= updatedProject.notifyActivityToCustomer;

																				if (
																					!updatedProject.notifyActivityToCustomer
																				) {
																					data.project.sections.forEach(
																						(section) => {
																							section.items.forEach(
																								(item) => {
																									item.reviewer
																										= 'USER';
																								},
																							);
																						},
																					);
																				}

																				cache.writeQuery(
																					query,
																				);
																			},
																		},
																	);
																}}
															/>
															Notifier mon client
															de l'évolution du
															projet
														</CheckBoxLabel>
														{askNotifyActivityConfirm && (
															<ConfirmModal
																onConfirm={confirmed => askNotifyActivityConfirm(
																	confirmed,
																)
																}
																closeModal={() => askNotifyActivityConfirm(
																	false,
																)
																}
															>
																<P>
																	En décochant
																	cette
																	option,
																	votre client
																	ne recevra
																	aucune
																	notification
																	de l'avancée
																	de votre
																	projet.
																</P>
																{hasClientAttributedTasks && (
																	<P>
																		Cependant,
																		certaines
																		des
																		tâches
																		sont
																		attribuées
																		à votre
																		client
																		et
																		nécessitent
																		l'envoi
																		d'emails
																		à
																		celui-ci.
																		Désactiver
																		les
																		notifications
																		changera
																		aussi
																		l'attribution
																		de ces
																		tâches
																		et votre
																		client
																		n'en
																		sera pas
																		averti.
																	</P>
																)}
																<P>
																	Êtes-vous
																	sûr de
																	vouloir
																	continuer?
																</P>
															</ConfirmModal>
														)}
														<ProjectAction
															theme="Link"
															size="XSmall"
															onClick={() => this.setState({
																isCustomerPreviewOpen: true,
															})
															}
														>
															<ClientPreviewIcon />
															<span>
																Voir la vue de
																mon client
															</span>
														</ProjectAction>
														{isCustomerPreviewOpen && (
															<PreviewModal
																size="large"
																onDismiss={() => this.setState(
																	{
																		isCustomerPreviewOpen: false,
																	},
																)
																}
															>
																<Notice>
																	Cette vue
																	est celle
																	que verra
																	votre client
																	lorsqu'il
																	devra
																	effectuer
																	des actions.
																</Notice>
																<StaticCustomerView
																	projectId={
																		project.id
																	}
																/>
															</PreviewModal>
														)}
													</>
												)}
											</CustomerIssuerContainer>
											<TotalContainer>
												{!this.state.editDeadline ? (
													<ProjectData
														label="Date de fin"
														onClick={() => {
															!customerToken
																&& this.setState({
																	editDeadline: !this
																		.state
																		.editDeadline,
																});
														}}
													>
														<TotalNumber editable>
															{new Date(
																project.deadline,
															).toLocaleDateString()}
														</TotalNumber>
													</ProjectData>
												) : (
													<ProjectData label="Date de fin">
														<Formik
															initialValues={{
																deadline: new Date(
																	project.deadline,
																),
															}}
															validationSchema={Yup.object(
																{
																	deadline: Yup.date().required(
																		'Requis',
																	),
																},
															)}
															onSubmit={async (
																values,
																actions,
															) => {
																actions.setSubmitting(
																	true,
																);
																try {
																	await updateProject(
																		{
																			variables: {
																				projectId:
																					project.id,
																				deadline: values.deadline.toISOString(),
																			},
																			refetchQueries: [
																				'getProjectData',
																				'getProjectDataWithToken',
																			],
																		},
																	);
																}
																catch (error) {
																	actions.setSubmitting(
																		false,
																	);
																	actions.setErrors(
																		error,
																	);
																	actions.setStatus(
																		{
																			msg: `Quelque chose ne s'est pas passé comme prévu. ${error}`,
																		},
																	);
																}

																this.setState({
																	editDeadline: false,
																});
															}}
														>
															{({
																values,
																setFieldValue,
																status,
																isSubmitting,
																handleSubmit,
																errors,
																touched,
															}) => (
																<>
																	<DayPickerInput
																		formatDate={
																			formatDate
																		}
																		parseDate={
																			parseDate
																		}
																		dayPickerProps={{
																			locale:
																				'fr',
																			months:
																				MONTHS.fr,
																			weekdaysLong:
																				WEEKDAYS_LONG.fr,
																			weekdaysShort:
																				WEEKDAYS_SHORT.fr,
																			firstDayOfWeek:
																				FIRST_DAY_OF_WEEK.fr,
																			labels:
																				LABELS.fr,
																			selectedDays:
																				values.deadline,
																		}}
																		component={dateProps => (
																			<DateInput
																				{...dateProps}
																				alone
																				wide
																			/>
																		)}
																		onDayChange={(day) => {
																			setFieldValue(
																				'deadline',
																				day,
																			);
																		}}
																		value={
																			values.deadline
																		}
																	/>
																	<FlexRow justifyContent="flex-end">
																		<DateButton
																			cancel
																			onClick={() => {
																				this.setState(
																					{
																						editDeadline: false,
																					},
																				);
																			}}
																		>
																			Annuler
																		</DateButton>
																		<DateButton
																			onClick={() => {
																				handleSubmit();
																			}}
																		>
																			Ok
																		</DateButton>
																	</FlexRow>
																</>
															)}
														</Formik>
													</ProjectData>
												)}
											</TotalContainer>
											{project.daysUntilDeadline
												!== null && (
												<TotalContainer>
													<ProjectData label="Jours travaillés avant date de fin">
														<TotalNumber>
															{
																project.daysUntilDeadline
															}{' '}
															<Plural
																singular="jour"
																plural="jours"
																value={
																	project.daysUntilDeadline
																}
															/>
														</TotalNumber>
													</ProjectData>
												</TotalContainer>
											)}
											<TotalContainer>
												<ProjectData label="Temps prévu">
													<TotalNumber>
														{this.getProjectTotal(
															project,
														)}{' '}
														<Plural
															singular="jour"
															plural="jours"
															value={Number.parseFloat(
																this.getProjectTotal(
																	project,
																),
															)}
														/>
													</TotalNumber>
												</ProjectData>
											</TotalContainer>
											<TaskLegend>
												<InfosOnItems color={gray50}>
													Tâches prestataire
												</InfosOnItems>
												<InfosOnItems
													color={primaryBlue}
												>
													Tâches client
												</InfosOnItems>
											</TaskLegend>
											{mode === 'edit' && (
												<Mutation
													mutation={REMOVE_PROJECT}
												>
													{RemoveProject => (
														<ProjectAction
															theme="DeleteOutline"
															size="XSmall"
															type="delete"
															onClick={() => {
																this.props.removeProject(
																	project.id,
																	RemoveProject,
																);
															}}
														>
															Supprimer le
															brouillon
														</ProjectAction>
													)}
												</Mutation>
											)}
										</SideActions>
									</FlexRow>
									{askCustomerAttributionConfirm && (
										<ConfirmModal
											onConfirm={confirmed => askCustomerAttributionConfirm(
												confirmed,
											)
											}
											closeModal={() => askCustomerAttributionConfirm(
												false,
											)
											}
										>
											<P>
												Vous souhaitez créer une tâche
												attribuée au client qui
												nécessite d'activer les
												notifications par email à
												celui-ci.
											</P>
											<P>
												Souhaitez vous continuer et
												activer les notifications?
											</P>
										</ConfirmModal>
									)}
								</ProjectDisplayMain>
							)}
						</Mutation>
					);
				}}
			</Query>
		);
	}
}

export default withRouter(ProjectDisplay);
