import React, {Component} from 'react';
import styled from 'react-emotion';
import {Field} from 'formik';

import {FlexRow, Label, ErrorInput} from '../../utils/content';

const FormCheckboxMain = styled(FlexRow)``;

class FormCheckbox extends Component {
	render() {
		const {
			name,
			label,
			values,
			handleBlur,
			errors,
			touched,
			required,
			padded,
			inline,
			onboarding,
		} = this.props;

		return (
			<FormCheckboxMain
				padded={padded}
				inline={inline}
				onboarding={onboarding}
			>
				{this.props.label && (
					<Label htmlFor={name} required={required}>
						<Field>
							{({form}) => (
								<input
									type="checkbox"
									checked={values[name]}
									onBlur={handleBlur}
									onChange={() => {
										form.setFieldValue(name, !values[name]);
									}}
								/>
							)}
						</Field>
						{label}
					</Label>
				)}
				{errors[name]
					&& touched[name] && (
					<ErrorInput className="input-feedback">
						{errors[name]}
					</ErrorInput>
				)}
			</FormCheckboxMain>
		);
	}
}

export default FormCheckbox;
