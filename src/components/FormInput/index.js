import React, {Component} from 'react';
import styled from 'react-emotion';

const Input = styled('input')``;

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
				className={
					errors[name] && touched[name]
						? 'text-input error'
						: 'text-input'
				}
			/>
		);
	}
}

export default FormInput;
