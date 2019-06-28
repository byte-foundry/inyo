import styled from '@emotion/styled';
import React, {Component} from 'react';

import {ErrorInput} from '../../utils/content';
import {getDeep} from '../../utils/functions';
import {InputLabel, Label} from '../../utils/new/design-system';
import FormInput from '../FormInput';

const FormElemMain = styled(InputLabel)`
	width: 100%;
	margin-bottom: ${props => (props.noMarginBottom ? '0' : '20px')};
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
			big,
			noMarginBottom,
			...rest
		} = this.props;

		const hasErrors = getDeep(name, errors) && getDeep(name, touched);

		return (
			<FormElemMain
				padded={padded}
				inline={inline}
				onboarding={onboarding}
				required={required}
				noMarginBottom={noMarginBottom || hasErrors}
				{...rest}
			>
				{this.props.label && (
					<Label htmlFor={name} required={required}>
						{label}
					</Label>
				)}
				<FormInput
					big={big}
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
				{hasErrors && (
					<ErrorInput className="input-feedback">
						{getDeep(name, errors)}
					</ErrorInput>
				)}
			</FormElemMain>
		);
	}
}

export default FormElem;
