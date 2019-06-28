import styled from '@emotion/styled';
import React from 'react';

import {gray30, primaryBlue} from '../../utils/content';

const TimeInputContainer = styled('div')`
	padding: 15px;
`;

const TimeInputRange = styled('div')`
	width: 100%;
	height: 8px;
	background: ${gray30};
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
	user-select: none;
	-moz-user-select: none;
	-khtml-user-select: none;
	-webkit-user-select: none;
	-o-user-select: none;
`;

const RangeDecoration = styled('div')`
	position: absolute;
	background: ${primaryBlue};
	left: ${props => props.start}%;
	width: ${props => props.end - props.start}%;
	height: 100%;
	border-radius: 4px;
`;
const trackingEnum = {
	START: 'trackingStart',
	END: 'trackingEnd',
};

const trackingState = {
	[trackingEnum.START]: false,
	[trackingEnum.END]: false,
};

const inputRange = React.createRef();

function track(trackingSide, value) {
	return (e) => {
		e.preventDefault();
		e.stopPropagation();
		trackingState[trackingSide] = value;
	};
}

function convertMousePosToTime(e) {
	const mouseOffset = e.clientX;
	const baseOffset = inputRange.current.getBoundingClientRect().left;
	const realOffset = mouseOffset - baseOffset;
	const baseWidth = inputRange.current.getBoundingClientRect().width;

	const percentage = Math.max(Math.min(realOffset / baseWidth, 1), 0);

	const time = percentage * 60 * 24 - 1;

	let hour = Math.max(Math.min(Math.floor(time / 60), 23), 0);

	let minutes = Math.round((time % 60) / 10) * 10;

	if (minutes >= 60) {
		if (hour < 23) {
			minutes = 0;
			hour += 1;
		}
		else {
			minutes = 59;
		}
	}
	minutes = minutes < 0 ? 0 : minutes;

	return [hour, minutes];
}

export default function DoubleRangeTimeInput(props) {
	const {
		start: [startHour, startMinutes],
		end: [endHour, endMinutes],
	} = props.value;
	const {setFieldValue, style} = props;

	const startPercentage = (startHour / 24 + startMinutes / (60 * 24)) * 100;
	const endPercentage = (endHour / 24 + endMinutes / (60 * 24)) * 100;

	return (
		<TimeInputContainer
			onMouseMove={(e) => {
				if (trackingState[trackingEnum.START]) {
					const [
						newStartHour,
						newStartMinutes,
					] = convertMousePosToTime(e, trackingEnum.START);

					setFieldValue('startHour', newStartHour);
					setFieldValue('startMinutes', newStartMinutes);
				}
				else if (trackingState[trackingEnum.END]) {
					const [newEndHour, newEndMinutes] = convertMousePosToTime(
						e,
						trackingEnum.START,
					);

					setFieldValue('endHour', newEndHour);
					setFieldValue('endMinutes', newEndMinutes);
				}
			}}
			style={style}
		>
			<TimeInputRange innerRef={inputRange}>
				{endPercentage < startPercentage ? (
					<>
						<RangeDecoration start={0} end={endPercentage} />
						<RangeDecoration start={startPercentage} end={100} />
					</>
				) : (
					<RangeDecoration
						start={startPercentage}
						end={endPercentage}
					/>
				)}
				<TimeDisplay percentage={startPercentage}>
					{startHour}h{startMinutes.toString().padStart(2, '0')}
				</TimeDisplay>
				<TimeDisplay percentage={endPercentage}>
					{endHour}h{endMinutes.toString().padStart(2, '0')}
				</TimeDisplay>
				<TimeInput
					percentage={startPercentage}
					onMouseDown={track(trackingEnum.START, true)}
					onMouseUp={track(trackingEnum.START, false)}
				/>
				<TimeInput
					percentage={endPercentage}
					onMouseDown={track(trackingEnum.END, true)}
					onMouseUp={track(trackingEnum.END, false)}
				/>
			</TimeInputRange>
		</TimeInputContainer>
	);
}
