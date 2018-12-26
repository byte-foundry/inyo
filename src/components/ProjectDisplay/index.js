import React, {Component} from 'react';
import styled from 'react-emotion';
import {withRouter} from 'react-router-dom';
import {Mutation, Query} from 'react-apollo';

import TopBar, {TopBarTitle, TopBarNavigation, TopBarButton} from '../TopBar';
import CustomerNameAndAddress from '../CustomerNameAndAddress';
import IssuerNameAndAddress from '../IssuerNameAndAddress';
import InlineEditable from '../InlineEditable';
import ProjectSection from '../ProjectSection';
import ProjectTotal from '../ProjectTotal';
import TasksProgressBar from '../TasksProgressBar';
import Plural from '../Plural';
import {
	UPDATE_PROJECT,
	ADD_SECTION,
	START_PROJECT,
	REMOVE_PROJECT,
} from '../../utils/mutations';
import {GET_USER_INFOS} from '../../utils/queries';
import {
	H1,
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
} from '../../utils/content';
import {ReactComponent as FoldersIcon} from '../../utils/icons/folders.svg';
import {ReactComponent as SettingsIcon} from '../../utils/icons/settings.svg';
import 'react-toastify/dist/ReactToastify.css';

const ProjectDisplayMain = styled('div')`
	min-height: 100vh;
`;

const ProjectSections = styled('div')``;
const SideActions = styled(FlexColumn)`
	min-width: 260px;
	flex: 0.1 260px;
	padding: 20px 40px;
`;
const ProjectName = styled(H3)`
	color: ${primaryBlue};
	margin: 10px 0 20px;
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
	transform: translateY(18px);
	margin-top: 10px;
	margin-bottom: 10px;
`;

const TaskLegend = styled('div')`
	margin-top: 20px;
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

const StartProjectButton = styled(Button)`
	width: auto;
	padding: 0.5em 1em;
	margin-bottom: 0.5em;
`;

class ProjectDisplay extends Component {
	constructor(props) {
		super(props);
		this.state = {
			mode: 'project',
			apolloTriggerRenderTemporaryFix: false,
		};
	}

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
			removeItem,
			editSectionTitle,
			removeSection,
			addSection,
			totalItemsFinished,
			totalItems,
			askForInfos,
			issuer,
			refetch,
		} = this.props;
		const customerViewMode = this.props.match.params.customerToken;

		return (
			<Query query={GET_USER_INFOS}>
				{({loading, data}) => {
					if (loading) return <Loading />;
					if ((data && data.me) || customerViewMode) {
						return (
							<ProjectDisplayMain>
								{!customerViewMode && (
									<TopBar>
										<TopBarTitle>
											{mode === 'edit'
												? 'Remplissez le projet'
												: 'Projet en cours'}
										</TopBarTitle>
										<TopBarNavigation>
											{mode !== 'edit' && (
												<TopBarButton
													theme="Primary"
													size="Medium"
													onClick={() => {
														this.props.history.push(
															'/app/projects/create',
														);
													}}
												>
													Créer un nouveau projet
												</TopBarButton>
											)}
											<TopBarButton
												theme="Link"
												size="XSmall"
												onClick={() => {
													this.props.history.push(
														'/app/dashboard',
													);
												}}
											>
												<FoldersIcon />
											</TopBarButton>
											<TopBarButton
												theme="Link"
												size="XSmall"
												onClick={() => {
													this.props.history.push(
														'/app/projects',
													);
												}}
											>
												<FoldersIcon />
											</TopBarButton>
											<TopBarButton
												theme="Link"
												size="XSmall"
												onClick={() => {
													this.props.history.push(
														'/app/account',
													);
												}}
											>
												<SettingsIcon />
											</TopBarButton>
										</TopBarNavigation>
									</TopBar>
								)}

								<ProjectRow
									noPadding
									justifyContent="space-between"
								>
									<FlexColumn>
										<ProjectName>
											<Mutation mutation={UPDATE_PROJECT}>
												{updateProject => (
													<InlineEditable
														value={project.name}
														type="text"
														placeholder="Nom de votre projet"
														disabled={
															mode !== 'edit'
														}
														onFocusOut={(value) => {
															editProjectTitle(
																value,
																project.id,
																updateProject,
															);
														}}
													/>
												)}
											</Mutation>
										</ProjectName>
									</FlexColumn>
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
														totalItemsFinished
													}
													tasksTotal={totalItems}
												/>
											)}
											<FlexColumn fullHeight>
												<ProjectSections>
													{project.sections.map(
														(section, index) => (
															<ProjectSection
																key={section.id}
																projectId={
																	project.id
																}
																data={section}
																addItem={
																	addItem
																}
																editItem={
																	editItem
																}
																removeItem={
																	removeItem
																}
																finishItem={
																	finishItem
																}
																customerViewMode={
																	customerViewMode
																}
																mode={mode}
																editSectionTitle={
																	editSectionTitle
																}
																removeSection={
																	removeSection
																}
																sectionIndex={
																	index
																}
																refetch={
																	refetch
																}
																projectStatus={
																	project.status
																}
															/>
														),
													)}
													<Mutation
														mutation={ADD_SECTION}
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
																Ajouter une
																section
															</ProjectAction>
														)}
													</Mutation>
												</ProjectSections>
											</FlexColumn>
										</ProjectContent>
									</CenterContent>
									<SideActions>
										<CustomerIssuerContainer>
											{customerViewMode
												&& issuer.name && (
												<IssuerNameAndAddress
													issuer={issuer}
												/>
											)}
											{!customerViewMode && (
												<CustomerNameAndAddress
													customer={project.customer}
												/>
											)}
										</CustomerIssuerContainer>
										<TotalContainer>
											<ProjectTotal
												sumDays={new Date(
													project.deadline,
												).toLocaleDateString()}
												label="Date de fin"
											/>
										</TotalContainer>
										<TotalContainer>
											<ProjectTotal
												sumDays={Math.ceil(
													(new Date(
														project.deadline,
													)
														- new Date())
														/ 86400000,
												)}
												label="Jours avant date de fin"
											/>
										</TotalContainer>
										<TotalContainer>
											<ProjectTotal
												sumDays={this.getProjectTotal(
													project,
												)}
												label="Temps prévu"
												counter={
													<Plural
														singular="jour"
														plural="jours"
														value={Number.parseFloat(
															this.getProjectTotal(
																project,
															),
														)}
													/>
												}
											/>
										</TotalContainer>
										<TaskLegend>
											<InfosOnItems color={gray50}>
												Vos tâches
											</InfosOnItems>
											<InfosOnItems color={primaryBlue}>
												Tâches de votre client
											</InfosOnItems>
										</TaskLegend>
										{mode === 'edit' && (
											<Mutation mutation={REMOVE_PROJECT}>
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
														Supprimer le brouillon
													</ProjectAction>
												)}
											</Mutation>
										)}
									</SideActions>
								</FlexRow>
							</ProjectDisplayMain>
						);
					}
					return false;
				}}
			</Query>
		);
	}
}

export default withRouter(ProjectDisplay);
