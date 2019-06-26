import React from 'react';
import moment from 'moment';
import styled from '@emotion/styled';
import {useQuery} from 'react-apollo-hooks';
import gql from 'graphql-tag';

import {
	primaryPurple,
	primaryWhite,
	Button,
} from '../../utils/new/design-system';

const Headband = styled('p')`
	text-align: center;
	background: ${primaryPurple};
	color: ${primaryWhite};
	margin: 0;
	padding: 8px;
`;

const TrialHeadband = () => {
	const {data, loading, error} = useQuery(
		gql`
			{
				me {
					id
					signedUpAt
					lifetimePayment
				}
			}
		`,
		{suspend: false},
	);

	if (loading || error) return null;

	const {lifetimePayment, signedUpAt} = data.me;

	if (
		lifetimePayment
		|| !moment().isBetween(
			moment(signedUpAt).add(10, 'days'),
			moment(signedUpAt).add(21, 'days'),
		)
	) {
		return null;
	}

	return (
		<Headband>
			Tu dois payer{' '}
			{moment(signedUpAt)
				.add(21, 'days')
				.fromNow()}{' '}
			<Button
				style={{display: 'inline'}}
				onClick={() => {
					const stripe = window.Stripe(
						'pk_test_sQRzrgMJ5zlrmL6glhP4mKe600LVdPEqRU',
					);

					stripe
						.redirectToCheckout({
							items: [
								{
									sku: 'sku_F9hrygxAJQuSLp',
									quantity: 1,
								},
							],
							successUrl: 'https://dev.inyo.me/paid',
							cancelUrl: 'https://dev.inyo.me/canceled',
							customerEmail: 'francois.poizat@gmail.com',
							clientReferenceId: 'cjs1r01mh052a0794q3ah2o97',
						})
						.then((result) => {
							if (result.error) {
								console.log('zboub');
							}
						});
				}}
			>
				le faire maintenant
			</Button>
		</Headband>
	);
};

export default TrialHeadband;
