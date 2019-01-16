import React, {Component} from 'react';
import styled from '@emotion/styled';
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
			onChange,
		} = this.props;

		return (
			<FormCheckboxMain>
				{this.props.label && (
					<Field>
						{({form}) => (
							<Label required={required}>
								<input
									type="checkbox"
									checked={values[name]}
									onBlur={handleBlur}
									onChange={(e) => {
										form.setFieldValue(
											name,
											e.target.checked,
										);
										onChange(e);
									}}
								/>
								<CheckboxLabel>{label}</CheckboxLabel>
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

FormCheckbox.defaultProps = {
	onChange: () => {},
};

export default FormCheckbox;
