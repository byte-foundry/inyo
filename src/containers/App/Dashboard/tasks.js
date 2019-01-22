import React from 'react';
import {Query, Mutation} from 'react-apollo';
import {withRouter, Route} from 'react-router-dom';
import styled from '@emotion/styled';

import Item from '../../../components/ProjectSection/see-item';
import ItemView from '../../../components/ItemView';
import ProjectCard from '../../../components/ProjectCard';

import {
	P,
	H3,
	gray20,
	gray50,
	gray80,
	primaryBlue,
	primaryNavyBlue,
	LinkButton,
	ModalContainer as Modal,
	FlexRow,
	ModalElem,
} from '../../../utils/content';
import {USER_TASKS, GET_ALL_PROJECTS} from '../../../utils/queries';
import {SNOOZE_ITEM} from '../../../utils/mutations';
import {ReactComponent as TaskIcon} from '../../../utils/icons/folder.svg';
import {ReactComponent as TimeIcon} from '../../../utils/icons/time.svg';
import {ReactComponent as DateIcon} from '../../../utils/icons/date.svg';
import {ReactComponent as ContactIcon} from '../../../utils/icons/contact.svg';
import {ReactComponent as SnoozeIcon} from '../../../utils/icons/snooze.svg';

const SectionTitle = styled(H3)`
	color: ${primaryNavyBlue};
`;

const ColumnHeader = styled('div')`
	flex: ${props => props.flex};
	display: flex;
`;

const HeaderRow = styled(FlexRow)`
	margin: 10px 121px 10px 17px;
`;

const HeaderText = styled('span')`
	margin-left: 7px;
`;

const SnoozeContainer = styled('div')`
	flex: 0 0 70px;
	display: flex;
	align-items: center;
	justify-content: center;
	margin-bottom: 7px;
	cursor: pointer;
	svg {
		.arrow-head,
		.circle {
			stroke: ${props => (props.snoozed ? gray80 : gray20)};
		}

		.text {
			fill: ${props => (props.snoozed ? primaryBlue : gray50)};
		}

		&:hover {
			.arrow-head,
			.circle {
				stroke: ${gray80};
			}

			.text {
				fill: ${primaryBlue};
			}
		}
	}
`;

const DashboardTasks = ({history, finishItem, snoozeItem}) => (
	<Query query={GET_ALL_PROJECTS}>
		{({data: projectsData, loading: projectsLoading}) => {
			if (projectsLoading) return <p>Loading</p>;

			const {
				me: {
					company: {projects},
				},
			} = projectsData;
			const projectsPending = projects.filter(
				project => project.status === 'DRAFT',
			);

			return (
				<Query query={USER_TASKS}>
					{({data, loading}) => {
						if (loading) return <p>Loading</p>;

						const {me, items} = data;

						const now = new Date();

						const startWorkAt = new Date();
						const endWorkAt = new Date();

						startWorkAt.setUTCHours(
							me.startWorkAt ? me.startWorkAt.split(':')[0] : 8,
							me.startWorkAt ? me.startWorkAt.split(':')[1] : 30,
							0,
							0,
						);
						endWorkAt.setUTCHours(
							me.endWorkAt ? me.endWorkAt.split(':')[0] : 19,
							me.endWorkAt ? me.endWorkAt.split(':')[1] : 30,
							0,
							0,
						);

						const userWorkingTime
							= (endWorkAt - startWorkAt) / 60 / 60 / 1000;
						// day is over -> show next day
						let timeLeft = userWorkingTime;

						// day ongoing -> show tasks the user can do
						if (now > startWorkAt && now < endWorkAt) {
							timeLeft = (now - startWorkAt) / 60 / 60 / 1000;
						}

						const itemsToDo = [];

						while (
							itemsToDo.reduce((sum, {unit}) => sum + unit, 0)
								* userWorkingTime
								< timeLeft
							&& itemsToDo.length < 8
							&& items[itemsToDo.length]
						) {
							itemsToDo.push(items[itemsToDo.length]);
						}
						const itemsToDoLater = items.slice(
							itemsToDo.length,
							itemsToDo.length + 3,
						);

						return (
							<>
								{now > endWorkAt ? (
									<SectionTitle>
										Tâches à faire demain
									</SectionTitle>
								) : (
									<SectionTitle>
										Tâches à faire aujourd'hui
									</SectionTitle>
								)}
								{itemsToDo.length ? (
									<>
										<HeaderRow>
											<ColumnHeader flex="1">
												<TaskIcon />
												<HeaderText>
													Titre de la tâche
												</HeaderText>
											</ColumnHeader>
											<ColumnHeader flex="0 0 140px">
												<TimeIcon />
												<HeaderText>Durée</HeaderText>
											</ColumnHeader>
											<ColumnHeader flex="0 0 140px">
												<DateIcon />
												<HeaderText>
													Deadline
												</HeaderText>
											</ColumnHeader>
											<ColumnHeader flex="0 0 140px">
												<ContactIcon />
												<HeaderText>Client</HeaderText>
											</ColumnHeader>
										</HeaderRow>
										{itemsToDo.map(item => (
											<FlexRow>
												<Item
													key={item.id}
													item={item}
													projectStatus={
														item.section.project
															.status
													}
													finishItem={finishItem}
													daysUntilDeadline={
														item.section.project
															.daysUntilDeadline
													}
													mode="dashboard"
													customer={
														item.section.project
															.customer.name
													}
													onClick={() => {
														history.push(
															`/app/dashboard/items/${
																item.id
															}`,
														);
													}}
													onClickCommentIcon={() => {
														history.push(
															`/app/dashboard/items/${
																item.id
															}#comments`,
														);
													}}
												/>
												<Mutation
													mutation={SNOOZE_ITEM}
												>
													{snoozeItemMutation => (
														<SnoozeContainer
															snoozed={
																item.status
																=== 'SNOOZED'
															}
															onClick={() => {
																snoozeItem(
																	item.id,
																	item.section
																		.id,
																	1,
																	snoozeItemMutation,
																);
															}}
														>
															<SnoozeIcon />
														</SnoozeContainer>
													)}
												</Mutation>
											</FlexRow>
										))}
									</>
								) : projectsPending.length > 0 ? (
									<div>
										<P>
											Bonjour, vous n’avez plus de tâche à
											accomplir pour l’instant !<br />
											Vous avez des projets en attente.
											C’est peut-être le moment de
											recontacter ces clients :)
										</P>
										<FlexRow>
											{projectsPending.map(project => (
												<ProjectCard
													project={project}
													inRow={true}
												/>
											))}
										</FlexRow>
										<P>Vous pouvez aussi</P>
										<LinkButton to="/app/projects/create">
											Créer un nouveau projet
										</LinkButton>
									</div>
								) : (
									<div>
										<P>
											Bravo, vous n'avez plus rien à faire
											! Voulez-vous...
										</P>
										<LinkButton to="/app/projects/create">
											Créer un nouveau projet
										</LinkButton>
									</div>
								)}
								{itemsToDoLater.length > 0 && (
									<>
										<SectionTitle>
											Il vous reste du temps ?
										</SectionTitle>
										{itemsToDoLater.map(item => (
											<FlexRow>
												<Item
													key={item.id}
													item={item}
													projectStatus={
														item.section.project
															.status
													}
													finishItem={finishItem}
													daysUntilDeadline={
														item.section.project
															.daysUntilDeadline
													}
													mode="dashboard"
													customer={
														item.section.project
															.customer.name
													}
													onClick={() => {
														history.push(
															`/app/dashboard/items/${
																item.id
															}`,
														);
													}}
													onClickCommentIcon={() => {
														history.push(
															`/app/dashboard/items/${
																item.id
															}#comments`,
														);
													}}
												/>
												<Mutation
													mutation={SNOOZE_ITEM}
												>
													{snoozeItemMutation => (
														<SnoozeContainer
															onClick={() => {
																snoozeItem(
																	item.id,
																	item.section
																		.id,
																	1,
																	snoozeItemMutation,
																);
															}}
														>
															<SnoozeIcon />
														</SnoozeContainer>
													)}
												</Mutation>
											</FlexRow>
										))}
									</>
								)}

								<Route
									path="/app/dashboard/items/:itemId"
									render={({match, history}) => (
										<Modal
											onDismiss={() => history.push('/app/dashboard')
											}
										>
											<ModalElem>
												<ItemView
													id={match.params.itemId}
													finishItem={finishItem}
												/>
											</ModalElem>
										</Modal>
									)}
								/>
							</>
						);
					}}
				</Query>
			);
		}}
	</Query>
);

export default withRouter(DashboardTasks);
