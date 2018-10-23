import React, {Component} from 'react';
import styled from 'react-emotion';
import {Input} from '../../utils/content';

class FormInput extends Component {
	render() {
		const {
			name,
			placeholder,
			type,
			values,
			handleChange,
			handleBlur,
			errors,
			touched,
		} = this.props;

		return (
			<Input
				id={name}
				placeholder={placeholder}
				type={type}
				value={values[name]}
				onChange={handleChange}
				onBlur={handleBlur}
				error={errors[name] && touched[name]}
			/>
		);
	}
}

export default FormInput;
