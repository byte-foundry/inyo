import React from 'react';
import styled from 'react-emotion';

import {gray80, primaryBlue} from '../../utils/content.js';

const TimeInputContainer = styled('div')`
	margin: 15px;
`;

const TimeInputRange = styled('div')`
	width: 100%;
	height: 8px;
	background: ${gray80};
	border-radius: 4px;
	position: relative;
	margin-top: 40px;
`;

const TimeInput = styled('div')`
	position: absolute;
	background: ${primaryBlue};
	height: 20px;
	width: 20px;
	border-radius: 50%;
	left: calc(${props => props.percentage}% - 10px);
	top: -6px;
	cursor: pointer;
`;

const TimeDisplay = styled('div')`
	position: absolute;
	left: calc(${props => props.percentage}% - 10px);
	top: -35px;
`;

const RangeDecoration = styled('div')`
	position: absolute;
	background: ${primaryBlue};
	left: ${props => props.start}%;
	width: ${props => props.end - props.start}%;
	height: 100%;
	border-radius: 4px;
`;

export default function DoubleRangeTimeInput(props) {
	const {
		start: [startHour, startMinutes],
		end: [endHour, endMinutes],
	} = props.value;

	const startPercentage = (startHour / 24 + startMinutes / (60 * 24)) * 100;
	const endPercentage = (endHour / 24 + endMinutes / (60 * 24)) * 100;

	return (
		<TimeInputContainer>
			<TimeInputRange>
				<RangeDecoration start={startPercentage} end={endPercentage} />
				<TimeDisplay percentage={startPercentage}>
					{startHour}h{startMinutes.toString().padStart(2, '0')}
				</TimeDisplay>
				<TimeDisplay percentage={endPercentage}>
					{endHour}h{endMinutes.toString().padStart(2, '0')}
				</TimeDisplay>
				<TimeInput percentage={startPercentage} />
				<TimeInput percentage={endPercentage} />
			</TimeInputRange>
		</TimeInputContainer>
	);
}
