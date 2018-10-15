import React, {Component} from 'react';
import AlgoliaPlaces from 'algolia-places-react';
import styled from 'react-emotion';

import {P} from '../../utils/content';

const Label = styled('label')`
	display: block;
`;

class AddressAutocomplete extends Component {
	render() {
		const {
			onChange, name, placeholder, values, label,
		} = this.props;

		return (
			<P>
				<Label htmlFor={name}>{label}</Label>
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
						console.log(suggestion);
						this.props.onChange(name, {
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
					onClear={() => this.props.onChange(name, {})}
					onLimit={({message}) => console.err(message)}
					onError={({message}) => console.err(message)}
					value={values[name]}
				/>
			</P>
		);
	}
}

export default AddressAutocomplete;
