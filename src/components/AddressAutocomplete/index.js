import React, {Component} from 'react';
import AlgoliaPlaces from 'algolia-places-react';
import styled from '@emotion/styled';

import {InputLabel, Label} from '../../utils/new/design-system';
import {ErrorInput} from '../../utils/content';

const AddressAutocompleteMain = styled(InputLabel)`
	width: 100%;
	margin-bottom: 20px;
`;

class AddressAutocomplete extends Component {
	render() {
		const {
			onChange,
			name,
			placeholder,
			values,
			label,
			required,
			errors,
			touched,
			style,
		} = this.props;

		return (
			<AddressAutocompleteMain style={style} required={required}>
				<Label htmlFor={name} required={required}>
					{label}
				</Label>
				<AlgoliaPlaces
					placeholder={placeholder}
					autoComplete="false"
					options={{
						appId: 'pl1YAVPVE0UO',
						apiKey: 'ca2fe2df77738e8d67dfea649c5ede2e',
						language: 'fr',
						type: 'address',
					}}
					onChange={({suggestion}) => {
						onChange(name, {
							street: suggestion.name,
							city: suggestion.city,
							country: suggestion.country,
							postalCode: suggestion.postcode,
						});
					}}
					onSuggestions={() => {}}
					onCursorChanged={() => {}}
					onClear={() => onChange(name, {})}
					onLimit={({message}) => {
						throw new Error(message);
					}}
					onError={({message}) => {
						throw new Error(message);
					}}
					defaultValue={
						values
						&& values.street
						&& `${values.street} ${values.postalCode} ${values.city} ${
							values.country
						}`
					}
				/>
				{errors[name] && touched[name] && (
					<ErrorInput className="input-feedback">
						{/* Yup does not provide a way to reduce errors to a parent object
						so errors is always errors on street city, postalCode and country not on address */}
						{errors && errors[name] && 'Requis'}
					</ErrorInput>
				)}
			</AddressAutocompleteMain>
		);
	}
}

export default AddressAutocomplete;
