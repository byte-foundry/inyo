import React from 'react';

import {STRIPE_CONSTANT} from '../../utils/constants';

const {stripeKey, ...stripeInfos} = STRIPE_CONSTANT;

function StraightToCheckout({location}) {
	const stripe = window.Stripe(stripeKey);
	const queryString = new URLSearchParams(location.search);

	stripe
		.redirectToCheckout({
			...stripeInfos,
			customerEmail: queryString.get('email'),
			clientReferenceId: queryString.get('id'),
			billingAddressCollection: 'required',
		})
		.then((result) => {
			if (result.error) {
				throw result.error;
			}
		});
	return false;
}

export default StraightToCheckout;
