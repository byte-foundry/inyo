import React, {Component} from 'react';
import styled, {css} from 'react-emotion';
import {Input, primaryWhite} from '../../utils/content';

const FormInputMain = styled(Input)`
	${props => props.inline
		&& css`
			background: ${primaryWhite};
			padding: 0;
			width: auto;
			text-align: center;
		`};
`;

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
			inline,
		} = this.props;

		return (
			<FormInputMain
				id={name}
				placeholder={placeholder}
				type={type}
				value={values[name]}
				onChange={handleChange}
				onBlur={handleBlur}
				error={errors[name] && touched[name]}
				inline={inline}
			/>
		);
	}
}

export default FormInput;
