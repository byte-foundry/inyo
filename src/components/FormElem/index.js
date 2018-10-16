import React, {Component} from 'react';
import styled from 'react-emotion';

import FormInput from '../FormInput';

import {P} from '../../utils/content';

const Label = styled('label')`
	display: block;
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
		} = this.props;

		return (
			<P>
				<Label htmlFor={name}>{label}</Label>
				<FormInput
					name={name}
					placeholder={placeholder}
					type={type}
					values={values}
					handleChange={handleChange}
					handleBlur={handleBlur}
					errors={errors}
					touched={touched}
				/>
				{errors[name]
					&& touched[name] && (
					<div className="input-feedback">{errors[name]}</div>
				)}
			</P>
		);
	}
}

export default FormElem;
