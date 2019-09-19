import styled from '@emotion/styled';
import moment from 'moment';
import React from 'react';
import {useQuery} from 'react-apollo-hooks';
import {animated, useSpring} from 'react-spring';

import {Loading} from '../../utils/content';
import {
	extractScheduleFromWorkingDays,
	getEventFromGoogleCalendarEvents,
} from '../../utils/functions';
import {
	lightGrey,
	mediumGrey,
	primaryPurple,
	primaryWhite,
} from '../../utils/new/design-system';
import {GET_USER_INFOS} from '../../utils/queries';
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

const DayPieChart = styled(PieChart)`
	margin: 10px;
`;

const DayElem = styled('div')`
	width: calc(100% - 2rem);
	background: ${props => (props.isOver ? primaryPurple : props.isOff ? mediumGrey : primaryWhite)};
	margin: 1rem 1rem 0;
	box-sizing: border-box;
	height: 100px;
	border-radius: 24px;
	display: flex;
	flex-flow: column;
	align-items: center;
	justify-content: space-between;
	padding-top: 7px;
	color: ${props => (props.isOver
		? props.isOff
			? mediumGrey
			: primaryWhite
		: primaryPurple)};
	border: solid 2px ${primaryWhite};
	position: relative;
`;

const DayDate = styled('div')``;
const DayDateDay = styled('div')`
	text-align: center;
`;
const DayDateNumber = styled('div')`
	font-weight: 600;
`;

const LeftBarElem = styled(animated.div)`
	position: absolute;
	top: 0;
	left: 0;
	width: ${props => (props.open ? '70px' : '0px')};
	transition: width 0.2s ease-out;
	height: 100%;
	background: ${lightGrey};
	overflow: hidden;
`;

const LeftBarContent = styled('div')`
	width: 70px;
`;

function DroppableDay({
	day,
	index,
	scheduledFor,
	onMove,
	isOff,
	workingTime = 8,
}) {
	const {language} = useUserInfos();
	const timeLeft
		= workingTime
		- day.tasks.reduce((time, task) => time + task.unit, 0) * workingTime;

	return (
		<DefaultDroppableDay
			index={index}
			scheduledFor={scheduledFor}
			onMove={onMove}
			separator={false}
		>
			<DayElem isOff={isOff}>
				<DayDate>
					<DayDateDay>
						{day.momentDate.toDate().toLocaleDateString(language, {
							weekday: 'narrow',
							day: undefined,
							month: undefined,
							year: undefined,
						})}
					</DayDateDay>
					<DayDateNumber>
						{day.momentDate.toDate().toLocaleDateString(language, {
							weekday: undefined,
							day: 'numeric',
							month: undefined,
							year: undefined,
						})}
					</DayDateNumber>
				</DayDate>
				<DayPieChart value={1 - timeLeft / workingTime} />
			</DayElem>
		</DefaultDroppableDay>
	);
}

function LeftBarSchedule({
	isDragging, days, fullWeek, onMoveTask,
}) {
	const wasOpen = usePrevious(isDragging);
	const animatedProps = useSpring({
		to: async (next) => {
			if (isDragging) {
				await next({
					width: 70,
				});
				await next({width: 70});
			}
			else {
				if (wasOpen) {
					await next({
						width: 70,
					});
				}
				await next({width: 0});
			}
		},
		from: {width: 0},
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

	const startDate = moment().startOf('day');
	const endDate = moment(startDate).add(12, 'days');
	const [account] = useAccount();
	const {data: eventsPerDay, loaded} = useCalendar(account, [
		'primary',
		startDate.toISOString(),
		endDate.toISOString(),
	]);

	if (loadingUserPrefs) return <Loading />;
	if (errorUserPrefs) throw errorUserPrefs;

	const {workingDays} = userPrefsData.me;

	const weekdays = extractScheduleFromWorkingDays(
		workingDays,
		eventsPerDay,
		startDate,
		days,
		fullWeek,
		endDate,
	);

	return (
		<LeftBarContainer>
			<LeftBarElem style={animatedProps}>
				<LeftBarContent>
					{weekdays.map(day => (
						<DroppableDay
							key={day.date}
							day={day}
							index={day.tasks.length}
							scheduledFor={day.date}
							isOff={!day.workedDay}
							onMove={({id, index: position, scheduledFor}) => {
								onMoveTask({
									task: {id},
									scheduledFor,
									position:
										typeof position === 'number'
											? position
											: day.tasks.length,
								});
							}}
						/>
					))}
				</LeftBarContent>
			</LeftBarElem>
		</LeftBarContainer>
	);
}

export default LeftBarSchedule;
