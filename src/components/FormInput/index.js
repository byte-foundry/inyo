import {css} from '@emotion/core';
import styled from '@emotion/styled';
import {Field} from 'formik';
import React from 'react';

import {getDeep} from '../../utils/functions';
import {Input, primaryWhite} from '../../utils/new/design-system';

const FormInputMain = styled(Input)`
	display: block;
	width: 100%;
	box-sizing: border-box;
	${props => props.big && 'height: 40px;'}

	${props => props.inline
		&& css`
			background: ${primaryWhite};
			padding: 0;
			width: auto;
			text-align: center;
		`};
`;

const FormInput = ({
	name,
	handleChange,
	handleBlur,
	errors,
	touched,
	...rest
}) => (
	<Field
		id={name}
		name={name}
		onChange={handleChange}
		onBlur={handleBlur}
		error={getDeep(name, errors) && getDeep(name, touched)}
		{...rest}
	>
		{({field, form: {isSubmitting}}) => (
			<FormInputMain
				{...field}
				disabled={isSubmitting}
				{...rest}
				error={getDeep(name, errors) && getDeep(name, touched)}
			/>
		)}
	</Field>
);

export default FormInput;
