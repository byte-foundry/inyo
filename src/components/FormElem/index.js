import React, {Component} from 'react';
import styled from '@emotion/styled';
import {css} from '@emotion/core';

import FormInput from '../FormInput';

import {Label, ErrorInput} from '../../utils/content';

const FormElemMain = styled('div')`
	width: 100%;
	margin: ${props => (props.padded ? '17px 10px 25.5px 10px' : '17px 0 25.5px 0')};
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

class FormElem extends Component {
	render() {
		const {
			name,
			label,
			placeholder,
			type,
			values,
			handleChange,
			handleBlur,
			errors,
			touched,
			required,
			padded,
			inline,
			onboarding,
		} = this.props;

		return (
			<FormElemMain
				padded={padded}
				inline={inline}
				onboarding={onboarding}
			>
				{this.props.label && (
					<Label htmlFor={name} required={required}>
						{label}
					</Label>
				)}
				<FormInput
					name={name}
					placeholder={placeholder}
					type={type}
					values={values}
					handleChange={handleChange}
					handleBlur={handleBlur}
					errors={errors}
					touched={touched}
					inline={inline}
				/>
				{errors[name]
					&& touched[name] && (
					<ErrorInput className="input-feedback">
						{errors[name]}
					</ErrorInput>
				)}
			</FormElemMain>
		);
	}
}

export default FormElem;
