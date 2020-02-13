import styled from '@emotion/styled';
import moment from 'moment';
import React, {memo, useMemo} from 'react';
import {animated, useSpring} from 'react-spring';

import {useQuery} from '../../utils/apollo-hooks';
import {Loading} from '../../utils/content';
import {
	extractScheduleFromWorkingDays,
	getEventFromGoogleCalendarEvents,
} from '../../utils/functions';
import {
	accentGrey,
	lightGrey,
	mediumGrey,
	primaryPurple,
	primaryWhite,
} from '../../utils/new/design-system';
import {GET_PLANNED_TIMES, GET_USER_INFOS} from '../../utils/queries';
import useAccount from '../../utils/useAccount';
import useCalendar from '../../utils/useCalendar';
import usePrevious from '../../utils/usePrevious';
import useUserInfos from '../../utils/useUserInfos';
import DefaultDroppableDay from '../DefaultDroppableDay';
import PieChart from '../PieChart';

const LeftBarContainer = styled('div')`
	position: fixed;
	top: 0;
	left: 0;
	height: 100%;
	z-index: 2;
`;

const MiniDroppableDay = styled(DefaultDroppableDay)``;

const DayPieChart = styled(PieChart)`
	/* margin: 4px; */
`;

const DayElem = styled('div')`
	width: 60px;
	background: ${props => (props.isOff
		? primaryWhite
		: props.isOver
			? primaryPurple
			: primaryWhite)};
	box-sizing: border-box;
	border-radius: 50%;
	display: flex;
	flex-direction: column;
	align-items: center;
	color: ${props => (props.isOver ? (props.isOff ? accentGrey : primaryPurple) : accentGrey)};
	position: relative;
	height: ${props => (props.isOff ? '44px' : 'auto')};
`;

const DayDate = styled('div')`
	${props => !props.isOff
		&& `&::after {
		content: '';
		display: block;
		border: 2px solid white;
		position: absolute;
		width: 42px;
		height: 42px;
		top: -1px;
		border-radius: 50%;
		left: -1px;
		pointer-events: none;
	}`}
`;

const DayDateDay = styled('div')`
	text-align: center;
`;
const DayDateNumber = styled('div')`
	position: absolute;
	top: calc(50% - 8px);
	left: calc(50% - 8px);
	width: 16px;
	height: 16px;
	line-height: 0;
	text-align: center;
	display: flex;
	align-items: center;
	justify-content: center;
`;

const LeftBarElem = styled(animated.div)`
	position: absolute;
	top: 0;
	left: 0;
	transition: width 0.2s ease-out;
	height: 100%;
	background: ${primaryWhite};
	overflow-y: scroll;
	padding: 0 2rem;
`;

const LeftBarContent = styled('div')`
	display: flex;
	flex-direction: column;
`;

const MonthTitle = styled('div')`
	color: ${accentGrey};
	margin: 0.7rem;
	text-transform: uppercase;
	font-size: 14px;
	margin-top: 1rem;
`;

const Month = styled('div')`
	display: grid;
	grid-template-columns: 44px repeat(auto-fill, 44px);
	grid-gap: 2px;
`;

const DroppableDay = memo(
	({
		day, index, scheduledFor, onMove, isOff, workingTime = 8,
	}) => {
		const {language} = useUserInfos();
		const timeLeft = workingTime * (1 - day.workingTime);

		return (
			<MiniDroppableDay
				index={index}
				scheduledFor={scheduledFor}
				onMove={onMove}
				separator={false}
			>
				<DayElem isOff={isOff}>
					<DayDate isOff={isOff}>
						{!isOff && (
							<DayPieChart
								medium
								value={1 - timeLeft / workingTime}
							/>
						)}
						<DayDateNumber>
							{day.momentDate
								.toDate()
								.toLocaleDateString(language, {
									weekday: undefined,
									day: 'numeric',
									month: undefined,
									year: undefined,
								})}
						</DayDateNumber>
					</DayDate>
				</DayElem>
			</MiniDroppableDay>
		);
	},
	(prevProps, nextProps) => prevProps.day === nextProps.day
		&& prevProps.index === nextProps.index
		&& prevProps.workingTime === nextProps.workingTime
		&& prevProps.onMove === nextProps.onMove
		&& prevProps.isOff === nextProps.isOff
		&& prevProps.scheduledFor === nextProps.scheduledFor,
);

function LeftBarSchedule({isDragging, days, onMoveTask}) {
	const wasOpen = usePrevious(isDragging);
	const animatedProps = useSpring({
		to: async (next) => {
			if (isDragging) {
				await next({
					width: 337,
					padding: 15,
					paddingTop: 0,
				});
				await next({width: 337, padding: 15, paddingTop: 0});
			}
			else {
				if (wasOpen) {
					await next({
						width: 337,
						padding: 15,
						paddingTop: 0,
					});
				}
				await next({width: 0, padding: 0, paddingTop: 0});
			}
		},
		from: {width: 0, padding: 0, paddingTop: 0},
		config: {
			mass: 0.1,
			tension: 500,
			friction: 10,
			clamp: true,
		},
	});
	const {
		data: userPrefsData,
		loading: loadingUserPrefs,
		error: errorUserPrefs,
	} = useQuery(GET_USER_INFOS, {suspend: true});

	const startDate = useMemo(() => moment().startOf('day'), [
		moment().dayOfYear(),
	]);
	const endDate = useMemo(() => moment(startDate).add(180, 'days'), [
		startDate,
	]);
	const {
		data: plannedWorkingTimes,
		loading: loadingWorkingTimes,
		error: errorWorkingTimes,
	} = useQuery(GET_PLANNED_TIMES, {
		suspend: true,
		fetchPolicy: 'no-cache',
		variables: {
			from: startDate.format(moment.HTML5_FMT.DATE),
			to: endDate.format(moment.HTML5_FMT.DATE),
		},
	});
	const [account] = useAccount();
	const {data: eventsPerDay, loaded} = useCalendar(account, [
		'primary',
		startDate.toISOString(),
		endDate.toISOString(),
	]);

	const weekdays = useMemo(() => {
		if (!loadingUserPrefs) {
			const {workingDays} = userPrefsData.me;

			const weekdays = extractScheduleFromWorkingDays(
				workingDays,
				eventsPerDay,
				startDate,
				days,
				true,
				endDate,
			);

			weekdays.forEach((day) => {
				day.workingTime = (
					plannedWorkingTimes.plannedWorkingTimes.find(
						p => p.date === day.date,
					) || {workingTime: 0}
				).workingTime;
				day.onMove = ({
					id,
					type,
					linkedCustomer,
					attachments,
					index: position,
					scheduledFor,
				}) => {
					onMoveTask({
						task: {
							id,
							type,
							linkedCustomer,
							attachments,
						},
						scheduledFor,
						position:
							typeof position === 'number'
								? position
								: day.tasks.length,
					});
				};
			});

			return weekdays;
		}

		return [];
	}, [userPrefsData, eventsPerDay, startDate, days, endDate, onMoveTask]);

	if (loadingUserPrefs || loadingWorkingTimes) return <Loading />;
	if (errorUserPrefs || errorWorkingTimes) throw errorUserPrefs || errorWorkingTimes;

	const months = weekdays.reduce((acc, weekday) => {
		const monthNumber = weekday.momentDate.month();
		let month = acc.find(m => m.month === monthNumber);

		if (!month) {
			month = {month: monthNumber, days: []};
			acc.push(month);
		}

		month.days = [...month.days, weekday];
		return acc;
	}, []);

	months.forEach((month) => {
		const firstDay = month.days[0];

		// we sub 0 (sunday) by 7 to start the week on monday
		const paddingNumber = (firstDay.momentDate.day() || 7) - 1;
		month.days = [...Array(paddingNumber).fill(null), ...month.days];
	});

	return (
		<LeftBarContainer>
			<LeftBarElem style={animatedProps} id="left-bar-schedule">
				<LeftBarContent>
					{months.map(({month, days}) => (
						<>
							<MonthTitle>
								{moment()
									.month(month)
									.format('MMMM')}
							</MonthTitle>
							<Month>
								{days.map((day) => {
									if (day === null) {
										return <div></div>;
									}

									return (
										<DroppableDay
											key={day.date}
											day={day}
											index={day.tasks.length}
											scheduledFor={day.date}
											isOff={!day.workedDay}
											onMove={day.onMove}
										/>
									);
								})}
							</Month>
						</>
					))}
				</LeftBarContent>
			</LeftBarElem>
		</LeftBarContainer>
	);
}

export default LeftBarSchedule;
