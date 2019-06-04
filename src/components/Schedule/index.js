import React, {useState} from 'react';
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

const Container = styled('div')``;

const Week = styled('div')`
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

const Schedule = ({days}) => {
	const [startDay, setStartDay] = useState(moment().startOf('week'));

	const weekdays = [];

	const iteratorDate = moment(startDay).startOf('week');

	do {
		weekdays.push({
			momentDate: iteratorDate.clone(),
			date: iteratorDate.format(moment.HTML5_FMT.DATE),
			tasks:
				(days[iteratorDate.format(moment.HTML5_FMT.DATE)]
					&& days[iteratorDate.format(moment.HTML5_FMT.DATE)].tasks)
				|| [],
		});
	} while (
		iteratorDate.add(1, 'day').toDate() < startDay.endOf('week').toDate()
	);

	return (
		<Container>
			<button
				onClick={() => setStartDay(startDay.clone().subtract(1, 'week'))
				}
			>
				prev
			</button>
			<button
				onClick={() => setStartDay(startDay.clone().add(1, 'week'))}
			>
				next
			</button>
			<Week>
				{weekdays.map(day => (
					<Day selected={moment().isSame(day.momentDate, 'day')}>
						<DayTitle>
							{day.momentDate
								.toDate()
								.toLocaleDateString('default', {
									weekday: 'short',
									day: 'numeric',
									month: moment().isSame(
										day.momentDate,
										'month',
									)
										? undefined
										: 'numeric',
									year: moment().isSame(
										day.momentDate,
										'year',
									)
										? undefined
										: '2-digit',
								})}
						</DayTitle>
						<DroppableDayTasks id={day.date}>
							{day.tasks.map((task, index) => (
								<DraggableTaskCard id={task.id} index={index}>
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
											gridColumn: isCustomerTask(
												task.type,
											)
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
			</Week>
		</Container>
	);
};

Schedule.propTypes = {};

export default Schedule;
