import styled from '@emotion/styled';
// import AlgoliaPlaces from 'algolia-places-react';
import {AddressAutofill} from '@mapbox/search-js-react';
import React, {Component} from 'react';

import fbt from '../../fbt/fbt.macro';
import {ErrorInput} from '../../utils/content';
import {Input, InputLabel, Label} from '../../utils/new/design-system';

const AddressAutocompleteMain = styled(InputLabel)`
	width: 100%;
	margin-bottom: 20px;
`;

const AddressAutofillContent = styled('div')`
	display: flex;
	flex-direction: column;
`;

const accessToken
	= 'pk.eyJ1IjoieW1hdGhleSIsImEiOiJjbDRpbTU4d2kwODBiM2JxbnF5OHQ2eDgwIn0.0-0DtXFnP568R-cVccqNfw';
let autofill = '';

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
			<AddressAutocompleteMain required={required} style={style}>
				<AddressAutofill
					accessToken={accessToken}
					placeholder={placeholder}
					autoComplete="false"
					options={{
						language,
						country: 'FR',
					}}
					onRetrieve={(result) => {
						autofill = result.features[0].properties.full_address;
						document.getElementsByName(
							'address',
						)[0].value = autofill; // Dirty but does the job
						onChange(name, {
							street: result.features[0].properties.feature_name,
							city: result.features[0].properties.address_level2,
							country: result.features[0].properties.country,
							postalCode: result.features[0].properties.postcode,
						});
					}}
				>
					<AddressAutofillContent>
						<Label htmlFor={name} required={required}>
							{label}
						</Label>
						<Input
							type="text"
							name="address"
							defaultValue={
								values
								&& values.street
								&& `${values.street} ${values.postalCode} ${values.city} ${values.country}`
							}
						/>
					</AddressAutofillContent>
				</AddressAutofill>
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
