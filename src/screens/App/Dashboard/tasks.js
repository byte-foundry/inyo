import styled from '@emotion/styled';
import Portal from '@reach/portal';
import moment from 'moment';
import React, {useCallback, useState} from 'react';
import {useMutation, useQuery} from 'react-apollo-hooks';
import {useDrag} from 'react-dnd';
import {Route, withRouter} from 'react-router-dom';

import ArianneThread from '../../../components/ArianneThread';
import TaskView from '../../../components/ItemView';
import LeftBarSchedule from '../../../components/LeftBarSchedule';
import RescheduleModal from '../../../components/RescheduleModal';
import Schedule from '../../../components/Schedule';
import SidebarDashboardInfos from '../../../components/SidebarDashboardInfos';
import TasksList from '../../../components/TasksList';
import Task from '../../../components/TasksList/task';
import {BREAKPOINTS, DRAG_TYPES} from '../../../utils/constants';
import {
	FlexRow,
	Loading,
	ModalContainer as Modal,
	ModalElem,
} from '../../../utils/content';
import {isCustomerTask} from '../../../utils/functions';
import IllusBackground from '../../../utils/images/empty-tasks-background.svg';
import IllusFigure from '../../../utils/images/empty-tasks-illus.svg';
import {FOCUS_TASK} from '../../../utils/mutations';
import {
	IllusContainer,
	IllusFigureContainer,
	IllusText,
	P,
} from '../../../utils/new/design-system';
import {GET_ALL_TASKS, GET_USER_INFOS} from '../../../utils/queries';

const FlexRowMobile = styled(FlexRow)`
	@media (max-width: ${BREAKPOINTS}px) {
		flex-direction: column;
	}
`;

function DraggableTask({
	item,
	customerToken,
	baseUrl,
	setIsDragging = () => {},
}) {
	const [, drag] = useDrag({
		item: {
			id: item.id,
			type: DRAG_TYPES.TASK,
		},
		begin() {
			setIsDragging(true);
			return {
				id: item.id,
			};
		},
		end() {
			setIsDragging(false);
		},
	});

	if (isCustomerTask(item.type) && !item.linkedCustomer) {
		return (
			<Task item={item} customerToken={customerToken} baseUrl={baseUrl} />
		);
	}

	return (
		<Task
			ref={drag}
			item={item}
			customerToken={customerToken}
			baseUrl={baseUrl}
			isDraggable
		/>
	);
}

const DashboardTasks = ({location, history}) => {
	const {prevSearch} = location.state || {};
	const [isDragging, setIsDragging] = useState(false);
	const query = new URLSearchParams(prevSearch || location.search);

	const {data, loading, error} = useQuery(GET_ALL_TASKS, {suspend: true});
	const {
		data: userPrefsData,
		loading: loadingUserPrefs,
		error: errorUserPrefs,
	} = useQuery(GET_USER_INFOS, {suspend: true});
	const focusTask = useMutation(FOCUS_TASK);

	const onMoveTask = useCallback(
		({task, scheduledFor, position}) => {
			const cachedTask = data.me.tasks.find(t => task.id === t.id);

			if (isCustomerTask(cachedTask.type) && !cachedTask.scheduledFor) {
				history.push({
					pathname: `/app/dashboard/${task.id}`,
					state: {
						prevSearch: location.search,
						isActivating: true,
						scheduledFor,
					},
				});

				return;
			}

			if (
				isCustomerTask(cachedTask.type)
				&& cachedTask.scheduledFor !== scheduledFor
			) return;

			focusTask({
				variables: {
					itemId: task.id,
					for: scheduledFor,
					schedulePosition: position,
				},
				optimisticReponse: {
					focusTask: {
						itemId: task.id,
						for: scheduledFor,
						schedulePosition: position,
					},
				},
			});
		},
		[focusTask, data.me.tasks, history, location.search],
	);

	const projectId = query.get('projectId');
	const filter = query.get('filter');
	const tags = query.getAll('tags');
	const linkedCustomerId = query.get('customerId');

	if (loading) return <Loading />;
	if (error) throw error;
	if (errorUserPrefs) throw errorUserPrefs;

	const {
		me: {tasks},
	} = data;

	const unscheduledTasks = [];
	const tasksToReschedule = [];
	const scheduledTasksPerDay = {};

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

		history.push(`/app/dashboard?${newQuery.toString()}`);
	};

	const setCustomerSelected = (selected) => {
		const newQuery = new URLSearchParams(query);

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

		history.push(`/app/dashboard?${newQuery.toString()}`);
	};

	const setFilterSelected = (selected) => {
		const newQuery = new URLSearchParams(query);

		if (selected) {
			const {value: selectedFilterId} = selected;

			newQuery.set('filter', selectedFilterId);
		}

		history.push(`/app/dashboard?${newQuery.toString()}`);
	};

	const setTagSelected = (selected) => {
		const newQuery = new URLSearchParams(query);

		if (selected) {
			newQuery.delete('tags');
			selected.forEach(tag => newQuery.append('tags', tag.value));
		}

		history.push(`/app/dashboard?${newQuery.toString()}`);
	};

	tasks.forEach((task) => {
		if (
			task.section
			&& task.section.project.deadline
			&& task.section.project.status === 'ONGOING'
		) {
			const {project} = task.section;

			const deadlineDate = moment(project.deadline).format(
				moment.HTML5_FMT.DATE,
			);

			scheduledTasksPerDay[deadlineDate] = scheduledTasksPerDay[
				deadlineDate
			] || {
				date: deadlineDate,
				tasks: [],
				reminders: [],
				deadlines: [],
			};

			scheduledTasksPerDay[deadlineDate].deadlines.push({
				date: project.deadline,
				project,
			});
		}

		if (task.dueDate) {
			const deadlineDate = moment(task.dueDate).format(
				moment.HTML5_FMT.DATE,
			);

			scheduledTasksPerDay[deadlineDate] = scheduledTasksPerDay[
				deadlineDate
			] || {
				date: deadlineDate,
				tasks: [],
				reminders: [],
				deadlines: [],
			};

			scheduledTasksPerDay[deadlineDate].deadlines.push({
				date: task.dueDate,
				task,
			});
		}

		if (!task.scheduledFor) {
			if (!task.section || task.section.project.status === 'ONGOING') {
				unscheduledTasks.push(task);
			}

			return;
		}

		if (isCustomerTask(task.type)) {
			const plannedReminders = task.reminders.filter(
				reminder => reminder.status === 'PENDING' || reminder.status === 'SENT',
			);

			plannedReminders.forEach((reminder) => {
				const reminderDate = moment(reminder.sendingDate).format(
					moment.HTML5_FMT.DATE,
				);

				scheduledTasksPerDay[reminderDate] = scheduledTasksPerDay[
					reminderDate
				] || {
					date: reminderDate,
					tasks: [],
					reminders: [],
					deadlines: [],
				};

				scheduledTasksPerDay[reminderDate].reminders.push({
					...reminder,
					item: task,
				});
			});

			// we just want the reminders
			return;
		}

		scheduledTasksPerDay[task.scheduledFor] = scheduledTasksPerDay[
			task.scheduledFor
		] || {
			date: task.scheduledFor,
			tasks: [],
			reminders: [],
			deadlines: [],
		};

		scheduledTasksPerDay[task.scheduledFor].tasks.push(task);

		if (
			task.status === 'PENDING'
			&& !isCustomerTask(task.type)
			&& moment(task.scheduledFor).isBefore(moment(), 'day')
		) {
			tasksToReschedule.push(task);
		}
	});

	const ongoingProjectAndNoProjectTask = unscheduledTasks.filter(
		task => !task.section
			|| task.section.project.status === 'ONGOING'
			|| projectId,
	);

	const unscheduledFilteredTasks = ongoingProjectAndNoProjectTask.filter(
		task => (!linkedCustomerId
				|| ((task.linkedCustomer
					&& task.linkedCustomer.id === linkedCustomerId)
					|| (task.section
						&& task.section.project.customer
						&& task.section.project.customer.id
							=== linkedCustomerId)))
			&& (!filter || task.status === filter || filter === 'ALL')
			&& (!projectId
				|| (task.section && task.section.project.id === projectId))
			&& tags.every(tag => task.tags.some(taskTag => taskTag.id === tag)),
	);

	return (
		<>
			{loadingUserPrefs ? (
				<Loading />
			) : (
				<Schedule
					days={scheduledTasksPerDay}
					workingDays={userPrefsData.me.workingDays}
					fullWeek={userPrefsData.me.settings.hasFullWeekSchedule}
					onMoveTask={onMoveTask}
				/>
			)}
			{tasksToReschedule.length > 0 && (
				<RescheduleModal
					tasks={tasksToReschedule}
					onReschedule={onMoveTask}
				/>
			)}
			<FlexRowMobile justifyContent="space-between">
				<div style={{flex: 1}}>
					<ArianneThread
						projectId={projectId}
						linkedCustomerId={linkedCustomerId}
						selectCustomer={setCustomerSelected}
						selectProjects={setProjectSelected}
						selectFilter={setFilterSelected}
						selectTag={setTagSelected}
						filterId={filter}
						tagsSelected={tags}
						marginTop
					/>
					{tasks.length === 0
					|| unscheduledTasks.length !== 0
					|| unscheduledFilteredTasks.length
						!== unscheduledTasks.length ? (
							<TasksList
								style={{minHeight: '50px'}}
								hasFilteredItems={
									ongoingProjectAndNoProjectTask.length
								!== unscheduledFilteredTasks.length
								}
								items={unscheduledFilteredTasks}
								baseUrl="dashboard"
								createTaskComponent={({item, customerToken}) => (
									<DraggableTask
										item={item}
										key={item.id}
										customerToken={customerToken}
										baseUrl="dashboard"
										setIsDragging={setIsDragging}
									/>
								)}
							/>
						) : (
							<div style={{marginTop: '2rem'}}>
								<IllusContainer bg={IllusBackground}>
									<IllusFigureContainer fig={IllusFigure} />
									<IllusText>
										<P>
										Vous n'avez plus de tâches à planifier.
										</P>
									</IllusText>
								</IllusContainer>
							</div>
						)}
				</div>
				<SidebarDashboardInfos baseUrl="app/dashboard" />
			</FlexRowMobile>
			<Route
				path="/app/dashboard/:taskId"
				render={({match, history, location: {state = {}}}) => (
					<Modal
						onDismiss={() => history.push(
							`/app/dashboard${state.prevSearch || ''}`,
						)
						}
					>
						<ModalElem>
							<TaskView
								id={match.params.taskId}
								close={() => history.push(
									`/app/dashboard${state.prevSearch
											|| ''}`,
								)
								}
								isActivating={state.isActivating}
								scheduledFor={state.scheduledFor}
							/>
						</ModalElem>
					</Modal>
				)}
			/>
			{loadingUserPrefs ? (
				<Loading />
			) : (
				<Portal>
					<LeftBarSchedule
						isDragging={isDragging}
						days={scheduledTasksPerDay}
						fullWeek={userPrefsData.me.settings.hasFullWeekSchedule}
						onMoveTask={onMoveTask}
					/>
				</Portal>
			)}
		</>
	);
};

export default withRouter(DashboardTasks);
