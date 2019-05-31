import React from 'react';
import moment from 'moment';
import {Droppable, Draggable} from 'react-beautiful-dnd';
import styled from '@emotion/styled';

import {isCustomerTask} from '../../utils/functions';
import {
	mediumGrey,
	accentGrey,
	primaryBlack,
	primaryGrey,
} from '../../utils/new/design-system';
import IconButton from '../../utils/new/components/IconButton';

const Container = styled('div')`
	display: flex;
	flex-direction: row;
	justify-content: center;
`;

const Day = styled('div')`
	color: ${accentGrey};
	border: 2px solid ${mediumGrey};
	border-radius: 3px;
	padding: 0 5px;
	flex: 1;
	max-width: calc(100% / 7);
	margin: 0 -1px;

	${props => props.selected
		&& `
		color: #ff5c84;
		background: #ffe0e8;
	`}
`;

const DayTitle = styled('span')`
	color: inherit;
	text-transform: uppercase;
	font-size: 0.75rem;
	display: block;
	padding: 0.5rem 0;
	text-align: center;
`;

const DayTasks = styled('div')`
	color: ${accentGrey};
	display: flex;
	flex-direction: column;
`;

const TaskCard = styled('div')`
	background: #fff;
	border: 2px solid ${mediumGrey};
	border-radius: 3px;
	padding: 5px;
	margin-bottom: 5px;
	font-size: 0.75rem;
	display: grid;
	grid-template-columns: 1fr auto;
`;

const CardTitle = styled('span')`
	display: block;
	color: ${primaryBlack};
	text-overflow: ellipsis;
	overflow: hidden;
`;

const CardSubTitle = styled('span')`
	color: ${primaryGrey};
`;

const DraggableTaskCard = ({id, index, ...rest}) => (
	<Draggable key={id} draggableId={id} index={index} type="TASK">
		{provided => (
			<div
				className="task"
				ref={provided.innerRef}
				{...provided.draggableProps}
				{...provided.dragHandleProps}
				onMouseDown={e => provided.dragHandleProps
					&& provided.dragHandleProps.onMouseDown(e)
				}
				style={{
					// some basic styles to make the tasks look a bit nicer
					userSelect: 'none',

					// styles we need to apply on draggables
					...provided.draggableProps.style,
				}}
			>
				<TaskCard {...rest} />
			</div>
		)}
	</Draggable>
);

const DroppableDayTasks = ({id, children}) => (
	<Droppable droppableId={id} type="TASK" direction="vertical">
		{provided => (
			<DayTasks
				style={{minHeight: '50px'}}
				ref={provided.innerRef}
				{...provided.droppableProps}
			>
				{children}
				{provided.placeholder}
			</DayTasks>
		)}
	</Droppable>
);

const Schedule = () => {
	const days = [
		{
			date: '2019-05-27',
			tasks: [
				{
					type: 'DEFAULT',
					status: 'FINISHED',
					name: 'Tâche 1',
					linkedCustomer: {
						name: 'Client A',
					},
				},
				{
					type: 'DEFAULT',
					status: 'FINISHED',
					name: 'Tâche 2',
					linkedCustomer: null,
				},
				{
					type: 'CUSTOMER',
					status: 'FINISHED',
					name: 'Tâche 3',
					linkedCustomer: {
						name: 'Client A',
					},
				},
			],
		},
		{
			date: '2019-05-28',
			tasks: [
				{
					type: 'DEFAULT',
					status: 'FINISHED',
					name: 'Tâche 4',
					linkedCustomer: null,
				},
				{
					type: 'DEFAULT',
					status: 'FINISHED',
					name: 'Tâche 5',
					linkedCustomer: {
						name: 'Client A',
					},
				},
				{
					type: 'DEFAULT',
					status: 'FINISHED',
					name: 'Tâche dont le titre est très long',
					linkedCustomer: {
						name: 'Client A',
					},
				},
			],
		},
		{
			date: '2019-05-30',
			tasks: [],
		},
		{
			date: '2019-05-31',
			tasks: [
				{
					type: 'DEFAULT',
					status: 'PENDING',
					name: 'Tâche 7',
					linkedCustomer: {
						name: 'Client A',
					},
				},
				{
					type: 'DEFAULT',
					status: 'PENDING',
					name: 'Tâche 8',
					linkedCustomer: {
						name: 'Client A',
					},
				},
			],
		},
	];

	return (
		<Container>
			{days.map(day => (
				<Day selected={moment().isSame(day.date || null, 'day')}>
					<DayTitle>{moment(day.date).format('dddd')}</DayTitle>
					<DroppableDayTasks id={`day-${day.date}-tasks`}>
						{day.tasks.map((task, index) => (
							<DraggableTaskCard
								id={`${day.date}-${index}`}
								index={index}
							>
								{!isCustomerTask(task.type) && (
									<IconButton
										current={task.status === 'FINISHED'}
										invert={task.status === 'FINISHED'}
										style={{
											gridColumnStart: '2',
											gridRow: '1 / 3',
										}}
										icon="done"
										size="tiny"
									/>
								)}
								<CardTitle
									style={{
										gridColumn: isCustomerTask(task.type)
											? '1 / 3'
											: '',
									}}
								>
									{task.name}
								</CardTitle>
								{task.linkedCustomer && (
									<CardSubTitle>
										{task.linkedCustomer.name}
									</CardSubTitle>
								)}
							</DraggableTaskCard>
						))}
					</DroppableDayTasks>
				</Day>
			))}
		</Container>
	);
};

export default Schedule;
