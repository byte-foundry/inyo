import {css} from '@emotion/core';
import styled from '@emotion/styled';
import moment from 'moment';
import React, {useEffect, useState} from 'react';

import {
	mediumGrey,
	primaryBlack,
	primaryPurple,
	primaryWhite,
} from '../../utils/new/design-system';
import useUserInfos from '../../utils/useUserInfos';
import UnitInput from '../UnitInput';

const Container = styled('div')`
	display: flex;
	margin-bottom: 10px;
`;

const SuggestedTime = styled('button')`
	flex: 1;
	background: ${props => (props.selected ? primaryPurple : primaryWhite)};
	border: 1px solid ${props => (props.selected ? 'transparent' : mediumGrey)};
	box-shadow: 3px 3px 6px ${mediumGrey};
	border-radius: 3px;
	line-height: 0;
	cursor: pointer;
	transition: all 300ms ease;
	margin: 0 5px;
	color: ${props => (props.selected ? primaryWhite : primaryBlack)};

	:hover {
		background: ${primaryPurple};
		color: ${primaryWhite};
		border-color: transparent;
	}
`;

const formatDuration = (minutes, minutesInDay) => {
	let formattedTime = '';

	if (minutes >= minutesInDay) {
		formattedTime += `${minutes / minutesInDay}j`;
		return formattedTime;
	}

	const remainingMinutes = moment.duration(minutes % minutesInDay, 'minutes');

	if (remainingMinutes.get('hours') > 0) {
		formattedTime += `${remainingMinutes.get('hours')}h`;
	}

	if (remainingMinutes.get('minutes') > 0) {
		formattedTime += `${remainingMinutes.get('minutes')}min`;
	}

	return formattedTime;
};

const TimeItTookForm = ({
	estimation, onChange, onSubmit, ...rest
}) => {
	const {workingTime: exactWorkingTime = 8} = useUserInfos();
	const [selection, setSelection] = useState(
		estimation * exactWorkingTime * 60,
	);
	const workingTime = Math.ceil(exactWorkingTime);

	useEffect(() => {
		onChange(selection / (exactWorkingTime * 60));
	}, [selection]);

	// every 15 minutes until 2h
	const timeList = [15, 30, 45, 60, 75, 90, 105, 120];
	const workingDay = workingTime * 60;

	// every day until there are 3 entries than the estimation
	do {
		// every half hours until working time
		if (timeList[timeList.length - 1] < workingDay) {
			timeList.push(timeList[timeList.length - 1] + 30);
		}
		// every half day until 6 day
		else if (timeList[timeList.length - 1] < workingDay * 6) {
			timeList.push(timeList[timeList.length - 1] + workingDay / 2);
		}
		// every day until estimation
		else {
			timeList.push(timeList[timeList.length - 1] + workingDay);
		}
	} while (timeList[timeList.length - 3] <= estimation * workingDay);

	let nextTimeIndex = 0;

	// eslint-disable-next-line no-restricted-syntax
	for (const [index, time] of timeList.entries()) {
		if (
			index > 0
			&& timeList[index - 1] <= estimation * workingDay
			&& time > estimation * workingDay
		) {
			nextTimeIndex = index;
			break;
		}
	}

	const underestimatedTimes = timeList.slice(
		nextTimeIndex - 3,
		nextTimeIndex,
	);
	const overestimatedTimes = timeList.slice(
		nextTimeIndex,
		nextTimeIndex + 3 + (3 - underestimatedTimes.length),
	);

	return (
		<Container {...rest}>
			{underestimatedTimes.map(time => (
				<SuggestedTime
					key={time}
					selected={selection === time}
					onClick={() => setSelection(time)}
				>
					{formatDuration(time, workingDay)}
				</SuggestedTime>
			))}
			<UnitInput
				unit={estimation}
				onBlur={value => setSelection(value * exactWorkingTime * 60)}
				onSubmit={value => onSubmit(value)}
				onTab={value => setSelection(value * exactWorkingTime * 60)}
				autoFocus={false}
				inputStyle={({value, isHours}) => value * 60 * (isHours ? 1 : exactWorkingTime)
						=== selection
					&& css`
						border: 2px solid ${primaryPurple};
					`
				}
			/>
			{overestimatedTimes.map(time => (
				<SuggestedTime
					key={time}
					selected={selection === time}
					onClick={() => setSelection(time)}
				>
					{formatDuration(time, workingDay)}
				</SuggestedTime>
			))}
		</Container>
	);
};

export default TimeItTookForm;
