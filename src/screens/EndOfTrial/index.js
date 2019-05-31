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
	justify-content: space-between;
`;

function EndOfTrial() {
	return (
		<Container>
			<FlexRow>
				<IllusForPaying src={Illus} />
				<Column>
					<P>Votre période d'essai est arrivé a sa fin.</P>
					<P>
						Nous espérons que vous avez passé 3 bonnes semaines en
						compagnie de votre assistant personnel
					</P>
					<P>
						Pour profiter d'inyo à vie un paiement unique est
						nécessaire.
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
