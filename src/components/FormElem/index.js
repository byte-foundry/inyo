import React, {Component} from 'react';
import styled, {css} from 'react-emotion';

import FormInput from '../FormInput';

import {P, Label, ErrorInput} from '../../utils/content';

const FormElemMain = styled(P)`
	width: 100%;
	margin: ${props => (props.padded ? '17px 10px 25.5px 10px' : '17px 0 25.5px 0')};
	${props => props.inline
		&& css`
			margin: 0;
		`};
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
		} = this.props;

		return (
			<FormElemMain padded={padded} inline={inline}>
				{this.props.label && (
					<Label htmlFor={name} required={required}>
						{label}
					</Label>
				)}
				<FormInput
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
				{errors[name]
					&& touched[name] && (
					<ErrorInput className="input-feedback">
						{errors[name]}
					</ErrorInput>
				)}
			</FormElemMain>
		);
	}
}

export default FormElem;
