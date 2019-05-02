import React, {useRef, useState} from 'react';
import {useQuery} from 'react-apollo-hooks';
import styled from '@emotion/styled';

import EmailExample from '../EmailExample';
import Apostrophe from '../Apostrophe';

import {TITLE_ENUM_TO_TITLE} from '../../utils/constants';
import {
	ModalContainer,
	ModalElem,
	ErrorInput,
	ModalActions,
	Loading,
} from '../../utils/content';
import {
	SubHeading, Button, P, lightGrey,
} from '../../utils/new/design-system';
import {GET_USER_INFOS} from '../../utils/queries';

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

const ReplaceableText = styled('span')`
	background: yellow;
`;

const Info = styled(P)`
	padding: 1rem;
	background: ${lightGrey};
`;

function cap(s) {
	return s.charAt(0).toUpperCase() + s.slice(1);
}

function nullStr(s) {
	return s ? cap(s) : '';
}

function getCiv(s) {
	return TITLE_ENUM_TO_TITLE[s];
}

const CustomerIntroMail = ({onDismiss, customer}) => {
	const contentRef = useRef();
	const [isCopied, setIsCopied] = useState(false);
	const {
		data: {me},
		loading,
	} = useQuery(GET_USER_INFOS);

	if (loading) {
		return (
			<ModalContainer onDismiss={onDismiss}>
				<ModalElem>
					<Loading />
				</ModalElem>
			</ModalContainer>
		);
	}

	const {
		email,
		settings: {assistantName},
	} = me;

	return (
		<ModalContainer onDismiss={onDismiss}>
			<ModalElem>
				<Header>Présentation d'Inyo à votre client</Header>
				<Info>
					Vous venez de créer un client ! Voici un email prérédigé qui
					vous permettra de lui présenter inyo.
				</Info>
				<EmailExample
					subject={
						<>
							Nous allons utiliser Inyo pour le suivi du projet{' '}
							<ReplaceableText>[nom du projet]</ReplaceableText>
						</>
					}
					email={customer.email}
					userEmail={email}
				>
					<P>
						Bonjour{' '}
						{`${nullStr(getCiv(customer.title))} ${nullStr(
							customer.firstName,
						)} ${nullStr(customer.lastName)}`.trim()}
						,
					</P>
					<P>
						Je vais utiliser Inyo, un outil de gestion de projet
						360, pour communiquer avec vous pendant le projet{' '}
						<ReplaceableText>[nom du projet]</ReplaceableText>
						<br />
						Vous allez prochainement recevoir des emails provenant{' '}
						<Apostrophe
							value={assistantName}
							withVowel="d'"
							withConsonant="de "
						/>
						{assistantName} Inyo. Ne les placez pas en spam, ils
						vont vous tenir informé de l'avancement de votre projet.
						<br />
						Afin d'avoir un aperçu en temps réel des avancées de ce
						projet, vous recevrez régulièrement des résumés des
						tâches réalisées, des notifications lorsque j'aurais des
						questions ou lorsqu'une action de votre part est
						nécessaire.
					</P>
					<P>
						Ces emails contiendront un lien personnalisé vous
						permettant d'accéder directement au projet. Vous pourrez
						ajouter des commentaires, valider des tâches et déposer
						ou récupérer des documents.
					</P>
					<P>
						Merci de privilégier cette plateforme pour nos échanges,
						cela nous permettra d'être plus efficaces en
						centralisant nos échanges et la documentation.
					</P>
					<P>
						Je reste à votre disposition si vous avez des questions.
					</P>
					<P>
						<ReplaceableText>[Votre signature]</ReplaceableText>
					</P>
				</EmailExample>
				<ContentForCopy
					ref={contentRef}
					value={`Bonjour ${`${nullStr(
						getCiv(customer.title),
					)} ${nullStr(customer.firstName)} ${nullStr(
						customer.lastName,
					)}`.trim()},

Je vais utiliser Inyo, un outil de gestion de projet 360, pour communiquer avec vous pendant le projet **[nom du projet]**
Vous allez prochainement recevoir des emails provenant ${Apostrophe({
			value: assistantName,
			withVowel: "d'",
			withConsonant: 'de ',
		})}${assistantName} Inyo. Ne les placez pas en spam, ils vont vous tenir informé de l'avancement de votre projet.
Afin d'avoir un aperçu en temps réel des avancées de ce projet, vous recevrez régulièrement des résumés des tâches réalisées, des notifications lorsque j'aurais des questions ou lorsqu'une action de votre part est nécessaire.

Ces emails contiendront un lien personnalisé vous permettant d'accéder directement au projet. Vous pourrez  ajouter des commentaires, valider des tâches et déposer ou récupérer des documents.

Merci de privilégier cette plateforme pour nos échanges, cela nous permettra d'être plus efficaces en centralisant nos échanges et la documentation.

Je reste à votre disposition si vous avez des questions.`}
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
