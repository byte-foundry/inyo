import styled from '@emotion/styled';
import React from 'react';
import {withRouter} from 'react-router';

import {ModalActions, ModalContainer, ModalElem} from '../../utils/content';
import {
	A, Button, Heading, P, UL,
} from '../../utils/new/design-system';

const PA = styled(P)`
	font-size: 16px;
`;

const HelpModal = ({history, ...rest}) => (
	<ModalContainer size="small" {...rest}>
		<ModalElem>
			<Heading>Aide</Heading>
			<PA>Voici quelques liens pour vous aider à utiliser Inyo.</PA>
			<PA>
				<UL noBullet>
					<li>
						<span aria-labelledby="presentation-link" role="img">
							🎬
						</span>{' '}
						-{' '}
						<A
							id="presentation-link"
							href=""
							onClick={() => history.push('?openModal=true')}
						>
							Voir la vidéo de présentation
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
							Créer une nouvelle tâche
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
							Créer un nouveau client
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
							Créer un nouveau projet
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
							Utiliser un modèle de projet
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
							Voir ce que voit le client
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
							href="https://inyo.pro"
						>
							Présenter Inyo à votre client
						</A>
					</li>
				</UL>
			</PA>
			<PA>
				Une information est manquante? Contactez-nous via la messagerie
				en bas à droite, ou proposez des fonctionnalités sur{' '}
				<A
					target="_blank"
					href="https://inyo.me/produit/fonctionnalites/proposer-une-fonctionnalite/"
				>
					notre roadmap collaborative.
				</A>
			</PA>
			<ModalActions>
				<Button big primary onClick={() => history.push('/app/tasks')}>
					J'ai compris!
				</Button>
			</ModalActions>
		</ModalElem>
	</ModalContainer>
);

export default withRouter(HelpModal);
