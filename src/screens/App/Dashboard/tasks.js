import React from 'react';
import {useQuery, useMutation} from 'react-apollo-hooks';
import {withRouter, Route} from 'react-router-dom';
import styled from '@emotion/styled';
import {DragDropContext, Droppable, Draggable} from 'react-beautiful-dnd';
import moment from 'moment';

import Schedule from '../../../components/Schedule';
import TasksList from '../../../components/TasksList';
import Task from '../../../components/TasksList/task';
import TaskView from '../../../components/ItemView';
import noTaskPlanned from '../../../utils/images/bermuda-searching.svg';

import {
	H3,
	primaryBlue,
	ModalContainer as Modal,
	ModalElem,
	Loading,
} from '../../../utils/content';
import {GET_ALL_TASKS} from '../../../utils/queries';
import {FOCUS_TASK} from '../../../utils/mutations';

const SectionTitle = styled(H3)`
	color: ${primaryBlue};
	font-size: 22px;
	font-weight: 500;
	margin: 2em 0 0;
`;

const DashboardTasks = () => {
	const {data, loading, error} = useQuery(GET_ALL_TASKS, {suspend: true});
	const focusTask = useMutation(FOCUS_TASK);

	if (loading) return <Loading />;
	if (error) throw error;

	const {
		me: {tasks},
	} = data;

	const unscheduledTasks = [];
	const scheduledTasks = {};

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
					if (
						result.destination
						&& (result.source.droppableId
							!== result.destination.droppableId
							|| result.source.index !== result.destination.index)
					) {
						await focusTask({
							variables: {
								itemId: result.draggableId,
								for: moment(result.destination.id).format(
									moment.HTML5_FMT.DATE,
								),
								schedulePosition: result.destination.index,
							},
						});
					}
				}}
			>
				<SectionTitle>Planning</SectionTitle>

				<Schedule days={scheduledTasks} />

				<SectionTitle>Tâches à planifier</SectionTitle>

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
											onMouseDown={e => provided.dragHandleProps
												&& provided.dragHandleProps.onMouseDown(
													e,
												)
											}
											style={{
												// some basic styles to make the tasks look a bit nicer
												userSelect: 'none',

												// styles we need to apply on draggables
												...provided.draggableProps
													.style,
											}}
										>
											{snapshot.isDragging ? (
												<p>is dragging</p>
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
