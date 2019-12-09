import styled from '@emotion/styled';
import gql from 'graphql-tag';
import moment from 'moment';
import React from 'react';

import fbt from '../../fbt/fbt.macro';
import {useQuery} from '../../utils/apollo-hooks';
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

	const {lifetimePayment, signedUpAt} = data.me;

	if (lifetimePayment) {
		return null;
	}

	const isRecentSignup = moment(signedUpAt).isAfter('2019-12-05');
	const trialEndsAt = moment(signedUpAt)
		.add(isRecentSignup ? 15 : 21, 'days')
		.fromNow();

	return (
		<Headband>
			<fbt project="inyo" desc="trial is ending message">
				La version d'essai s'arrête{' '}
				<fbt:param name="date">{trialEndsAt}</fbt:param>
			</fbt>{' '}
			<Button
				style={{display: 'inline'}}
				onClick={() => {
					window.Stripe('pk_test_sQRzrgMJ5zlrmL6glhP4mKe600LVdPEqRU');

					history.push('/pay-for-inyo');
				}}
			>
				<fbt project="inyo" desc="switch to paid version">
					Passer à la version payante
				</fbt>
			</Button>
		</Headband>
	);
};

export default TrialHeadband;
