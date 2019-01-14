import React, {Component} from 'react';
import styled from '@emotion/styled';
import {css} from '@emotion/core';
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

function FormInputShell({field, ...props}) {
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
