import React from 'react';
import styled from 'react-emotion';

export default function AddressDisplay(props) {
	const {
		street, postalCode, city, country,
	} = props.address;

	return (
		<div>
			<p>{street}</p>
			<p>{`${postalCode}, ${city}`}</p>
			<p>{country}</p>
		</div>
	);
}
