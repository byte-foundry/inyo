import {css} from '@emotion/core';
import styled from '@emotion/styled';
import React, {useEffect, useState} from 'react';

import {BREAKPOINTS} from '../../utils/constants';
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

	@media (max-width: ${BREAKPOINTS.mobile}px) {
		display: grid;
		width: 100%;
		grid-template-columns: 22% 22% 22% 34%;
	}
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
	padding: 0.5rem;
	color: ${props => (props.selected ? primaryWhite : primaryBlack)};

	:hover {
		background: ${primaryPurple};
		color: ${primaryWhite};
		border-color: transparent;
	}

	@media (max-width: ${BREAKPOINTS.mobile}px) {
		height: 1.5rem;
		margin-bottom: 5px;
	}
`;

const UnitWithSuggestionsForm = ({
	isTimeItTook,
	value,
	onChange,
	onSubmit,
	small,
	...rest
}) => {
	const {workingTime = 8} = useUserInfos();

	const [defaultValue, setDefaultValue] = useState();

	useEffect(() => {
		setDefaultValue(value);
	}, []);

	let underestimatedTimes;

	const timeValue = value * workingTime * 60;

	let overestimatedTimes;
	const workingDay = workingTime * 60;

	if (isTimeItTook) {
		// every 15 minutes until 2h
		let timeList = [15, 30, 45, 60, 75, 90, 105, 120];

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
		} while (timeList[timeList.length - 3] <= defaultValue * workingDay);

		timeList = timeList.filter(t => t !== defaultValue * workingDay);

		let nextTimeIndex = 0;

		// eslint-disable-next-line no-restricted-syntax
		for (const [index, time] of timeList.entries()) {
			if (
				index > 0
				&& timeList[index - 1] <= defaultValue * workingDay
				&& time > defaultValue * workingDay
			) {
				nextTimeIndex = index;
				break;
			}
		}

		underestimatedTimes = timeList.slice(nextTimeIndex - 3, nextTimeIndex);
		overestimatedTimes = timeList.slice(
			nextTimeIndex,
			nextTimeIndex + 3 + (3 - underestimatedTimes.length),
		);
	}
	else {
		underestimatedTimes = [15, 30, 45, 60, 90, 120, 240];
		overestimatedTimes = [];
	}

	return (
		<Container {...rest}>
			{underestimatedTimes.map(time => (
				<SuggestedTime
					key={time}
					selected={timeValue === time}
					onClick={() => onChange(time / (workingTime * 60))}
				>
					{formatDuration(time, workingDay)}
				</SuggestedTime>
			))}
			<UnitInput
				unit={value}
				onChange={onChange}
				onBlur={inputValue => onChange(inputValue)}
				onSubmit={inputValue => onSubmit(inputValue)}
				onTab={inputValue => onChange(inputValue)}
				onFocus={inputValue => onChange(inputValue)}
				autoFocus={false}
				inputStyle={({inputValue, isHours}) => css`
					border: 2px solid
						${inputValue / (isHours ? workingTime : 1) === value
			? primaryPurple
			: 'transparent'};

					${!small
						&& `
						padding-top: 0.5rem;
						padding-bottom: 0.5rem;
					`}
				`}
			/>
			{overestimatedTimes.map(time => (
				<SuggestedTime
					key={time}
					selected={timeValue === time}
					onClick={() => onChange(time / (workingTime * 60))}
				>
					{formatDuration(time, workingDay)}
				</SuggestedTime>
			))}
		</Container>
	);
};

UnitWithSuggestionsForm.defaultProps = {
	onChange: () => {},
	small: false,
	value: 0,
	isTimeItTook: false,
};

export default UnitWithSuggestionsForm;
