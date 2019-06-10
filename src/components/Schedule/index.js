import React, {useState} from 'react';
import {useMutation} from 'react-apollo-hooks';
import PropTypes from 'prop-types';
import moment from 'moment';
import styled from '@emotion/styled';
import {__EXPERIMENTAL_DND_HOOKS_THAT_MAY_CHANGE_AND_BREAK_MY_BUILD__ as dnd} from 'react-dnd';

import {
	mediumGrey,
	accentGrey,
	primaryPurple,
	primaryWhite,
	lightGrey,
	Button,
} from '../../utils/new/design-system';
import {DRAG_TYPES, WEEKDAYS} from '../../utils/constants';
import {extractScheduleFromWorkingDays} from '../../utils/functions';
import {UNFOCUS_TASK} from '../../utils/mutations';
import IconButton from '../../utils/new/components/IconButton';

import TaskCard from '../TaskCard';

const {useDrop, useDrag} = dnd;

const Container = styled('div')`
	margin-top: 3rem;
`;

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
	margin: 0 -1px;

	${props => props.isOff
		&& `
		color: ${accentGrey};
		background: ${lightGrey};
	`}
`;

const DayTitle = styled('span')`
	color: inherit;
	text-transform: uppercase;
	font-size: 0.75rem;
	display: block;
	padding: 0.3rem 0;
	text-align: center;
	margin: 0.2rem 2rem 0.5rem;
	border-radius: 4px;

	${props => props.selected
		&& `
		color: ${primaryWhite};
		background: ${primaryPurple};
	`}
`;

const DayTasks = styled('div')`
	color: ${accentGrey};
	display: flex;
	flex-direction: column;
`;

const ScheduleNav = styled('div')`
	display: flex;
	margin-bottom: 1rem;
	color: ${primaryPurple};
	justify-content: flex-end;
`;

const ScheduleNavInfo = styled('div')`
	margin: 0 1rem;
	text-transform: uppercase;

	display: flex;
	align-items: center;
`;

const DraggableTaskCard = ({
	id, index, scheduledFor, onMove, ...rest
}) => {
	const unfocusTask = useMutation(UNFOCUS_TASK);
	const [_, drag] = useDrag({
		item: {id, type: DRAG_TYPES.TASK},
		begin() {
			return {
				id,
				index,
			};
		},
		end(item, monitor) {
			if (!monitor.didDrop()) {
				unfocusTask({
					variables: {
						itemId: id,
					},
				});
			}

			const result = monitor.getDropResult();

			if (!result) return;
			if (scheduledFor === result.scheduledFor) {
				if (index === result.index || index + 1 === result.index) return;

				onMove({
					index:
						result.index > index ? result.index - 1 : result.index,
					scheduledFor: result.scheduledFor,
				});
			}
			else {
				onMove({
					index: result.index,
					scheduledFor: result.scheduledFor,
				});
			}
		},
	});
	const [{isOver}, drop] = useDrop({
		accept: DRAG_TYPES.TASK,
		collect(monitor) {
			return {
				isOver: monitor.isOver(),
			};
		},
		drop(item) {
			return {index, scheduledFor};
		},
	});

	return (
		<TaskCard
			isOver={isOver}
			ref={(node) => {
				drag(node);
				drop(node);
			}}
			index={index}
			{...rest}
		/>
	);
};

const DroppableDayTasks = ({id, children}) => {
	const [{isOver}, drop] = useDrop({
		accept: DRAG_TYPES.TASK,
		collect(monitor) {
			return {
				isOver: monitor.isOver(),
			};
		},
	});

	return (
		<DayTasks ref={drop} isOver={isOver}>
			{children}
		</DayTasks>
	);
};

const PlaceholderTask = ({index, scheduledFor}) => {
	const [{isOver}, drop] = useDrop({
		accept: DRAG_TYPES.TASK,
		collect(monitor) {
			return {
				isOver: monitor.isOver(),
			};
		},
		drop(item) {
			return {index, scheduledFor};
		},
	});

	return (
		<div
			ref={drop}
			style={{height: '50px', borderTop: isOver && '5px solid black'}}
		/>
	);
};

const Schedule = ({
	days, workingDays, fullWeek, onMoveTask,
}) => {
	const [startDay, setStartDay] = useState(moment().startOf('week'));

	const iteratorDate = moment(startDay).startOf('week');

	const weekdays = extractScheduleFromWorkingDays(
		workingDays,
		iteratorDate,
		days,
		fullWeek,
		startDay,
	);

	return (
		<Container>
			<ScheduleNav>
				<Button onClick={() => setStartDay(moment().startOf('week'))}>
					Aujourd'hui
				</Button>
				<IconButton
					icon="navigate_before"
					size="tiny"
					onClick={() => setStartDay(startDay.clone().subtract(1, 'week'))
					}
				/>
				<ScheduleNavInfo>Sem. {startDay.week()}</ScheduleNavInfo>
				<IconButton
					icon="navigate_next"
					size="tiny"
					onClick={() => setStartDay(startDay.clone().add(1, 'week'))}
				/>
			</ScheduleNav>
			<Week>
				{weekdays.map((day) => {
					const sortedTasks = [...day.tasks];

					sortedTasks.sort(
						(a, b) => a.schedulePosition - b.schedulePosition,
					);

					return (
						<Day isOff={!day.workedDay}>
							<DayTitle
								selected={moment().isSame(
									day.momentDate,
									'day',
								)}
							>
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
								{sortedTasks.map(task => (
									<DraggableTaskCard
										key={`${task.id}-${
											task.schedulePosition
										}`}
										id={task.id}
										task={task}
										index={task.schedulePosition}
										scheduledFor={day.date}
										onMove={({
											index: position,
											scheduledFor,
										}) => {
											onMoveTask({
												task,
												scheduledFor,
												position,
											});
										}}
									/>
								))}
								<PlaceholderTask
									index={day.tasks.length}
									scheduledFor={day.date}
								/>
							</DroppableDayTasks>
						</Day>
					);
				})}
			</Week>
		</Container>
	);
};

Schedule.defaultProps = {
	workingDays: ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY'],
	fullWeek: false,
	onMoveTask: () => {},
};

Schedule.propTypes = {
	workingDays: PropTypes.arrayOf(
		PropTypes.oneOf([
			'MONDAY',
			'TUESDAY',
			'WEDNESDAY',
			'THURSDAY',
			'FRIDAY',
			'SATURDAY',
			'SUNDAY',
		]),
	),
	fullWeek: PropTypes.bool,
	onMoveTask: PropTypes.func,
};

export default Schedule;
