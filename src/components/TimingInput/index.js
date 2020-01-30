import styled from '@emotion/styled/macro';
import React from 'react';

import fbt from '../../fbt/fbt.macro';
import {BREAKPOINTS} from '../../utils/constants';
import {Select} from '../../utils/new/design-system';

const Container = styled('div')`
	@media (min-width: ${BREAKPOINTS.mobile}px) {
		display: flex;
		flex: 1;
		align-items: center;
	}
`;

const TimingInput = ({
	unit,
	value,
	isRelative,
	setValue,
	setUnit,
	setIsRelative,
	relativeDisabled,
}) => {
	const durationOptions = {
		minutes: new Array(60 / 5 - 1).fill(0).map((_, i) => ({
			label: (i + 1) * 5,
			value: (i + 1) * 5,
		})),
		hours: new Array(24 - 1).fill(0).map((_, i) => ({
			label: i + 1,
			value: i + 1,
		})),
		days: new Array(7 - 1).fill(0).map((_, i) => ({
			label: i + 1,
			value: i + 1,
		})),
		weeks: new Array(12 - 1).fill(0).map((_, i) => ({
			label: i + 1,
			value: i + 1,
		})),
	};

	const unitOptions = [
		{
			label: (
				<fbt project="inyo" desc="minutes">
					minutes
				</fbt>
			),
			value: 'minutes',
		},
		{
			label: (
				<fbt project="inyo" desc="hours">
					heures
				</fbt>
			),
			value: 'hours',
		},
		{
			label: (
				<fbt project="inyo" desc="days">
					jours
				</fbt>
			),
			value: 'days',
		},
		{
			label: (
				<fbt project="inyo" desc="weeks">
					semaines
				</fbt>
			),
			value: 'weeks',
		},
	];

	return (
		<Container>
			<Select
				key={unit}
				name="value"
				value={{label: value, value}}
				options={durationOptions[unit]}
				onChange={({value}) => setValue(value)}
				isSearchable={false}
				style={{
					container: styles => ({
						...styles,
						flex: 1,
						margin: '5px 0 5px 5px',
					}),
				}}
			/>
			<Select
				name="unit"
				options={unitOptions}
				onChange={({value}) => {
					setUnit(value);
					setValue(durationOptions[value][0].value);
				}}
				isSearchable={false}
				value={unitOptions.find(
					option => option.value === (unit || 'days'),
				)}
				style={{
					container: styles => ({
						...styles,
						flex: 1,
						margin: '5px 0 5px 5px',
					}),
				}}
			/>
			<span style={{marginLeft: '5px'}}>
				<fbt desc="after">après</fbt>
			</span>
			<Select
				name="from"
				isDisabled={relativeDisabled}
				options={[
					{
						label: (
							<fbt project="inyo" desc="after task activation">
								l'activation de la tâche
							</fbt>
						),
						value: false,
					},
					{
						label: (
							<fbt project="inyo" desc="after previous email">
								l'email précédent
							</fbt>
						),
						value: true,
					},
				]}
				onChange={({value}) => {
					setValue(durationOptions.days[0].value);
					setUnit('days');
					setIsRelative(value);
				}}
				isSearchable={false}
				value={
					!relativeDisabled && isRelative
						? {
							label: (
								<fbt
									project="inyo"
									desc="after previous email"
								>
										l'email précédent
								</fbt>
							),
							value: true,
						  }
						: {
							label: (
								<fbt
									project="inyo"
									desc="after task activation"
								>
										l'activation de la tâche
								</fbt>
							),
							value: false,
						  }
				}
				style={{
					container: styles => ({
						...styles,
						flex: 3,
						margin: '5px 0 5px 5px',
					}),
				}}
			/>
		</Container>
	);
};

TimingInput.defaultProps = {
	unit: 'days',
	isRelative: false,
	setValue: () => {},
	setUnit: () => {},
	setIsRelative: () => {},
	relativeDisabled: false,
};

export default TimingInput;
