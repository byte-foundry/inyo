import React, {useState} from 'react';
import {DayPickerSingleDateController} from 'react-dates';
import moment from 'moment';
import styled from '@emotion/styled/macro';

import {primaryWhite} from '../../utils/new/design-system';

const TaskDateInput = styled('div')`
	position: absolute;
	display: flex;
	left: calc(100% + 5px);
	top: 0px;
	z-index: 1;
`;

export default function ({innerRef, duration, ...rest}) {
	const [focused, setFocused] = useState(false);

	return (
		<>
			{rest.date.format('DD/MM/YYYY')}
			<TaskDateInput ref={innerRef}>
				<DayPickerSingleDateController
					focused={focused}
					onFocusChange={setFocused}
					onDayMouseEnter={(day) => {
						console.log(day);
					}}
					onDayMouseLeave={(day) => {
						console.log(day);
					}}
					{...rest}
				/>
				<div>
					Cela vous laisse{' '}
					{rest.date.diff(moment(), 'days') - duration} pour commencer
				</div>
			</TaskDateInput>
		</>
	);
}
