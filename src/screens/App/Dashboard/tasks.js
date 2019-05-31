import React from 'react';
import {useQuery} from 'react-apollo-hooks';
import {withRouter, Route} from 'react-router-dom';
import styled from '@emotion/styled';
import {DragDropContext, Droppable, Draggable} from 'react-beautiful-dnd';

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

const SectionTitle = styled(H3)`
	color: ${primaryBlue};
	font-size: 22px;
	font-weight: 500;
	margin: 2em 0 0;
`;

const DashboardTasks = () => {
	const {data, loading, error} = useQuery(GET_ALL_TASKS, {suspend: true});

	if (loading) return <Loading />;
	if (error) throw error;

	const {
		me: {tasks},
	} = data;

	const unscheduledTasks = tasks.filter(
		task => !task.isFocused
			&& task.status === 'PENDING'
			&& (!task.section || task.section.project.status === 'ONGOING'),
	);

	return (
		<>
			<DragDropContext
				onDragEnd={async (result) => {
					console.log(result);
				}}
			>
				<SectionTitle>Planning</SectionTitle>

				<Schedule />

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
