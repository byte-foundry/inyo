import React from 'react';
import {Field} from 'formik';
import styled from '@emotion/styled';

import {InputLabel, Label} from '../../utils/new/design-system';

const FormRadiosMain = styled(InputLabel)``;

const RadioElem = styled('div')`
	margin: 0.5rem 0;
`;

const RadioInput = styled('input')`
	margin-right: 0.5em;
`;

function RadioButton({
	field: {
		name, value, onChange, onBlur,
	},
	id,
	label,
	className,
	...props
}) {
	return (
		<RadioElem>
			<RadioInput
				type="radio"
				name={name}
				id={id}
				value={id}
				checked={id === value}
				onChange={onChange}
				onBlur={onBlur}
				{...props}
			/>
			<label>{label}</label>
		</RadioElem>
	);
}

function FormRadiosList({
	name,
	label,
	handleBlur,
	values,
	errors,
	touched,
	required,
	inline,
	options,
	css,
	style,
	onboarding,
	...rest
}) {
	return (
		<FormRadiosMain
			inline={inline}
			onboarding={onboarding}
			css={css}
			style={style}
			required={required}
		>
			{label && (
				<Label htmlFor={name} required={required}>
					{label}
				</Label>
			)}
			{options.map(option => (
				<Field
					component={RadioButton}
					name={name}
					id={option.id}
					error={errors[name] && touched[name]}
					label={option.label}
				/>
			))}
		</FormRadiosMain>
	);
}

export default FormRadiosList;
