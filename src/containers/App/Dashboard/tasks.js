import React from 'react';
import {Query, Mutation} from 'react-apollo';
import {withRouter, Route} from 'react-router-dom';
import styled from '@emotion/styled';
import moment from 'moment';

import TasksList from '../../../components/TasksList';
import ItemView from '../../../components/ItemView';
import ProjectCard from '../../../components/ProjectCard';

import {
	P,
	H3,
	gray20,
	gray50,
	gray80,
	primaryBlue,
	LinkButton,
	ModalContainer as Modal,
	FlexRow,
	ModalElem,
} from '../../../utils/content';
import {GET_ALL_TASKS, GET_ALL_PROJECTS} from '../../../utils/queries';
import {SNOOZE_ITEM} from '../../../utils/mutations';
import {ReactComponent as TaskIcon} from '../../../utils/icons/folder.svg';
import {ReactComponent as TimeIcon} from '../../../utils/icons/time.svg';
import {ReactComponent as DateIcon} from '../../../utils/icons/date.svg';
import {ReactComponent as ContactIcon} from '../../../utils/icons/contact.svg';
import {ReactComponent as SnoozeIcon} from '../../../utils/icons/snooze.svg';

const SectionTitle = styled(H3)`
	color: ${primaryBlue};
	font-size: 22px;
	font-weight: 500;
	margin: 2em 0;
`;

const ColumnHeader = styled('div')`
	flex: ${props => props.flex};
	display: flex;
	align-items: center;
`;

const HeaderRow = styled(FlexRow)`
	margin: 10px 105px 10px 17px;
`;

const HeaderText = styled('span')`
	margin-left: 7px;
	display: flex;
	align-items: center;
	justify-content: center;
	font-size: 14px;
	color: ${gray50};
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

const DashboardTasks = ({
	history, finishItem, unfinishItem, snoozeItem,
}) => (
	<Query query={GET_ALL_PROJECTS}>
		{({data: projectsData, loading: projectsLoading}) => {
			if (projectsLoading) return <p>Loading</p>;

			const {
				me: {projects},
			} = projectsData;
			const projectsPending = projects.filter(
				project => project.status === 'DRAFT',
			);

			return (
				<Query query={GET_ALL_TASKS}>
					{({data, loading, error}) => {
						if (loading) return <p>Loading</p>;
						if (error) throw error;

						const {me} = data;
						const tasks = me.tasks.filter(
							task => task.type === 'DEFAULT',
						);

						tasks.sort((a, b) => {
							const aDueDate
								= a.dueDate
								|| (a.section && a.section.project.deadline)
								|| undefined;
							const bDueDate
								= b.dueDate
								|| (b.section && b.section.project.deadline)
								|| undefined;

							const aMargin
								= a.dueDate
								&& a.unit
								&& moment(aDueDate).diff(moment(), 'days')
									- a.unit;
							const bMargin
								= b.dueDate
								&& b.unit
								&& moment(bDueDate).diff(moment(), 'days')
									- b.unit;

							return aMargin - bMargin;
						});

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
							&& tasks[itemsToDo.length]
						) {
							itemsToDo.push(tasks[itemsToDo.length]);
						}
						const itemsToDoLater = tasks.slice(
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
										<TasksList items={itemsToDo} />
									</>
								) : (
									<div>
										<P>Vous n'avez pas de tâche à faire</P>
									</div>
								)}
								{itemsToDoLater.length > 0 && (
									<>
										<SectionTitle>
											Il vous reste du temps ?
										</SectionTitle>
										<TasksList items={itemsToDoLater} />
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
													unfinishItem={unfinishItem}
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
