import 'react-toastify/dist/ReactToastify.css';

import {css} from '@emotion/core';
import styled from '@emotion/styled';
import React, {useEffect, useRef, useState} from 'react';
import {withRouter} from 'react-router-dom';
import {toast, ToastContainer} from 'react-toastify';

import LinkedCalendarForm from '../../../components/LinkedCalendarForm';
import SettingsForm from '../../../components/SettingsForm';
import UserAssistantForm from '../../../components/UserAssistantForm';
import UserCompanyForm from '../../../components/UserCompanyForm';
import UserDataForm from '../../../components/UserDataForm';
import fbt from '../../../fbt/fbt.macro';
import {useQuery} from '../../../utils/apollo-hooks';
import {BREAKPOINTS} from '../../../utils/constants';
import {Button, H3} from '../../../utils/content';
import logoutIllus from '../../../utils/images/bermuda-logged-out.svg';
import {
	accentGrey,
	gray20,
	gray50,
	Heading,
	primaryPurple,
	primaryWhite,
	signalRed,
} from '../../../utils/new/design-system';
import {GET_USER_INFOS} from '../../../utils/queries';

const Container = styled('div')`
	/* max-width: 980px;
	margin: 0 auto;
	min-height: 100vh;

	@media (max-width: ${BREAKPOINTS}px) {
		max-width: 100%;
	} */
`;

const AccountBody = styled('div')`
	padding-left: 40px;
	padding-right: 40px;

	@media (max-width: ${BREAKPOINTS}px) {
		padding: 1rem;
	}
`;

const Profile = styled('div')`
	display: flex;
	align-items: flex-start;

	@media (max-width: ${BREAKPOINTS}px) {
		flex-direction: column;
	}
`;

const ProfileSide = styled('nav')`
	margin-top: 80px;
	margin-right: 80px;
	position: sticky;
	top: 20px;

	@media (max-width: ${BREAKPOINTS}px) {
		display: none;
	}
`;

const ProfileSideLinks = styled('ul')`
	margin: 0;
	padding: 0;
`;

const ProfileSideElem = styled('li')`
	list-style-type: none;
	margin-bottom: 24px;
	text-transform: uppercase;
	color: ${gray50};
	border-left: 3px solid transparent;
	padding-left: 10px;
	cursor: pointer;
	transition: border-color 0.3s ease, color 0.3s ease;
	${props => props.active
		&& css`
			border-color: ${primaryPurple};
			color: ${primaryPurple};
		`};
`;
const ProfileSideLink = styled('a')`
	text-decoration: none;
	color: inherit;
`;

const ProfileMain = styled('div')`
	max-width: 900px;
	margin-right: auto;
	flex-grow: 2;

	@media (max-width: ${BREAKPOINTS}px) {
		width: 100%;
	}
`;

const ProfileSection = styled('div')`
	background: ${primaryWhite};
	padding: 60px 40px;
	border: 1px solid ${gray20};
	display: flex;
	align-items: center;
	flex-direction: row-reverse;

	@media (max-width: ${BREAKPOINTS}px) {
		flex-direction: column;
		padding: 0;
		border: none;
	}
`;

const LogoutButton = styled(Button)`
	padding: 10px 5px;
	font-size: 15px;
	margin-bottom: 10px;
	color: ${accentGrey};
	flex: 1 1 50%;
`;

const UnsubscribeButton = styled('a')`
	padding: 10px 5px;
	font-size: 15px;
	margin-bottom: 10px;
	color: ${signalRed};
	flex: 1 1 50%;
`;

const ProfileTitle = styled(H3)`
	font-size: 1.5rem;

	@media (max-width: ${BREAKPOINTS}px) {
		font-size: 1.2rem;
		margin: 3rem 0 2.5rem 0.8rem;
	}
`;

const Illus = styled('img')`
	flex: 1 1 50%;
	height: 250px;
`;

const Footer = styled('div')`
	text-align: center;
	margin: 10px;
`;

const Account = ({location}) => {
	const [intercomLoaded, setIntercomLoaded] = useState(false);
	const [activeItem, setActiveItem] = useState('me');
	const refsContainer = useRef([]);
	const refs = refsContainer.current;
	const {data} = useQuery(GET_USER_INFOS, {
		suspend: true,
	});

	useEffect(() => {
		const hash = location.hash.slice(1);

		if (hash && refs[hash]) {
			refs[hash].scrollIntoView({
				block: 'start',
				behavior: 'smooth',
			});
			setActiveItem(refs[hash]);
		}

		window.Intercom('onUnreadCountChange', () => {
			if (!intercomLoaded) setIntercomLoaded(true);
		});
	});

	const createRef = value => (node) => {
		refs[value] = node;
	};

	const handleScroll = (e) => {
		e.preventDefault();

		const hashValue = e.target.hash.slice(1);

		refs[hashValue].scrollIntoView({
			block: 'start',
			behavior: 'smooth',
		});
		setActiveItem(hashValue);
	};

	const displayToast = () => {
		toast.info(
			<p>
				<fbt project="inyo" desc="data updated">
					Les données ont été mises à jour
				</fbt>
			</p>,
			{
				position: toast.POSITION.BOTTOM_LEFT,
				autoClose: 3000,
			},
		);
	};

	const {me} = data;
	const {firstName, company, settings} = me;

	return (
		<Container>
			<ToastContainer />

			<AccountBody>
				<Heading>
					<fbt project="inyo" desc="hello">
						Bonjour{' '}
						<fbt:param name="firstName">{firstName}</fbt:param> !
					</fbt>
				</Heading>

				<Profile>
					<ProfileSide>
						<ProfileSideLinks>
							<ProfileSideElem active={activeItem === 'me'}>
								<ProfileSideLink
									href="#me"
									onClick={handleScroll}
								>
									<fbt project="inyo" desc="You">
										Vous
									</fbt>
								</ProfileSideLink>
							</ProfileSideElem>
							<ProfileSideElem active={activeItem === 'company'}>
								<ProfileSideLink
									href="#company"
									onClick={handleScroll}
								>
									<fbt project="inyo" desc="your company">
										Votre société
									</fbt>
								</ProfileSideLink>
							</ProfileSideElem>
							<ProfileSideElem active={activeItem === 'settings'}>
								<ProfileSideLink
									href="#settings"
									onClick={handleScroll}
								>
									<fbt project="inyo" desc="your options">
										Vos options
									</fbt>
								</ProfileSideLink>
							</ProfileSideElem>
							<ProfileSideElem active={activeItem === 'calendar'}>
								<ProfileSideLink
									href="#calendar"
									onClick={handleScroll}
								>
									<fbt project="inyo" desc="your options">
										Vos Calendrier
									</fbt>
								</ProfileSideLink>
							</ProfileSideElem>
							<ProfileSideElem
								active={activeItem === 'assistant'}
							>
								<ProfileSideLink
									href="#assistant"
									onClick={handleScroll}
								>
									<fbt project="inyo" desc="your assistant">
										Votre assistant·e
									</fbt>
								</ProfileSideLink>
							</ProfileSideElem>
							<ProfileSideElem active={activeItem === 'account'}>
								<ProfileSideLink
									href="#account"
									onClick={handleScroll}
								>
									<fbt project="inyo" desc="your account">
										Votre compte
									</fbt>
								</ProfileSideLink>
							</ProfileSideElem>
						</ProfileSideLinks>
					</ProfileSide>

					<ProfileMain>
						<ProfileTitle id="me" ref={createRef('me')}>
							<fbt project="inyo" desc="you">
								Vous
							</fbt>
						</ProfileTitle>
						<UserDataForm data={me} done={displayToast} />
						<ProfileTitle id="company" ref={createRef('company')}>
							<fbt project="inyo" desc="notification message">
								Votre société
							</fbt>
						</ProfileTitle>
						<UserCompanyForm data={company} done={displayToast} />
						<ProfileTitle id="settings" ref={createRef('settings')}>
							<fbt
								project="inyo"
								desc="your working hours and days"
							>
								Vos horaires et jours de travail
							</fbt>
						</ProfileTitle>
						<SettingsForm data={me} done={displayToast} />
						<ProfileTitle id="calendar" ref={createRef('calendar')}>
							<fbt project="inyo" desc="Your assistant">
								Vos calendriers
							</fbt>
						</ProfileTitle>
						<LinkedCalendarForm />
						<ProfileTitle
							id="assistant"
							ref={createRef('assistant')}
						>
							<fbt project="inyo" desc="Your assistant">
								Votre assistant·e
							</fbt>
						</ProfileTitle>
						<UserAssistantForm
							defaultLanguage={settings.language}
							defaultAssistantName={settings.assistantName}
							done={displayToast}
						/>
						<ProfileTitle id="account" ref={createRef('account')}>
							<fbt project="inyo" desc="your account">
								Votre compte
							</fbt>
						</ProfileTitle>
						<ProfileSection>
							<Illus src={logoutIllus} />
							<UnsubscribeButton
								href={fbt(
									"mailto:contact@inyo.me?subject=Désinscription&body=Bonjour, je souhaiterai me désinscrire d'Inyo.",
									'unregister',
								)}
								onClick={(e) => {
									if (intercomLoaded) {
										e.preventDefault();
										window.Intercom(
											'showNewMessage',
											fbt(
												"Bonjour, je souhaiterai me désinscrire d'Inyo.",
												'unregister intercom',
											),
										);
									}
								}}
							>
								<fbt project="inyo" desc="Delete account">
									Me désinscrire
								</fbt>
							</UnsubscribeButton>
						</ProfileSection>
						<Footer>
							<LogoutButton
								theme="Link"
								size="XSmall"
								type="button"
								onClick={() => {
									window.localStorage.removeItem('authToken');
									// refresh the page to empty store completely
									window.location.href = '/auth/sign-in';
								}}
							>
								<fbt project="inyo" desc="sign out">
									Me déconnecter
								</fbt>
							</LogoutButton>
						</Footer>
					</ProfileMain>
				</Profile>
			</AccountBody>
		</Container>
	);
};

export default withRouter(Account);
