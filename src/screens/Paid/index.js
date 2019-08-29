import styled from '@emotion/styled';
import React from 'react';

import fbt from '../../fbt/fbt.macro';
import {FlexColumn, FlexRow} from '../../utils/content';
import Illus from '../../utils/images/bermuda-done.svg';
import {ButtonLink, P} from '../../utils/new/design-system';

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

function Paid({user}) {
	if (user && user.me) {
		return (
			<Container>
				<FlexRow>
					<IllusForPaying src={Illus} />
					<Column>
						<fbt project="inyo" desc="thanks connected">
							<P>Merci pour votre confiance et bienvenue…!</P>
							<ButtonLink to="app/dashboard">
								Retourner au dashboard
							</ButtonLink>
						</fbt>
					</Column>
				</FlexRow>
			</Container>
		);
	}

	return (
		<Container>
			<FlexRow>
				<IllusForPaying src={Illus} />
				<Column>
					<fbt project="inyo" desc="thanks not connected">
						<P>
							Merci pour votre achat. Pour utiliser Inyo vous
							devez vous connecter.
						</P>
						<ButtonLink to="auth/sign-in">Se connecter</ButtonLink>
					</fbt>
				</Column>
			</FlexRow>
		</Container>
	);
}

export default Paid;
