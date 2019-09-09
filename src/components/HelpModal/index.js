import styled from '@emotion/styled';
import React from 'react';

import fbt from '../../fbt/fbt.macro';
import {ModalActions, ModalContainer, ModalElem} from '../../utils/content';
import {
	A, Button, Heading, P, UL,
} from '../../utils/new/design-system';

const PA = styled(P)`
	font-size: 16px;
`;

const HelpModal = ({openWelcomeModal, onDismiss, ...rest}) => (
	<ModalContainer size="small" onDismiss={onDismiss} {...rest}>
		<ModalElem>
			<Heading>
				<fbt project="inyo" desc="Help title">
					Aide
				</fbt>
			</Heading>
			<PA>
				<fbt project="inyo" desc="Help introduction">
					Voici quelques liens pour vous aider à utiliser Inyo.
				</fbt>
			</PA>
			<PA>
				<UL noBullet>
					<li>
						<span aria-labelledby="presentation-link" role="img">
							🎬
						</span>{' '}
						-{' '}
						<A
							as="button"
							id="presentation-link"
							onClick={openWelcomeModal}
						>
							<fbt project="inyo" desc="Video presentation link">
								Voir la vidéo de présentation
							</fbt>
						</A>
					</li>
					<li>
						<span aria-labelledby="new-task-link" role="img">
							✅
						</span>{' '}
						-{' '}
						<A
							id="new-task-link"
							target="_blank"
							href="https://inyo.me/documentation/creer-une-nouvelle-tache/"
						>
							<fbt
								project="inyo"
								desc="create new task help link"
							>
								Créer une nouvelle tâche
							</fbt>
						</A>
					</li>
					<li>
						<span aria-labelledby="new-client-link" role="img">
							🤑
						</span>{' '}
						-{' '}
						<A
							id="new-client-link"
							target="_blank"
							href="https://inyo.me/documentation/liste-de-mes-clients/"
						>
							<fbt
								project="inyo"
								desc="create new client help link"
							>
								Créer un nouveau client
							</fbt>
						</A>
					</li>
					<li>
						<span aria-labelledby="new-project-link" role="img">
							🗂️
						</span>{' '}
						-{' '}
						<A
							id="new-project-link"
							target="_blank"
							href="https://inyo.me/documentation/creer-un-nouveau-projet/"
						>
							<fbt
								project="inyo"
								desc="create new project help link"
							>
								Créer un nouveau projet
							</fbt>
						</A>
					</li>
					<li>
						<span aria-labelledby="use-template-link" role="img">
							📝
						</span>{' '}
						-{' '}
						<A
							id="use-template-link"
							target="_blank"
							href="https://inyo.me/documentation/creer-un-nouveau-projet/utiliser-un-modele-predefini/"
						>
							<fbt
								project="inyo"
								desc="Use a project template help link"
							>
								Utiliser un modèle de projet
							</fbt>
						</A>
					</li>
					<li>
						<span aria-labelledby="client-view-link" role="img">
							🕵️
						</span>{' '}
						-{' '}
						<A
							id="client-view-link"
							target="_blank"
							href="https://inyo.me/documentation/les-principales-vues/vue-du-client-d-un-projet/"
						>
							<fbt
								project="inyo"
								desc="see customer view help link"
							>
								Voir ce que voit le client
							</fbt>
						</A>
					</li>
					<li>
						<span
							aria-labelledby="client-presentation-link"
							role="img"
						>
							🌀
						</span>{' '}
						-{' '}
						<A
							id="client-presentation-link"
							target="_blank"
							href={fbt('https://inyo.pro', 'inyo pro link')}
						>
							<fbt
								project="inyo"
								desc="introduce inyo to a customer help link"
							>
								Présenter Inyo à votre client
							</fbt>
						</A>
					</li>
				</UL>
			</PA>
			<PA>
				<fbt project="inyo" desc="missing information help link">
					Une information est manquante? Contactez-nous via la
					messagerie en bas à droite, ou proposez des fonctionnalités
					sur{' '}
					<A
						target="_blank"
						href="https://inyo.me/produit/fonctionnalites/proposer-une-fonctionnalite/"
					>
						notre roadmap collaborative.
					</A>
				</fbt>
			</PA>
			<ModalActions>
				<Button big primary onClick={onDismiss}>
					<fbt project="inyo" desc="I got it link help modal">
						J'ai compris!
					</fbt>
				</Button>
			</ModalActions>
		</ModalElem>
	</ModalContainer>
);

export default HelpModal;
