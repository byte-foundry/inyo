import React, {Component} from 'react';
import AlgoliaPlaces from 'algolia-places-react';
import styled from 'react-emotion';

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
					options={{
						appId: 'pl1YAVPVE0UO',
						apiKey: 'ca2fe2df77738e8d67dfea649c5ede2e',
						language: 'fr',
						type: 'address',
					}}
					onChange={({
						query,
						rawAnswer,
						suggestion,
						suggestionIndex,
					}) => {
						console.log('onChange');
						onChange(name, {
							street: suggestion.name,
							city: suggestion.city,
							country: suggestion.country,
							postalCode: suggestion.postcode,
						});
					}}
					onSuggestions={({rawAnswer, query, suggestions}) => {}}
					onCursorChanged={({
						rawAnswer,
						query,
						suggestion,
						suggestonIndex,
					}) => {}}
					onClear={() => onChange(name, {})}
					onLimit={({message}) => console.err(message)}
					onError={({message}) => console.err(message)}
					value={values[name]}
				/>
				{errors[name]
					&& touched[name] && (
					<ErrorInput className="input-feedback">
						{errors[name]}
					</ErrorInput>
				)}
			</AddressAutocompleteMain>
		);
	}
}

export default AddressAutocomplete;
