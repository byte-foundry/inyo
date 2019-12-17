import styled from '@emotion/styled';
import React from 'react';

import fbt from '../../fbt/fbt.macro';
import {BREAKPOINTS} from '../../utils/constants';
import {primaryBlue, primaryWhite} from '../../utils/content';

const DayInputContainer = styled('div')`
	display: flex;
	flex-flow: row nowrap;
	justify-content: space-between;
	margin: 20px 0 20px 14px;
	font-size: 0.85rem;

	@media (max-width: ${BREAKPOINTS.mobile}px) {
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

	@media (max-width: ${BREAKPOINTS.mobile}px) {
		width: 2.5rem;
		height: 2.5rem;
	}
`;

const workingDaysNames = [
	{
		label: (
			<fbt project="inyo" desc="monday abbrev">
				lun.
			</fbt>
		),
		value: 'MONDAY',
	},
	{
		label: (
			<fbt project="inyo" desc="tuesday abbrev">
				mar.
			</fbt>
		),
		value: 'TUESDAY',
	},
	{
		label: (
			<fbt project="inyo" desc="wesneday abbrev">
				mer.
			</fbt>
		),
		value: 'WEDNESDAY',
	},
	{
		label: (
			<fbt project="inyo" desc="thursday abbrev">
				jeu.
			</fbt>
		),
		value: 'THURSDAY',
	},
	{
		label: (
			<fbt project="inyo" desc="friday abbrev">
				ven.
			</fbt>
		),
		value: 'FRIDAY',
	},
	{
		label: (
			<fbt project="inyo" desc="saturday abbrev">
				sam.
			</fbt>
		),
		value: 'SATURDAY',
	},
	{
		label: (
			<fbt project="inyo" desc="sunday abbrev">
				dim.
			</fbt>
		),
		value: 'SUNDAY',
	},
];

export default function WeekDaysInput({values, setFieldValue}) {
	return (
		<DayInputContainer>
			{workingDaysNames.map(({value, label}) => (
				<DayInput
					key={value}
					active={values.includes(value)}
					onClick={() => {
						const index = values.findIndex(item => value === item);
						const newValues = [...values];

						if (index === -1) {
							newValues.push(value);
						}
						else {
							newValues.splice(index, 1);
						}

						setFieldValue('workingDays', newValues);
					}}
				>
					{label}
				</DayInput>
			))}
		</DayInputContainer>
	);
}
