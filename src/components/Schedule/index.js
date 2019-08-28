import styled from '@emotion/styled';
import moment from 'moment';
import PropTypes from 'prop-types';
import React, {useEffect, useState} from 'react';
import {useMutation} from 'react-apollo-hooks';
import {useDrag, useDrop} from 'react-dnd';

import {BREAKPOINTS, DRAG_TYPES} from '../../utils/constants';
import {extractScheduleFromWorkingDays} from '../../utils/functions';
import {UNFOCUS_TASK} from '../../utils/mutations';
import {
	accentGrey,
	Button,
	lightGrey,
	mediumGrey,
	primaryGrey,
	primaryPurple,
	primaryWhite,
} from '../../utils/new/design-system';
import AssignedToOtherCard from '../AssignedToOtherCard';
import DeadlineCard from '../DeadlineCard';
import DefaultDroppableDay from '../DefaultDroppableDay';
import IconButton from '../IconButton';
import MaterialIcon from '../MaterialIcon';
import RawPieChart from '../PieChart';
import Plural from '../Plural';
import ReminderCard from '../ReminderCard';
import TaskCard from '../TaskCard';
import UnitDisplay from '../UnitDisplay';

const Container = styled('div')`
	margin-top: 3rem;
	max-width: 100vw;
`;

const Week = styled('div')`
	display: flex;
	flex-direction: row;
	justify-content: center;
	border-radius: 8px;
	background-color: ${lightGrey};

	@media (max-width: ${BREAKPOINTS}px) {
		flex-flow: column;
	}
`;

const Day = styled('div')`
	color: ${accentGrey};
	padding: 0 5px;
	flex: 1;
	margin: 0;
	display: flex;
	flex-flow: column;
	position: relative;

	&:after {
		content: '';
		position: absolute;
		right: -1px;
		top: 10px;
		bottom: 10px;
		border-right: 1px solid ${mediumGrey};
	}

	&:last-child {
		&:after {
			display: none;
		}
	}

	${props => props.isOff
		&& `
		background: repeating-linear-gradient(
		  45deg,
		  ${mediumGrey},
		  ${mediumGrey} 20px,
		  transparent 20px,
		  transparent 40px
		);
	`}
`;

const DayTitle = styled('span')`
	color: inherit;
	text-transform: uppercase;
	font-size: 0.75rem;
	display: block;
	text-align: center;
	margin: 0.4rem auto;
	padding: 0.1rem 0.5rem 0;
	border-radius: 4px;

	${props => props.selected
		&& `
		color: ${primaryWhite};
		background: ${primaryPurple};
		font-weight: 500;
	`}
`;

const DayTasks = styled('div')`
	color: ${accentGrey};
	display: flex;
	flex-direction: column;
	flex: 1;
`;

const ScheduleNav = styled('div')`
	display: flex;
	margin-bottom: 1rem;
	color: ${primaryPurple};
	justify-content: flex-end;

	@media (max-width: ${BREAKPOINTS}px) {
		${Button} {
			width: auto;
		}
	}
`;

const ScheduleNavInfo = styled('div')`
	margin: 0 1rem;
	text-transform: uppercase;

	display: flex;
	align-items: center;
`;

const DayInfos = styled('div')`
	display: flex;
	align-items: flex-start;
	flex: 1;

	font-size: 0.75rem;
	line-height: 1.4;
	color: ${primaryGrey};
`;

const Icon = styled('div')`
	flex: 0 0 18px;
	margin: 13px 10px;
	margin-left: 0;
`;

const PieChart = styled(RawPieChart)`
	flex: 0 0 18px;
	margin: 13px 10px;
	margin-left: 0;
`;

const DraggableTaskCard = ({
	id, index, scheduledFor, onMove, ...rest
}) => {
	const [unfocusTask] = useMutation(UNFOCUS_TASK);
	const [, drag] = useDrag({
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
			if (typeof item.index !== 'number') {
				return onMove({id: item.id, index, scheduledFor});
			}
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

const DroppableDayTasks = ({children}) => {
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

const Schedule = ({
	startingFrom,
	onChangeWeek,
	days,
	workingDays,
	fullWeek,
	onMoveTask,
	workingTime = 8,
}) => {
	const [, setRefreshState] = useState(new Date().toJSON());

	const startDay = moment(
		moment(startingFrom).isValid() ? startingFrom : undefined,
	).startOf('week');

	const weekdays = extractScheduleFromWorkingDays(
		workingDays,
		moment(startDay).startOf('week'),
		days,
		fullWeek,
		moment(startDay).endOf('week'),
	);

	// refresh the component every 10 minutes
	useEffect(() => {
		const id = setInterval(() => {
			setRefreshState(new Date().toJSON());
		}, 10 * 60 * 1000);

		return () => clearInterval(id);
	});

	return (
		<Container>
			<ScheduleNav>
				<Button
					onClick={() => onChangeWeek(
						moment()
							.startOf('week')
							.format(moment.HTML5_FMT.DATE),
					)
					}
				>
					Aujourd'hui
				</Button>
				<IconButton
					icon="navigate_before"
					size="tiny"
					onClick={() => onChangeWeek(
						startDay
							.clone()
							.subtract(1, 'week')
							.format(moment.HTML5_FMT.DATE),
					)
					}
				/>
				<ScheduleNavInfo>Sem. {startDay.week()}</ScheduleNavInfo>
				<IconButton
					icon="navigate_next"
					size="tiny"
					onClick={() => onChangeWeek(
						startDay
							.clone()
							.add(1, 'week')
							.format(moment.HTML5_FMT.DATE),
					)
					}
				/>
			</ScheduleNav>
			<Week>
				{weekdays.map((day) => {
					const sortedTasks = [...day.tasks];
					const sortedReminders = [...day.reminders];
					const sortedDeadlines = [...day.deadlines];
					const sortedAssignedTasks = [...day.assignedTasks];

					sortedTasks.sort(
						(a, b) => a.schedulePosition - b.schedulePosition,
					);
					sortedReminders.sort((a, b) => (a.sendingDate > b.sendingDate ? 1 : -1));
					sortedDeadlines.sort((a, b) => (a.deadline > b.deadline ? 1 : -1));

					const timeLeft
						= 1
						- sortedTasks.reduce(
							(time, task) => time
								+ (task.status === 'FINISHED'
								&& task.timeItTook !== null
									? task.timeItTook
									: task.unit),
							0,
						);
					const timeSpent = sortedTasks.reduce(
						(time, task) => time + task.timeItTook,
						0,
					);
					const isPastDay = moment(day.momentDate).isBefore(
						moment(),
						'day',
					);

					let stat;

					if (isPastDay && timeSpent > 0) {
						stat = (
							<DayInfos>
								<PieChart value={timeSpent} />
								<p>
									<UnitDisplay
										unit={timeSpent}
										singularF={' travaillée'}
										pluralF={' travaillées'}
										singularM={' travaillé'}
										pluralM={' travaillés'}
									/>
								</p>
							</DayInfos>
						);
					}
					else if (!isPastDay && timeLeft > 0 && timeLeft < 1) {
						stat = (
							<DayInfos>
								<PieChart value={1 - timeLeft} />
								<p>
									<UnitDisplay
										unit={timeLeft}
										singular=" encore disponible"
										plural=" encore disponibles"
									/>
								</p>
							</DayInfos>
						);
					}
					else if (!isPastDay && timeLeft < 0) {
						stat = (
							<DayInfos>
								<PieChart value={1 - timeLeft} />
								<p>
									<UnitDisplay
										unit={-timeLeft}
										singular=" supplémentaire"
										plural=" supplémentaires"
									/>
								</p>
							</DayInfos>
						);
					}
					else if (
						!isPastDay
						&& timeLeft === workingTime
						&& sortedTasks.length > 0
					) {
						stat = (
							<DayInfos>
								<Icon>
									<MaterialIcon
										icon="settings"
										size="tiny"
										color="inherit"
									/>
								</Icon>
								<p>
									Ajoutez des durées à ces tâches pour qu'Inyo
									vous aide à gérer votre temps.
								</p>
							</DayInfos>
						);
					}

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
										key={`${task.id}-${task.schedulePosition}`}
										id={task.id}
										task={task}
										index={task.schedulePosition}
										scheduledFor={day.date}
										onMove={({
											id,
											index: position,
											scheduledFor,
										}) => {
											onMoveTask({
												task: id ? {id} : task,
												scheduledFor,
												position:
													typeof position === 'number'
														? position
														: sortedTasks.length,
											});
										}}
									/>
								))}
								<DefaultDroppableDay
									index={day.tasks.length}
									scheduledFor={day.date}
									onMove={({
										id,
										index: position,
										scheduledFor,
									}) => {
										onMoveTask({
											task: {id},
											scheduledFor,
											position:
												typeof position === 'number'
													? position
													: sortedTasks.length,
										});
									}}
								>
									{stat}
								</DefaultDroppableDay>
								{sortedReminders.map(reminder => (
									<ReminderCard
										key={reminder.id}
										datetime={reminder.sendingDate}
										reminder={reminder}
										task={reminder.item}
									/>
								))}
								{sortedDeadlines.map(deadline => (
									<DeadlineCard
										key={deadline.id}
										project={deadline.project}
										task={deadline.task}
										date={deadline.date}
									/>
								))}
								{sortedAssignedTasks.map(assignedTask => (
									<AssignedToOtherCard
										key={assignedTask.id}
										task={assignedTask}
									/>
								))}
							</DroppableDayTasks>
						</Day>
					);
				})}
			</Week>
		</Container>
	);
};

Schedule.defaultProps = {
	onChangeWeek: () => {},
	workingDays: ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY'],
	fullWeek: false,
	onMoveTask: () => {},
};

Schedule.propTypes = {
	startingFrom: PropTypes.string,
	onChangeWeek: PropTypes.func,
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
