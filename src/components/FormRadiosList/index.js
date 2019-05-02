import React from 'react';
import {Field} from 'formik';
import styled from '@emotion/styled/macro';

import {
	InputLabel,
	Label,
	primaryPurple,
	primaryWhite,
	mediumPurple,
} from '../../utils/new/design-system';

const FormRadiosMain = styled(InputLabel)``;

const LabelActionnable = styled(Label)`
	cursor: pointer;

	&:hover {
		color: ${primaryPurple};
	}
`;

const Checkmark = styled('div')`
	position: absolute;
	top: 0;
	left: 0;
	height: 11px;
	width: 11px;
	background-color: ${primaryWhite};
	border: 1px solid ${primaryPurple};
	border-radius: 50%;
	pointer-events: none;

	&:after {
		content: '';
		position: absolute;
		display: none;

		top: 2px;
		left: 2px;
		width: 7px;
		height: 7px;
		border-radius: 50%;
		background: ${primaryPurple};
	}
`;

const RadioInput = styled('input')`
	margin-right: 0.5em;

	position: absolute;
	opacity: 0;
	cursor: pointer;
	height: 0;
	width: 0;
	left: 0;

	&:checked ~ ${Checkmark}:after {
		display: block;
	}
`;

const RadioElem = styled('div')`
	margin: 0.5rem 0;

	display: block;
	position: relative;
	padding-left: 1.2rem;
  line-height: 1;
	font-size: .8rem;
	user-select: none;

	&:hover {
		${RadioInput} ~ ${Checkmark} {
			height: 9px;
		  width: 9px;
		  background-color: ${primaryWhite};
			border: 2px solid ${primaryPurple};

			&:after {
				top: 1px;
			  left: 1px;
			}
		}
		${RadioInput}:checked ~ ${Checkmark}:after {
		  display: block;
		}
	}
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
			<LabelActionnable>
				{label}
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
				<Checkmark />
			</LabelActionnable>
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
			{options.map(option => (
				<Field
					component={RadioButton}
					name={name}
					id={option.id}
					error={errors[name] && touched[name]}
					label={option.label}
				/>
			))}
			{label && (
				<Label htmlFor={name} required={required}>
					{label}
				</Label>
			)}
		</FormRadiosMain>
	);
}

export default FormRadiosList;
