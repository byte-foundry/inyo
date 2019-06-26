import React, {useCallback} from 'react';
import styled from '@emotion/styled';
import {useQuery} from 'react-apollo-hooks';

import Illus from '../../utils/images/bermuda-done.svg';
import {Button, P} from '../../utils/new/design-system';
import {FlexRow, FlexColumn, Loading} from '../../utils/content';
import {STRIPE_CONSTANT} from '../../utils/constants';
import {GET_USER_PAYMENT_INFOS} from '../../utils/queries';

const {stripeKey, ...stripeInfos} = STRIPE_CONSTANT;

const Container = styled('div')`
	display: flex;
	justify-content: center;
	align-items: center;
	width: 100%;
	height: 800px;
`;

const IllusForPaying = styled('img')`
	height: 330px;
`;

const Column = styled(FlexColumn)`
	width: 400px;
	margin-left: 2rem;
	justify-content: center;
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
			<FlexRow>
				<IllusForPaying src={Illus} />
				<Column>
					<P>Votre période d'essai de 21 jours est terminée!</P>
					<P>
						Pour vos clients rien ne change : ils peuvent toujours
						accéder aux projets, commenter, valider, etc.
					</P>
					<P>
						Pour profiter à nouveau d'Inyo et effectuer des actions
						sur vos projets en cours, merci de souscrire à un plan
						payant.
					</P>
					<Button onClick={stripeCheckout} big primary centered>
						Continuer à utiliser Inyo !
					</Button>
				</Column>
			</FlexRow>
		</Container>
	);
}

export default EndOfTrial;
