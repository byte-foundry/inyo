import React from 'react';
import styled from '@emotion/styled';

import Illus from '../../utils/images/bermuda-done.svg';
import {Button, P} from '../../utils/new/design-system';
import {FlexRow, FlexColumn} from '../../utils/content';
import {STRIPE_CONSTANT} from '../../utils/constants';

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
	return (
		<Container>
			<FlexRow>
				<IllusForPaying src={Illus} />
				<Column>
					<P>Votre période d'essai de 21 jours est terminée!</P>
					<P>
						Pour vos clients rien ne change: ils peuvent toujours
						accéder aux projets, commenter, valider, etc.
					</P>
					<P>
						Pour profiter a nouveau d'Inyo et effectuer des actions
						sur vos projets en cours, merci de souscrire a un plan
						payant.
					</P>
					<Button
						onClick={() => {
							const stripe = window.Stripe(stripeKey);

							stripe
								.redirectToCheckout({
									...stripeInfos,
									customerEmail: 'francois.poizat@gmail.com',
									clientReferenceId:
										'cjs1r01mh052a0794q3ah2o97',
								})
								.then((result) => {
									if (result.error) {
										console.log('zboub');
									}
								});
						}}
						big
						primary
						centered
					>
						Continuer a utiliser Inyo!
					</Button>
				</Column>
			</FlexRow>
		</Container>
	);
}

export default EndOfTrial;
