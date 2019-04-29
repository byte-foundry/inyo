import React, {Component} from 'react';
import styled from '@emotion/styled';
import {Field} from 'formik';

import {InputLabel, Label, Select} from '../../utils/new/design-system';
import {getDeep} from '../../utils/functions';
import {ErrorInput} from '../../utils/content';

const FormSelectMain = styled(InputLabel)``;

class FormSelect extends Component {
	render() {
		const {
			name,
			label,
			handleBlur,
			values,
			errors,
			touched,
			required,
			inline,
			onboarding,
			options,
			css,
			style,
			...rest
		} = this.props;

		return (
			<FormSelectMain
				inline={inline}
				onboarding={onboarding}
				css={css}
				style={style}
				required={required}
			>
				{this.props.label && (
					<Label htmlFor={name} required={required}>
						{label}
					</Label>
				)}
				<Field
					name={name}
					id={name}
					error={errors[name] && touched[name]}
				>
					{({form}) => (
						<Select
							id={name}
							onChange={(selected) => {
								form.setFieldValue(
									name,
									selected && selected.value,
								);
							}}
							onBlur={(...args) => {
								form.setFieldTouched(name);
								handleBlur(...args);
							}}
							name={name}
							value={options.find(
								option => option.value === values[name],
							)}
							error={errors[name] && touched[name]}
							options={options}
							{...rest}
						/>
					)}
				</Field>
				{getDeep(name, errors) && getDeep(name, touched) && (
					<ErrorInput className="input-feedback">
						{getDeep(name, errors)}
					</ErrorInput>
				)}
			</FormSelectMain>
		);
	}
}

export default FormSelect;
