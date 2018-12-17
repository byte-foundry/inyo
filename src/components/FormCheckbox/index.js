import React, {Component} from 'react';
import styled from 'react-emotion';
import {Field} from 'formik';

import {FlexRow, Label, ErrorInput} from '../../utils/content';

const FormCheckboxMain = styled(FlexRow)``;
const CheckboxLabel = styled('span')`
	margin-left: 10px;
`;

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
		} = this.props;

		return (
			<FormCheckboxMain>
				{this.props.label && (
					<Field>
						{({form}) => (
							<Label htmlFor={name} required={required}>
								<input
									type="checkbox"
									checked={values[name]}
									onBlur={handleBlur}
									onChange={() => form.setFieldValue(name, !values[name])
									}
								/>
								<CheckboxLabel
									onClick={() => form.setFieldValue(name, !values[name])
									}
								>
									{label}
								</CheckboxLabel>
							</Label>
						)}
					</Field>
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
