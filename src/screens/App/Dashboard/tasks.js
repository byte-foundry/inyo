import React, {useState} from 'react';
import {useQuery, useMutation} from 'react-apollo-hooks';
import {withRouter, Route} from 'react-router-dom';
import {DragDropContext, Droppable, Draggable} from 'react-beautiful-dnd';

import Schedule from '../../../components/Schedule';
import TasksList from '../../../components/TasksList';
import Task from '../../../components/TasksList/task';
import TaskView from '../../../components/ItemView';
import ArianneThread from '../../../components/ArianneThread';
import TaskCard from '../../../components/TaskCard';

import {
	ModalContainer as Modal,
	ModalElem,
	Loading,
} from '../../../utils/content';
import {GET_ALL_TASKS, GET_USER_INFOS} from '../../../utils/queries';
import {FOCUS_TASK} from '../../../utils/mutations';

const DashboardTasks = ({location, history}) => {
	const {prevSearch} = location.state || {};
	const [draggedId, setDraggedId] = useState();
	const query = new URLSearchParams(prevSearch || location.search);

	const {data, loading, error} = useQuery(GET_ALL_TASKS, {suspend: true});
	const {data: userPrefsData, loadingUserPrefs, errorUserPrefs} = useQuery(
		GET_USER_INFOS,
		{suspend: true},
	);
	const focusTask = useMutation(FOCUS_TASK);

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
	const scheduledTasks = {};

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

		history.push(`/app/tasks?${newQuery.toString()}`);
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

		history.push(`/app/tasks?${newQuery.toString()}`);
	};

	const setFilterSelected = (selected) => {
		const newQuery = new URLSearchParams(query);

		if (selected) {
			const {value: selectedFilterId} = selected;

			newQuery.set('filter', selectedFilterId);
		}

		history.push(`/app/tasks?${newQuery.toString()}`);
	};

	const setTagSelected = (selected) => {
		const newQuery = new URLSearchParams(query);

		if (selected) {
			newQuery.delete('tags');
			selected.forEach(tag => newQuery.append('tags', tag.value));
		}

		history.push(`/app/tasks?${newQuery.toString()}`);
	};

	tasks.forEach((task) => {
		if (!task.scheduledFor) {
			if (
				task.status === 'PENDING'
				&& (!task.section || task.section.project.status === 'ONGOING')
			) {
				unscheduledTasks.push(task);
			}

			return;
		}

		scheduledTasks[task.scheduledFor] = scheduledTasks[
			task.scheduledFor
		] || {
			date: task.scheduledFor,
			tasks: [],
		};

		scheduledTasks[task.scheduledFor].tasks.push(task);
	});

	return (
		<>
			<DragDropContext
				onDragEnd={async (result) => {
					setDraggedId(undefined);
					if (
						result.destination
						&& (result.source.droppableId
							!== result.destination.droppableId
							|| result.source.index !== result.destination.index)
					) {
						await focusTask({
							variables: {
								itemId: result.draggableId,
								for: result.destination.droppableId,
								schedulePosition: result.destination.index,
							},
						});
					}
				}}
			>
				{loadingUserPrefs ? (
					<Loading />
				) : (
					<Schedule
						days={scheduledTasks}
						workingDays={userPrefsData.me.workingDays}
						fullWeek={userPrefsData.me.settings.hasFullWeekSchedule}
					/>
				)}

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
				<Droppable
					isDropDisabled
					droppableId="unscheduled-tasks"
					type="TASK"
					direction="vertical"
				>
					{provided => (
						<TasksList
							style={{minHeight: '50px'}}
							innerRef={provided.innerRef}
							{...provided.droppableProps}
							items={unscheduledTasks}
							baseUrl="dashboard"
							createTaskComponent={({
								item,
								index,
								customerToken,
							}) => (
								<Draggable
									key={item.id}
									draggableId={item.id}
									index={index}
									type="TASK"
								>
									{(provided, snapshot) => (
										<div
											ref={provided.innerRef}
											{...provided.draggableProps}
											{...provided.dragHandleProps}
											onMouseDown={(e) => {
												setDraggedId(item.id);
												return (
													provided.dragHandleProps
													&& provided.dragHandleProps.onMouseDown(
														e,
													)
												);
											}}
											style={
												draggedId === item.id
													? {
														// some basic styles to make the tasks look a bit nicer
														userSelect: 'none',
														// styles we need to apply on draggables
														...provided
															.draggableProps
															.style,
														width: '100px',
													  }
													: {
														// some basic styles to make the tasks look a bit nicer
														userSelect: 'none',
														// styles we need to apply on draggables
														...provided
															.draggableProps
															.style,
													  }
											}
										>
											{draggedId === item.id ? (
												<TaskCard
													task={item}
													index={index}
												/>
											) : (
												<Task
													item={item}
													key={item.id}
													customerToken={
														customerToken
													}
													baseUrl="dashboard"
												/>
											)}
										</div>
									)}
								</Draggable>
							)}
						>
							{provided.placeholder}
						</TasksList>
					)}
				</Droppable>
			</DragDropContext>

			<Route
				path="/app/dashboard/:taskId"
				render={({match, history}) => (
					<Modal onDismiss={() => history.push('/app/dashboard')}>
						<ModalElem>
							<TaskView
								id={match.params.taskId}
								close={() => history.push('/app/dashboard')}
							/>
						</ModalElem>
					</Modal>
				)}
			/>
		</>
	);
};

export default withRouter(DashboardTasks);
