import React, {useCallback} from 'react';
import styled from '@emotion/styled';
import {useQuery} from 'react-apollo-hooks';

import Illus from '../../utils/images/bermuda-done.svg';
import {Button, P, primaryGrey} from '../../utils/new/design-system';
import {FlexRow, FlexColumn, Loading} from '../../utils/content';
import {STRIPE_CONSTANT, BREAKPOINTS} from '../../utils/constants';
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

function EndOfTrial() {
	const {data, loading, error} = useQuery(GET_USER_PAYMENT_INFOS, {
		fetchPolicy: 'no-cache',
	});

	const stripeCheckout = useCallback(() => {
		const stripe = window.Stripe(stripeKey);

		stripe
			.redirectToCheckout({
				...stripeInfos,
				customerEmail: data.me && data.me.email,
				clientReferenceId: data.me && data.me.id,
			})
			.then((result) => {
				if (result.error) {
				}
			});
	}, [data.me]);

	if (loading) return <Loading />;
	if (error) throw error;

	return (
		<Container>
			<FlewRowMobile>
				<IllusForPaying src={Illus} />
				<Column>
					<P>Votre période d'essai de 21 jours est terminée !</P>
					<P>
						Pour vos clients rien ne change : ils peuvent toujours
						accéder aux projets, commenter, valider, etc.
					</P>
					<P>
						Pour profiter à nouveau d'Inyo et effectuer des actions
						sur vos projets en cours, merci de souscrire à l'un de
						nos plans payants.
					</P>
					<FlewRowMobile>
						<Button onClick={stripeCheckout} link>
							S'abonner pour 8€ /mois
						</Button>
						<Separator>ou</Separator>
						<Button onClick={stripeCheckout} link>
							60€ /an (2 mois offerts)
						</Button>
					</FlewRowMobile>
					<P>
						<Button onClick={stripeCheckout} big primary>
							Acheter un accès à vie pour 99€ !
						</Button>
					</P>
				</Column>
			</FlewRowMobile>
		</Container>
	);
}

export default EndOfTrial;
