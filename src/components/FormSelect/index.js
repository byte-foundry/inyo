import React, {Component} from 'react';
import styled from '@emotion/styled';
import Select from 'react-select';
import {Field} from 'formik';

import {InputLabel, Label, primaryPurple} from '../../utils/new/design-system';

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
		color: '#888',
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
	}),
	control: styles => ({
		...styles,
		minHeight: 'auto',
		border: 'none',
		backgroundColor: '#f5f2fe',
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
							onChange={(selected) => {
								form.setFieldValue(
									name,
									selected && selected.value,
								);
							}}
							onBlur={handleBlur}
							name={name}
							value={options.find(
								option => option.value === values[name],
							)}
							error={errors[name] && touched[name]}
							options={options}
							styles={customSelectStyles}
							{...rest}
						/>
					)}
				</Field>
			</FormSelectMain>
		);
	}
}

export default FormSelect;
