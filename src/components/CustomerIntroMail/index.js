import styled from '@emotion/styled';
import React, {useRef, useState} from 'react';
import {useQuery} from 'react-apollo-hooks';

import fbt from '../../fbt/fbt.macro';
import {TITLE_ENUM_TO_TITLE} from '../../utils/constants';
import {
	Loading,
	ModalActions,
	ModalContainer,
	ModalElem,
} from '../../utils/content';
import {
	Button, lightGrey, P, SubHeading,
} from '../../utils/new/design-system';
import {GET_USER_INFOS} from '../../utils/queries';
import Apostrophe from '../Apostrophe';
import EmailExample from '../EmailExample';

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
	let stringValue = s;

	if (typeof s !== 'string' && s && s.props.content[0]) stringValue = s.props.content[0];

	return stringValue.charAt(0).toUpperCase() + stringValue.slice(1);
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
	const {data, loading} = useQuery(GET_USER_INFOS);

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
		me: {
			email,
			settings: {assistantName},
		},
	} = data;

	return (
		<ModalContainer onDismiss={onDismiss}>
			<ModalElem>
				<Header>
					<fbt
						project="inyo"
						desc="inyo customer presentation header"
					>
						Présentation d'Inyo à votre client
					</fbt>
				</Header>
				<Info>
					<fbt project="inyo" desc="info inyo customer presentation">
						Vous venez de créer un client ! Voici un email prérédigé
						qui vous permettra de lui présenter inyo.
					</fbt>
				</Info>
				<EmailExample
					subject={
						<>
							<fbt
								project="inyo"
								desc="beginning of subject of customer info mail"
							>
								Nous allons utiliser Inyo pour le suivi du
								projet{' '}
								<ReplaceableText>
									[nom du projet]
								</ReplaceableText>
							</fbt>
						</>
					}
					email={customer.email}
					userEmail={email}
				>
					<P>
						<fbt project="inyo" desc="hello">
							Bonjour{' '}
							<fbt:param name="customer name">
								{`${nullStr(getCiv(customer.title))} ${nullStr(
									customer.firstName,
								)} ${nullStr(customer.lastName)}`.trim()}
							</fbt:param>
							,
						</fbt>
					</P>
					<P>
						<fbt project="inyo" desc="first part of email">
							Je vais utiliser Inyo, un outil de gestion de projet
							360, pour communiquer avec vous pendant le projet{' '}
							<ReplaceableText>[nom du projet]</ReplaceableText>
						</fbt>
						<br />
						<fbt project="inyo" desc="first part of email">
							Vous allez prochainement recevoir des emails
							provenant{' '}
							<fbt:param name="apos">
								{
									<Apostrophe
										value={assistantName}
										withVowel={
											<fbt
												project="inyo"
												desc="notification message"
											>
												d'
											</fbt>
										}
										withConsonant={
											<fbt
												project="inyo"
												desc="notification message"
											>
												de{' '}
											</fbt>
										}
									/>
								}
							</fbt:param>
							<fbt:param name="assistantName">
								{assistantName}
							</fbt:param>{' '}
							Inyo. Ne les placez pas en spam, ils vont vous tenir
							informé de l'avancement de votre projet.
						</fbt>
						<br />
						<fbt project="inyo" desc="first part of email">
							Afin d'avoir un aperçu en temps réel des avancées de
							ce projet, vous recevrez régulièrement des résumés
							des tâches réalisées, des notifications lorsque
							j'aurais des questions ou lorsqu'une action de votre
							part est nécessaire.
						</fbt>
					</P>
					<P>
						<fbt project="inyo" desc="first part of email">
							Ces emails contiendront un lien personnalisé vous
							permettant d'accéder directement au projet. Vous
							pourrez ajouter des commentaires, valider des tâches
							et déposer ou récupérer des documents.
						</fbt>
					</P>
					<P>
						<fbt project="inyo" desc="first part of email">
							Merci de privilégier cette plateforme pour nos
							échanges, cela nous permettra d'être plus efficaces
							en centralisant nos échanges et la documentation.
						</fbt>
					</P>
					<P>
						<fbt project="inyo" desc="first part of email">
							Je reste à votre disposition si vous avez des
							questions.
						</fbt>
					</P>
					<P>
						<fbt project="inyo" desc="first part of email">
							<ReplaceableText>[Votre signature]</ReplaceableText>
						</fbt>
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
						{isCopied ? (
							<fbt project="inyo" desc="email copied">
								Email copié!
							</fbt>
						) : (
							<fbt project="inyo" desc="copy email">
								Copier l'email
							</fbt>
						)}
					</Button>
					<Button onClick={onDismiss}>
						<fbt project="inyo" desc="close">
							Fermer
						</fbt>
					</Button>
				</ModalActions>
			</ModalElem>
		</ModalContainer>
	);
};

export default CustomerIntroMail;
