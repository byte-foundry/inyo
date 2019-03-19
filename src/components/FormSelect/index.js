import React, {Component} from 'react';
import styled from '@emotion/styled';
import Select from 'react-select';
import {Field} from 'formik';

import {
	InputLabel,
	Label,
	primaryPurple,
	lightPurple,
} from '../../utils/new/design-system';
import {getDeep} from '../../utils/functions';
import {ErrorInput} from '../../utils/content';

const FormSelectMain = styled(InputLabel)``;

const customSelectStyles = {
	dropdownIndicator: styles => ({
		...styles,
		color: primaryPurple,
		paddingTop: 0,
		paddingBottom: 0,
	}),
	clearIndicator: styles => ({
		...styles,
		color: primaryPurple,
		paddingTop: 0,
		paddingBottom: 0,
	}),
	placeholder: styles => ({
		...styles,
		color: lightPurple,
		fontStyle: 'italic',
		fontSize: '14px',
	}),
	singleValue: styles => ({
		...styles,
		color: primaryPurple,
	}),
	input: styles => ({
		...styles,
		padding: 0,
		color: primaryPurple,
	}),
	control: styles => ({
		...styles,
		minHeight: 'auto',
		border: 'none',
		backgroundColor: lightPurple,
		borderRadius: '20px',
		':hover, :focus, :active': {
			border: 'none',
		},
	}),
	indicatorSeparator: () => ({
		backgroundColor: 'transparent',
	}),
};

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
							styles={customSelectStyles}
							noOptionsMessage={() => 'Aucune option'}
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
