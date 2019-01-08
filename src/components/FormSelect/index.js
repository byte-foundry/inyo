import React, {Component} from 'react';
import styled, {css} from 'react-emotion';
import {Field} from 'formik';

import {
	P, Label, ErrorInput, gray50, gray70,
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
	border: 1px solid ${gray70};
	padding: 14px 18px 15px 18px;
	color: ${gray50};
	width: -webkit-fill-available;
	width: -moz-available;
	width: fill-available;
	font-family: 'Ligne';
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
				<Field>
					{({form}) => (
						<FormSelectElem
							onChange={(event) => {
								form.setFieldValue(name, event.target.value);
							}}
							onBlur={handleBlur}
							value={values[name]}
						>
							{options.map(option => (
								<option value={option.value}>
									{option.label}
								</option>
							))}
						</FormSelectElem>
					)}
				</Field>
				{errors[name]
					&& touched[name] && (
					<ErrorInput className="input-feedback">
						{errors[name]}
					</ErrorInput>
				)}
			</FormSelectMain>
		);
	}
}

export default FormSelect;
