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
	top: -6px;
	cursor: pointer;

	${props => (props.square
		? `
		width: 10px;
		left: calc(${props.percentage}% - 5px);
	`
		: `
		border-radius: 50%;
		width: 20px;
		left: calc(${props.percentage}% - 10px);
	`)}
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
	BREAK_START: 'trackingBreakStart',
	BREAK_END: 'trackingBreakEnd',
};

let trackingState = null;

const inputRange = React.createRef();

function track(trackingSide, isStarting) {
	return (e) => {
		e.preventDefault();
		e.stopPropagation();
		trackingState = isStarting ? trackingSide : null;
	};
}

function convertMousePosToTime({x}) {
	const baseOffset = inputRange.current.getBoundingClientRect().left;
	const realOffset = x - baseOffset;
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

const isCloserToA = (curr, a, b) => Math.abs(curr[0] * 60 + curr[1] - (a[0] * 60 + a[1]))
	< Math.abs(curr[0] * 60 + curr[1] - (b[0] * 60 + b[1]));

export default function DoubleRangeTimeInput(props) {
	const {
		start: [startHour, startMinutes],
		end: [endHour, endMinutes],
		breakStart: [breakStartHour, breakStartMinutes],
		breakEnd: [breakEndHour, breakEndMinutes],
	} = props.value;
	const {setFieldValue, style} = props;

	const startPercentage = (startHour / 24 + startMinutes / (60 * 24)) * 100;
	const endPercentage = (endHour / 24 + endMinutes / (60 * 24)) * 100;
	const breakStartPercentage
		= (breakStartHour / 24 + breakStartMinutes / (60 * 24)) * 100;
	const breakEndPercentage
		= (breakEndHour / 24 + breakEndMinutes / (60 * 24)) * 100;

	const start = startHour * 60 + startMinutes;
	const end = endHour * 60 + endMinutes;
	const breakStart = breakStartHour * 60 + breakStartMinutes;
	const breakEnd = breakEndHour * 60 + breakEndMinutes;

	const moveCurrentTo = (newTime) => {
		const newTimeMinutes = newTime[0] * 60 + newTime[1];

		if (trackingState === trackingEnum.START) {
			const [newStartHour, newStartMinutes] = newTime;

			if (start < end || start > breakStart) {
				// [0, breakStart[ ]end, 100]
				if (
					newTimeMinutes >= breakStart - 10
					&& newTimeMinutes <= end + 10
				) {
					// closer to one or the other
					if (
						isCloserToA(
							newTime,
							[breakStartHour, breakStartMinutes],
							[endHour, endMinutes],
						)
					) {
						setFieldValue(
							'startHour',
							parseInt((breakStart - 10) / 60, 10),
						);
						setFieldValue('startMinutes', (breakStart - 10) % 60);
					}
					else {
						setFieldValue(
							'startHour',
							parseInt((end + 10) / 60, 10),
						);
						setFieldValue('startMinutes', (end + 10) % 60);
					}
				}
				else {
					setFieldValue('startHour', newStartHour);
					setFieldValue('startMinutes', newStartMinutes);
				}
			}
			else {
				// ]end, breakStart[
				const cap = Math.min(
					Math.max(newStartHour * 60 + newStartMinutes, end + 10),
					breakStart - 10,
				);

				setFieldValue('startHour', parseInt(cap / 60, 10));
				setFieldValue('startMinutes', cap % 60);
			}
		}
		else if (trackingState === trackingEnum.END) {
			const [newEndHour, newEndMinutes] = newTime;

			if (start < end || end < breakEnd) {
				// [0, start[ ]breakEnd, 100]
				if (
					newTimeMinutes >= start - 10
					&& newTimeMinutes <= breakEnd - 10
				) {
					// closer to one or the other
					if (
						isCloserToA(
							newTime,
							[startHour, startMinutes],
							[breakEndHour, breakEndMinutes],
						)
					) {
						setFieldValue(
							'endHour',
							parseInt((start - 10) / 60, 10),
						);
						setFieldValue('endMinutes', (start - 10) % 60);
					}
					else {
						setFieldValue(
							'endHour',
							parseInt((breakEnd - 10) / 60, 10),
						);
						setFieldValue('endMinutes', (breakEnd + 10) % 60);
					}
				}
				else {
					setFieldValue('endHour', newEndHour);
					setFieldValue('endMinutes', newEndMinutes);
				}
			}
			else {
				// ]breakEnd, start[
				const cap = Math.min(
					Math.max(newEndHour * 60 + newEndMinutes, breakEnd + 10),
					start - 10,
				);

				setFieldValue('endHour', parseInt(cap / 60, 10));
				setFieldValue('endMinutes', cap % 60);
			}
		}
		else if (trackingState === trackingEnum.BREAK_START) {
			const [newBreakStartHour, newBreakStartMinutes] = newTime;

			if (breakStart < start || breakStart > breakEnd) {
				// [0, breakEnd] ]start, 100]
				if (
					newTimeMinutes >= breakEnd
					&& newTimeMinutes <= start + 10
				) {
					// closer to one or the other
					if (
						isCloserToA(
							newTime,
							[breakEndHour, breakEndMinutes],
							[startHour, startMinutes],
						)
					) {
						setFieldValue('breakStartHour', breakEndHour);
						setFieldValue('breakStartMinutes', breakEndMinutes);
					}
					else {
						setFieldValue(
							'breakStartHour',
							parseInt((start + 10) / 60, 10),
						);
						setFieldValue('breakStartMinutes', (start + 10) % 60);
					}
				}
				else {
					setFieldValue('breakStartHour', newBreakStartHour);
					setFieldValue('breakStartMinutes', newBreakStartMinutes);
				}
			}
			else {
				// ]start, breakEnd]
				const cap = Math.min(
					Math.max(
						newBreakStartHour * 60 + newBreakStartMinutes,
						start + 10,
					),
					breakEnd,
				);

				setFieldValue('breakStartHour', parseInt(cap / 60, 10));
				setFieldValue('breakStartMinutes', cap % 60);
			}
		}
		else if (trackingState === trackingEnum.BREAK_END) {
			const [newBreakEndHour, newBreakEndMinutes] = newTime;

			if (breakEnd < breakStart || breakEnd > end) {
				// [0, end[ [breakStart, 100]
				if (
					newTimeMinutes >= end - 10
					&& newTimeMinutes <= breakStart
				) {
					// closer to one or the other
					if (
						isCloserToA(
							newTime,
							[endHour, endMinutes],
							[breakStartHour, breakStartMinutes],
						)
					) {
						setFieldValue(
							'breakEndHour',
							parseInt((end - 10) / 60, 10),
						);
						setFieldValue('breakEndMinutes', (end - 10) % 60);
					}
					else {
						setFieldValue('breakEndHour', breakStartHour);
						setFieldValue('breakEndMinutes', breakStartMinutes);
					}
				}
				else {
					setFieldValue('breakEndHour', newBreakEndHour);
					setFieldValue('breakEndMinutes', newBreakEndMinutes);
				}
			}
			else {
				// [breakStart, end[
				const cap = Math.min(
					Math.max(
						newBreakEndHour * 60 + newBreakEndMinutes,
						breakStart,
					),
					end - 10,
				);

				setFieldValue('breakEndHour', parseInt(cap / 60, 10));
				setFieldValue('breakEndMinutes', cap % 60);
			}
		}
	};

	return (
		<TimeInputContainer
			onMouseMove={(e) => {
				if (trackingState === null) return;

				const newTime = convertMousePosToTime({x: e.clientX});

				moveCurrentTo(newTime);
			}}
			onTouchMove={(e) => {
				if (trackingState === null) return;

				const [touch] = e.changedTouches;
				const newTime = convertMousePosToTime({x: touch.pageX});

				moveCurrentTo(newTime);
			}}
			style={style}
		>
			<TimeInputRange ref={inputRange}>
				{endPercentage < startPercentage
				&& breakStartPercentage < startPercentage ? (
						<>
							<RangeDecoration start={0} end={breakStartPercentage} />
							<RangeDecoration start={startPercentage} end={100} />
						</>
					) : (
						<RangeDecoration
							start={startPercentage}
							end={breakStartPercentage}
						/>
					)}
				{endPercentage < startPercentage
				&& breakEndPercentage > endPercentage ? (
						<>
							<RangeDecoration start={0} end={endPercentage} />
							<RangeDecoration start={breakEndPercentage} end={100} />
						</>
					) : (
						<RangeDecoration
							start={breakEndPercentage}
							end={endPercentage}
						/>
					)}
				<TimeDisplay percentage={startPercentage}>
					{startHour}h{startMinutes.toString().padStart(2, '0')}
				</TimeDisplay>
				<TimeDisplay percentage={endPercentage}>
					{endHour}h{endMinutes.toString().padStart(2, '0')}
				</TimeDisplay>
				<TimeDisplay percentage={breakStartPercentage}>
					{breakStartHour}h
					{breakStartMinutes.toString().padStart(2, '0')}
				</TimeDisplay>
				<TimeDisplay percentage={breakEndPercentage}>
					{breakEndHour}h{breakEndMinutes.toString().padStart(2, '0')}
				</TimeDisplay>
				<TimeInput
					percentage={startPercentage}
					onMouseDown={track(trackingEnum.START, true)}
					onMouseUp={track(trackingEnum.START, false)}
					onTouchStart={track(trackingEnum.START, true)}
					onTouchEnd={track(trackingEnum.START, false)}
				/>
				<TimeInput
					percentage={endPercentage}
					onMouseDown={track(trackingEnum.END, true)}
					onMouseUp={track(trackingEnum.END, false)}
					onTouchStart={track(trackingEnum.END, true)}
					onTouchEnd={track(trackingEnum.END, false)}
				/>
				<TimeInput
					percentage={breakStartPercentage}
					onMouseDown={track(trackingEnum.BREAK_START, true)}
					onMouseUp={track(trackingEnum.BREAK_START, false)}
					onTouchStart={track(trackingEnum.BREAK_START, true)}
					onTouchEnd={track(trackingEnum.BREAK_START, false)}
					square
				/>
				<TimeInput
					percentage={breakEndPercentage}
					onMouseDown={track(trackingEnum.BREAK_END, true)}
					onMouseUp={track(trackingEnum.BREAK_END, false)}
					onTouchStart={track(trackingEnum.BREAK_END, true)}
					onTouchEnd={track(trackingEnum.BREAK_END, false)}
					square
				/>
			</TimeInputRange>
		</TimeInputContainer>
	);
}
