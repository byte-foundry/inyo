import React, {Component} from 'react';
import styled from '@emotion/styled';
import {css} from '@emotion/core';
import {Field} from 'formik';

import {Input, primaryWhite} from '../../utils/new/design-system';
import {getDeep} from '../../utils/functions';

const FormInputMain = styled(Input)`
	display: block;
	width: 100%;
	box-sizing: border-box;

	${props => props.inline
		&& css`
			background: ${primaryWhite};
			padding: 0;
			width: auto;
			text-align: center;
		`};
`;

function FormInputShell({field, ...props}) {
	return <FormInputMain {...field} {...props} />;
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
				error={getDeep(name, errors) && getDeep(name, touched)}
				inline={inline}
			/>
		);
	}
}

export default FormInput;
