import styled from '@emotion/styled';
import gql from 'graphql-tag';
import moment from 'moment';
import React from 'react';
import {useQuery} from 'react-apollo-hooks';

import {
	Button,
	primaryPurple,
	primaryWhite,
} from '../../utils/new/design-system';

const Headband = styled('p')`
	text-align: center;
	background: ${primaryPurple};
	color: ${primaryWhite};
	margin: 0;
	padding: 8px;
`;

const TrialHeadband = ({history}) => {
	const {data, loading, error} = useQuery(
		gql`
			{
				me {
					id
					email
					signedUpAt
					lifetimePayment
				}
			}
		`,
		{suspend: false},
	);

	if (loading || error) return null;

	const {
		lifetimePayment, signedUpAt, id, email,
	} = data.me;

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
			La version d'essai s'arrête{' '}
			{moment(signedUpAt)
				.add(21, 'days')
				.fromNow()}{' '}
			<Button
				style={{display: 'inline'}}
				onClick={() => {
					const stripe = window.Stripe(
						'pk_test_sQRzrgMJ5zlrmL6glhP4mKe600LVdPEqRU',
					);

					history.push('/pay-for-inyo');
				}}
			>
				le faire maintenant
			</Button>
		</Headband>
	);
};

export default TrialHeadband;
