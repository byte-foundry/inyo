import React, {Component} from 'react';
import styled from '@emotion/styled';

import FormInput from '../FormInput';

import {InputLabel, Label} from '../../utils/new/design-system';
import {ErrorInput} from '../../utils/content';
import {getDeep} from '../../utils/functions';

const FormElemMain = styled(InputLabel)`
	width: 100%;
	margin-bottom: 20px;
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
			...rest
		} = this.props;

		return (
			<FormElemMain
				padded={padded}
				inline={inline}
				onboarding={onboarding}
				required={required}
				{...rest}
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
				{getDeep(name, errors) && getDeep(name, touched) && (
					<ErrorInput className="input-feedback">
						{getDeep(name, errors)}
					</ErrorInput>
				)}
			</FormElemMain>
		);
	}
}

export default FormElem;
