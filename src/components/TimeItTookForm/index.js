import {css} from '@emotion/core';
import styled from '@emotion/styled';
import React, {useEffect, useState} from 'react';

import {formatDuration} from '../../utils/functions';
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
	margin: 0 5px 0 0;
	padding: 0.5rem 0;
	color: ${props => (props.selected ? primaryWhite : primaryBlack)};

	:hover {
		background: ${primaryPurple};
		color: ${primaryWhite};
		border-color: transparent;
	}
`;

const TimeItTookForm = ({
	estimation, onChange, onSubmit, ...rest
}) => {
	const {workingTime = 8} = useUserInfos();
	const [selection, setSelection] = useState(estimation * workingTime * 60);

	useEffect(() => {
		onChange(selection / (workingTime * 60));
	}, [selection]);

	// every 15 minutes until 2h
	let timeList = [15, 30, 45, 60, 75, 90, 105, 120];
	const workingDay = workingTime * 60;

	// every day until there are 3 entries than the estimation
	do {
		const lastTime = timeList[timeList.length - 1];

		// if the last entry is just before 1 working day, then let's switch to days
		if (lastTime + 30 > workingDay && lastTime < workingDay) {
			timeList.push(workingDay);
		}
		// every half hours until working time
		else if (lastTime < workingDay) {
			timeList.push(lastTime + 30);
		}
		// every half day until 6 day
		else if (lastTime < workingDay * 6) {
			timeList.push(lastTime + workingDay / 2);
		}
		// every day until estimation
		else {
			timeList.push(lastTime + workingDay);
		}
	} while (timeList[timeList.length - 3] <= estimation * workingDay);

	timeList = timeList.filter(t => t !== estimation * workingDay);

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
				onBlur={value => setSelection(value * workingTime * 60)}
				onSubmit={value => onSubmit(value)}
				onTab={value => setSelection(value * workingTime * 60)}
				onFocus={value => setSelection(value * workingTime * 60)}
				autoFocus={false}
				inputStyle={({value, isHours}) => (value * 60 * (isHours ? 1 : workingTime) === selection
					? css`
								border: 2px solid ${primaryPurple};
								padding-top: 0.5rem;
								padding-bottom: 0.5rem;
						  `
					: css`
								border: 2px solid transparent;
								padding-top: 0.5rem;
								padding-bottom: 0.5rem;
						  `)
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
