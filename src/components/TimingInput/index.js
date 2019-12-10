import React, { useState } from "react";

import { Select } from "../../utils/new/design-system";

const TimingInput = ({
	unit,
	value,
	isRelative,
	setValue,
	setUnit,
	setIsRelative,
	relativeDisabled
}) => {
	const durationOptions = {
		minutes: new Array(60 / 5 - 1).fill(0).map((_, i) => ({
			label: (i + 1) * 5,
			value: (i + 1) * 5
		})),
		hours: new Array(24 - 1).fill(0).map((_, i) => ({
			label: i + 1,
			value: i + 1
		})),
		days: new Array(7 - 1).fill(0).map((_, i) => ({
			label: i + 1,
			value: i + 1
		})),
		weeks: new Array(12 - 1).fill(0).map((_, i) => ({
			label: i + 1,
			value: i + 1
		}))
	};

	const unitOptions = [
		{
			label: (
				<fbt project="inyo" desc="minutes">
					minutes
				</fbt>
			),
			value: "minutes"
		},
		{
			label: (
				<fbt project="inyo" desc="hours">
					heures
				</fbt>
			),
			value: "hours"
		},
		{
			label: (
				<fbt project="inyo" desc="days">
					jours
				</fbt>
			),
			value: "days"
		},
		{
			label: (
				<fbt project="inyo" desc="weeks">
					semaines
				</fbt>
			),
			value: "weeks"
		}
	];

	return (
		<>
			<Select
				key={unit}
				name="value"
				value={{ label: value, value: value }}
				options={durationOptions[unit]}
				onChange={({ value }) => setValue(value)}
				isSearchable={false}
				style={{
					container: styles => ({
						...styles,
						flex: 1,
						margin: "5px 0 5px 5px"
					})
				}}
			/>
			<Select
				name="unit"
				options={unitOptions}
				onChange={({ value }) => {
					setUnit(value);
					setValue(durationOptions[value][0].value);
				}}
				isSearchable={false}
				value={unitOptions.find(
					option => option.value === (unit || "days")
				)}
				style={{
					container: styles => ({
						...styles,
						flex: 1,
						margin: "5px 0 5px 5px"
					})
				}}
			/>
			<span style={{ marginLeft: "5px" }}>après</span>
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
						value: false
					},
					{
						label: (
							<fbt project="inyo" desc="after previous email">
								l'email précédent
							</fbt>
						),
						value: true
					}
				]}
				onChange={({ value }) => {
					setValue(durationOptions[unit][0].value);
					setUnit({
						label: (
							<fbt project="inyo" desc="days">
								jours
							</fbt>
						),
						value: "days"
					});
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
										après l'email précédent
									</fbt>
								),
								value: true
						  }
						: {
								label: (
									<fbt
										project="inyo"
										desc="after task activation"
									>
										après l'activation de la tâche
									</fbt>
								),
								value: false
						  }
				}
				style={{
					container: styles => ({
						...styles,
						flex: 3,
						margin: "5px 0 5px 5px"
					})
				}}
			/>
		</>
	);
};

TimingInput.defaultProps = {
	unit: "days",
	isRelative: false,
	setValue: () => {},
	setUnit: () => {},
	setIsRelative: () => {},
	relativeDisabled: false
};

export default TimingInput;
