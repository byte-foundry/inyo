import React, {Component} from 'react';
import styled from 'react-emotion';

import FormInput from '../FormInput';

import {P, Label, ErrorInput} from '../../utils/content';

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
		} = this.props;

		return (
			<P>
				<Label htmlFor={name} required={required}>
					{label}
				</Label>
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
					<ErrorInput className="input-feedback">
						{errors[name]}
					</ErrorInput>
				)}
			</P>
		);
	}
}

export default FormElem;
