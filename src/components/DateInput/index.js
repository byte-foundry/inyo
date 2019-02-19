import React, {useState} from 'react';
import {DayPickerSingleDateController} from 'react-dates';
import moment from 'moment';
import styled from '@emotion/styled/macro';

import {primaryGrey} from '../../utils/new/design-system';

import Plural from '../Plural';

const TaskDateInput = styled('div')`
	position: absolute;
	display: flex;
	left: calc(100% + 5px);
	top: 0px;
	z-index: 1;
`;

const MarginMessage = styled('div')`
	color: ${primaryGrey};
	width: 200px;
	margin-left: 15px;
	font-style: italic;
`;

class InyoDayPickerSingleDateController extends DayPickerSingleDateController {
	onDayMouseEnter(day) {
		super.onDayMouseEnter(day);

		this.props.onDayMouseEnter(day);
	}

	onDayMouseLeave(day) {
		super.onDayMouseLeave(day);

		this.props.onDayMouseLeave(day);
	}
}

export default function ({
	innerRef,
	duration,
	noInfo,
	startDate = moment(),
	...rest
}) {
	const [focused, setFocused] = useState(false);
	const [currentDate, setCurrentDate] = useState(rest.date);

	const margin = currentDate.diff(moment(), 'days') - duration;

	return (
		<>
			{rest.date.format('DD/MM/YYYY')}
			<TaskDateInput ref={innerRef}>
				<InyoDayPickerSingleDateController
					focused={focused}
					onFocusChange={setFocused}
					onDayMouseEnter={(day) => {
						if (!day.isBefore(moment())) {
							setCurrentDate(day);
						}
					}}
					isDayBlocked={day => day.isBefore(startDate)}
					{...rest}
				/>
				{!noInfo && (
					<MarginMessage>
						Cela vous laisse {margin}{' '}
						<Plural value={margin} singular="jour" plural="jours" />{' '}
						pour commencer cette tâche
					</MarginMessage>
				)}
			</TaskDateInput>
		</>
	);
}
