import styled from '@emotion/styled';
import React from 'react';
import YouTube from 'react-youtube';

import fbt from '../../fbt/fbt.macro';
import {ModalActions, ModalContainer, ModalElem} from '../../utils/content';
import {Button, Heading, P} from '../../utils/new/design-system';

const PA = styled(P)`
	font-size: 16px;
`;

const IframeYouTube = styled(YouTube)`
	position: absolute;
	width: 100%;
	height: 100%;
`;

const YoutubeContainer = styled('div')`
	position: relative;
	overflow: hidden;
	width: 100%;
	height: 0;
	padding-bottom: 56.25%;
`;

const WelcomeModal = ({onDismiss}) => (
	<ModalContainer onDismiss={onDismiss}>
		<ModalElem>
			<fbt project="inyo" desc="welcome modal content">
				<Heading>Bienvenue sur Inyo,</Heading>
				<PA>
					Découvrez en 1'30 min les options de bases de Inyo et
					commencez dès maintenant à optimiser vos journées!
				</PA>
			</fbt>
			<YoutubeContainer>
				<IframeYouTube videoId="qBJvclaZ-yQ" />
			</YoutubeContainer>
			<ModalActions>
				<Button big primary onClick={onDismiss}>
					<fbt project="inyo" desc="got it">
						J'ai compris!
					</fbt>
				</Button>
			</ModalActions>
		</ModalElem>
	</ModalContainer>
);

export default WelcomeModal;
