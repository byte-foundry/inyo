import React, {useRef, useState} from 'react';
import styled from '@emotion/styled';

import EmailExample from '../EmailExample';

import {
	ModalContainer,
	ModalElem,
	ErrorInput,
	ModalActions,
} from '../../utils/content';
import {SubHeading, Button, P} from '../../utils/new/design-system';

const Header = styled(SubHeading)`
	margin-bottom: 2rem;
`;

const ContentForCopy = styled('textarea')`
	width: 1px;
	height: 1px;
	margin: 0;
	padding: 0;
	opacity: 0;
	white-space: pre-line;
`;

const CustomerIntroMail = ({onDismiss}) => {
	const contentRef = useRef();
	const [isCopied, setIsCopied] = useState(false);

	return (
		<ModalContainer size="small" onDismiss={onDismiss}>
			<ModalElem>
				<Header>Présentation d'Inyo à votre client</Header>
				<P>texte qui explique le pourquoi de l'email</P>
				<EmailExample
					subject="J'utilise inyo pour gérer votre projet"
					email="email@customer.com"
					userEmail="email@user.com"
				>
					<P>Bonjour [Nom de votre client],</P>
					<P>
						Je vais utiliser Inyo, mon assistant virtuel, pour
						communiquer avec vous lors de *la [création de votre
						logo -* renseigner le type de projet].
					</P>
					<P>
						Vous allez prochainement recevoir des emails provenant
						d'Edwige Inyo. Ne les placez pas en spam, ils vont vous
						tenir informé de l'avancement de mon travail.{' '}
					</P>
					<P>
						Vos recevrez tous les soirs un bilan des tâches que j'ai
						réalisées pour vous dans la journée. Vous serez
						également notifié lorsque je commenterai une tâche et
						lorsque je vous demanderai une validation ou un
						document.
					</P>
					<P>
						Ces emails contiendront un lien personnalisé vous
						permettant d'accéder au projet, vous n'aurez pas à créer
						de compte. Vous pourrez ajouter des commentaires,
						valider des tâches et déposer ou récupérer des documents
						(maquettes, textes etc..).
					</P>
					<P>
						Toutes les informations relatives au projet seront
						disponibles en permanence sur cet espace. Cela ne vous
						demandera aucun travail supplémentaire et nous permettra
						d'être plus efficace dans notre collaboration.
					</P>
					<P>
						Je reste à votre disposition si vous avez des questions.
					</P>
					<P>[Votre signature]</P>
				</EmailExample>
				<ContentForCopy
					ref={contentRef}
					value={`Bonjour [Nom de votre client],

Je vais utiliser Inyo, mon assistant virtuel, pour communiquer avec vous lors de *la [création de votre logo -* renseigner le type de projet].

Vous allez prochainement recevoir des emails provenant d'Edwige Inyo. Ne les placez pas en spam, ils vont vous tenir informé de l'avancement de mon travail.

Vos recevrez tous les soirs un bilan des tâches que j'ai réalisées pour vous dans la journée. Vous serez également notifié lorsque je commenterai une tâche et lorsque je vous demanderai une validation ou un document.

Ces emails contiendront un lien personnalisé vous permettant d'accéder au projet, vous n'aurez pas à créer de compte. Vous pourrez  ajouter des commentaires, valider des tâches et déposer ou récupérer des documents (maquettes, textes etc..).

Toutes les informations relatives au projet seront disponibles en permanence sur cet espace. Cela ne vous demandera aucun travail supplémentaire et nous permettra d'être plus efficace dans notre collaboration.

Je reste à votre disposition si vous avez des questions.

[Votre signature]`}
				/>
				<ModalActions>
					<Button
						primary
						onClick={() => {
							if (!isCopied) {
								contentRef.current.select();
								document.execCommand('copy');
								setIsCopied(true);
								setTimeout(() => setIsCopied(false), 1500);
							}
						}}
					>
						{isCopied ? 'Email copié!' : "Copier l'email"}
					</Button>
					<Button onClick={onDismiss}>Fermer</Button>
				</ModalActions>
			</ModalElem>
		</ModalContainer>
	);
};

export default CustomerIntroMail;
