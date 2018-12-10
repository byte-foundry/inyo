import React, {Component} from 'react';
import styled, {css} from 'react-emotion';
import {Field} from 'formik';
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

function FormInputShell({field, form: {touched, errors}, ...props}) {
	return (
		<div>
			<FormInputMain {...field} {...props} />
		</div>
	);
}

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
			<Field
				component={FormInputShell}
				id={name}
				placeholder={placeholder}
				type={type}
				name={name}
				onChange={handleChange}
				onBlur={handleBlur}
				error={errors[name] && touched[name]}
				inline={inline}
			/>
		);
	}
}

export default FormInput;
