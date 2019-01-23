import React, {Component} from 'react';
import styled from '@emotion/styled';
import {css} from '@emotion/core';
import {Field} from 'formik';

import {
	P,
	Label,
	ErrorInput,
	gray50,
	gray70,
	signalRed,
} from '../../utils/content';

const FormSelectMain = styled(P)`
	flex: 0 100px;
	margin: 17px ${props => (props.padded || props.paddedRight ? '10px' : '0')}
		25.5px ${props => (props.padded || props.paddedLeft ? '10px' : '0')}
		${props => props.inline
			&& css`
				margin: 0;
			`};
	${props => props.onboarding
		&& css`
			margin: 10px 15px 10px 16px;
			width: inherit;
		`};
`;

const FormSelectElem = styled('select')`
	display: block;
	border: 1px solid ${props => (props.error ? signalRed : gray70)};
	padding: 14px 18px 15px 18px;
	color: ${gray50};
	width: -webkit-fill-available;
	width: -moz-available;
	width: fill-available;
	font-family: 'Work Sans';
	font-size: 16px;
	-webkit-transition: background-color 0.2s ease, color 0.2s ease,
		border-color 0.2s ease;
	transition: background-color 0.2s ease, color 0.2s ease,
		border-color 0.2s ease;
`;

class FormSelect extends Component {
	render() {
		const {
			name,
			label,
			handleBlur,
			values,
			errors,
			touched,
			required,
			padded,
			paddedRight,
			paddedLeft,
			inline,
			onboarding,
			options,
		} = this.props;

		return (
			<FormSelectMain
				padded={padded}
				paddedRight={paddedRight}
				paddedLeft={paddedLeft}
				inline={inline}
				onboarding={onboarding}
			>
				{this.props.label && (
					<Label htmlFor={name} required={required}>
						{label}
					</Label>
				)}
				<Field
					name={name}
					id={name}
					error={errors[name] && touched[name]}
				>
					{({form}) => (
						<FormSelectElem
							onChange={(event) => {
								form.setFieldValue(name, event.target.value);
							}}
							onBlur={handleBlur}
							name={name}
							value={values[name]}
							error={errors[name] && touched[name]}
						>
							{options.map(option => (
								<option value={option.value}>
									{option.label}
								</option>
							))}
						</FormSelectElem>
					)}
				</Field>
			</FormSelectMain>
		);
	}
}

export default FormSelect;
