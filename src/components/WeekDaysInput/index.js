import React from 'react';
import styled from '@emotion/styled';

import {primaryBlue, primaryWhite} from '../../utils/content';
import {BREAKPOINTS} from '../../utils/constants';

const DayInputContainer = styled('div')`
	display: flex;
	flex-flow: row nowrap;
	justify-content: space-between;
	margin: 20px 0 20px 14px;
	font-size: 0.85rem;

	@media (max-width: ${BREAKPOINTS}px) {
		font-size: 0.6rem;
		margin: 20px 0;
	}
`;

const DayInput = styled('div')`
	cursor: pointer;
	background: ${props => (props.active ? primaryBlue : 'transparent')};
	color: ${props => (props.active ? primaryWhite : primaryBlue)};
	border-radius: 50%;
	width: 3.5rem;
	height: 3.5rem;
	display: flex;
	justify-content: center;
	align-items: center;
	border: solid 1px ${primaryBlue};

	@media (max-width: ${BREAKPOINTS}px) {
		width: 2.5rem;
		height: 2.5rem;
	}
`;

const workingDaysNames = [
	{
		label: 'lun.',
		value: 'MONDAY',
	},
	{
		label: 'mar.',
		value: 'TUESDAY',
	},
	{
		label: 'mer.',
		value: 'WEDNESDAY',
	},
	{
		label: 'jeu.',
		value: 'THURSDAY',
	},
	{
		label: 'ven.',
		value: 'FRIDAY',
	},
	{
		label: 'sam.',
		value: 'SATURDAY',
	},
	{
		label: 'dim.',
		value: 'SUNDAY',
	},
];

function selectDay(values, value, setFieldValue) {
	return () => {
		const index = values.findIndex(item => value === item);

		if (index === -1) {
			values.push(value);
		}
		else {
			values.splice(index, 1);
		}

		setFieldValue('workingDays', values);
	};
}

export default function WeekDaysInput({values, setFieldValue}) {
	return (
		<DayInputContainer>
			{workingDaysNames.map(({value, label}) => (
				<DayInput
					key={value}
					active={values.includes(value)}
					onClick={selectDay(values, value, setFieldValue)}
				>
					{label}
				</DayInput>
			))}
		</DayInputContainer>
	);
}
