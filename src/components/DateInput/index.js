import React, {useState} from 'react';
import {DayPickerSingleDateController} from 'react-dates';
import moment from 'moment';
import styled from '@emotion/styled/macro';

import {primaryGrey, primaryPurple} from '../../utils/new/design-system';
import {BREAKPOINTS} from '../../utils/constants';

import Plural from '../Plural';

const TaskDateInput = styled('div')`
	position: absolute;
	display: flex;
	${props => (props.position === 'left'
		? 'right: calc(100% + 5px);'
		: 'left: calc(100% + 5px);')}
	top: 0px;
	z-index: 1;

	.CalendarDay__selected,
	.CalendarDay__selected:active,
	.CalendarDay__selected:hover {
		background-color: ${primaryPurple};
		border-color: ${primaryPurple};
	}
	.DayPickerKeyboardShortcuts_show__bottomRight {
		display: none;
	}

	@media (max-width: ${BREAKPOINTS}px) {
		left: 0;
	}
`;

const MarginMessage = styled('div')`
	color: ${primaryGrey};
	margin: 20px;
	font-style: italic;
`;

class InyoDayPickerSingleDateController extends DayPickerSingleDateController {
	onDayMouseEnter(day) {
		super.onDayMouseEnter(day);

		this.props.onDayMouseEnter && this.props.onDayMouseEnter(day);
	}

	onDayMouseLeave(day) {
		super.onDayMouseLeave(day);

		this.props.onDayMouseLeave && this.props.onDayMouseLeave(day);
	}
}

export default function ({
	innerRef,
	duration,
	noInfo,
	startDate = moment(),
	position,
	...rest
}) {
	const [focused, setFocused] = useState(false);
	const [currentDate, setCurrentDate] = useState(rest.date);

	const margin = currentDate.diff(moment(), 'days') - duration;
	const displayInfo = !noInfo && typeof duration === 'number';

	return (
		<TaskDateInput ref={innerRef} position={position}>
			<InyoDayPickerSingleDateController
				focused={focused}
				onFocusChange={setFocused}
				onDayMouseEnter={(day) => {
					if (!day.isBefore(moment())) {
						setCurrentDate(day);
					}
				}}
				isDayBlocked={day => day.isBefore(startDate)}
				renderCalendarInfo={() => displayInfo && (
					<MarginMessage>
							Cela vous laisse {margin}{' '}
						<Plural
							value={margin}
							singular="jour"
							plural="jours"
						/>{' '}
							pour commencer cette tâche
					</MarginMessage>
				)
				}
				{...rest}
			/>
		</TaskDateInput>
	);
}
