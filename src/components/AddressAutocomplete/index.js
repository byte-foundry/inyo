import React, {Component} from 'react';
import AlgoliaPlaces from 'algolia-places-react';
import styled from '@emotion/styled';

import {P, Label, ErrorInput} from '../../utils/content';

const AddressAutocompleteMain = styled(P)`
	width: fill-available;
	margin: ${props => (props.padded ? '17px 10px 25.5px 10px' : '17px 0 25.5px 0')};
`;

class AddressAutocomplete extends Component {
	render() {
		const {
			onChange,
			name,
			placeholder,
			values,
			label,
			padded,
			required,
			errors,
			touched,
		} = this.props;

		return (
			<AddressAutocompleteMain padded={padded}>
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
				{errors[name]
					&& touched[name] && (
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
