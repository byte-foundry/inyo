import styled from '@emotion/styled';
import AlgoliaPlaces from 'algolia-places-react';
import React, {Component} from 'react';

import fbt from '../../fbt/fbt.macro';
import {ErrorInput} from '../../utils/content';
import {InputLabel, Label} from '../../utils/new/design-system';

// TODO : Algo has been sunsetted. Mapbox is a good candidate for replacement.

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
			language = 'fr',
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
						language,
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
						&& `${values.street} ${values.postalCode} ${values.city} ${values.country}`
					}
				/>
				{touched[name] && (errors[name] || errors[`${name}.street`]) && (
					<ErrorInput className="input-feedback">
						{/* Yup does not provide a way to reduce errors to a parent object
						so errors is always errors on street city, postalCode and country not on address */}
						{errors && (errors[name] || errors[`${name}.street`]) && (
							<fbt project="inyo" desc="Required">
								Requis
							</fbt>
						)}
					</ErrorInput>
				)}
			</AddressAutocompleteMain>
		);
	}
}

export default AddressAutocomplete;
