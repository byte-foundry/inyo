import styled from '@emotion/styled';
import React, {useCallback} from 'react';
import {useApolloClient, useQuery} from 'react-apollo-hooks';

import fbt from '../../fbt/fbt.macro';
import {BREAKPOINTS, PLAN_NAMES, STRIPE_CONSTANT} from '../../utils/constants';
import {FlexColumn, FlexRow, Loading} from '../../utils/content';
import Illus from '../../utils/images/bermuda-done.svg';
import {Button, P, primaryGrey} from '../../utils/new/design-system';
import {GET_USER_PAYMENT_INFOS} from '../../utils/queries';

const {stripeKey, ...stripeInfos} = STRIPE_CONSTANT;

const Container = styled('div')`
	display: flex;
	justify-content: center;
	align-items: center;
	width: 100%;
	height: 800px;

	@media (max-width: ${BREAKPOINTS}px) {
		padding: 1rem;
		align-items: initial;
		width: auto;
		height: auto;
	}
`;

const FlewRowMobile = styled(FlexRow)`
	@media (max-width: ${BREAKPOINTS}px) {
		flex-direction: column;
	}
`;

const IllusForPaying = styled('img')`
	height: 330px;

	@media (max-width: ${BREAKPOINTS}px) {
		height: 30vh;
	}
`;

const Separator = styled('span')`
	color: ${primaryGrey};
	padding: 1rem;

	@media (max-width: ${BREAKPOINTS}px) {
		padding: 10px;
		margin: 0 auto;
	}
`;

const Column = styled(FlexColumn)`
	width: 400px;
	margin-left: 2rem;
	justify-content: center;

	@media (max-width: ${BREAKPOINTS}px) {
		width: auto;
		margin-left: 0;
	}
`;

const createStripeCheckout = (me, planName) => () => {
	const stripe = window.Stripe(stripeKey);

	stripe
		.redirectToCheckout({
			...stripeInfos,
			items: [stripeInfos.items[planName]],
			customerEmail: me && me.email,
			clientReferenceId: me && me.id,
			billingAddressCollection: 'required',
		})
		.then((result) => {
			if (result.error) {
			}
		});
};

function EndOfTrial() {
	const {data, loading, error} = useQuery(GET_USER_PAYMENT_INFOS, {
		fetchPolicy: 'no-cache',
	});

	const client = useApolloClient();

	const lifeStripeCheckout = useCallback(
		createStripeCheckout(data && data.me, PLAN_NAMES.LIFE),
		[data],
	);
	const monthlyStripeCheckout = useCallback(
		createStripeCheckout(data && data.me, PLAN_NAMES.MONTHLY),
		[data],
	);
	const yearlyStripeCheckout = useCallback(
		createStripeCheckout(data && data.me, PLAN_NAMES.YEARLY),
		[data],
	);

	if (loading) return <Loading />;
	if (error) throw error;

	return (
		<Container>
			<FlewRowMobile>
				<IllusForPaying src={Illus} />
				<Column>
					<fbt project="inyo" desc="notification message">
						<P>
							Bonjour{' '}
							<fbt:param name="email">
								{data.me ? data.me.email : ''}
							</fbt:param>
							,
						</P>
						<P>Votre période d'essai va bientôt se terminer</P>
						<P>Vous pouvez vous abonner dès maintenant à Inyo.</P>
						<FlewRowMobile>
							<Button onClick={monthlyStripeCheckout} link>
								S'abonner pour 12$ /mois
							</Button>
							<Separator>ou</Separator>
							<Button onClick={yearlyStripeCheckout} link>
								96$ /an (4 mois offerts)
							</Button>
							{/* <Button onClick={lifeStripeCheckout} link>
								Choisir l'offre spéciale de lancement et profité
								d'Inyo a vie pour 75$
							</Button> */}
						</FlewRowMobile>
						{/* <P>
							<Button onClick={lifeStripeCheckout} big primary>
								Acheter un accès à vie pour 99€ !
							</Button>
						</P> */}
						<P>
							<Button
								onClick={() => {
									window.localStorage.removeItem('authToken');
									client.resetStore();
								}}
								link
							>
								Si ce n'est pas vous, cliquez ici pour vous
								déconnecter.
							</Button>
						</P>
					</fbt>
				</Column>
			</FlewRowMobile>
		</Container>
	);
}

export default EndOfTrial;
