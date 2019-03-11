import React, {Component} from 'react';
import {
	Link, Switch, Route, Redirect,
} from 'react-router-dom';
import styled from '@emotion/styled';

import {
	P,
	primaryNavyBlue,
	primaryBlue,
	primaryWhite,
	H1,
} from '../../../utils/content';

import LoginForm from '../../../components/LoginForm';
import SignUpForm from '../../../components/SignupForm';
import SendResetPasswordForm from '../../../components/SendResetPasswordForm';
import ResetPasswordForm from '../../../components/ResetPasswordForm';

import {ReactComponent as AppLogo} from '../appLogo.svg';
import AuthIllus from './illustration-inyo.gif';

import {BREAKPOINTS} from '../../../utils/constants';

const AuthMain = styled('div')`
	display: flex;
	flex-direction: row;
	min-height: 100vh;

	@media (max-width: ${BREAKPOINTS}px) {
		flex-direction: column;
		min-height: initial;
	}
`;
const AuthForm = styled('div')`
	display: flex;
	flex-direction: column;
	justify-content: space-between;
	min-height: fill-content;
	width: 40%;
	min-width: 200px;
	padding-left: 2%;
	padding-right: 6%;
	padding-top: 2%;
	padding-bottom: 10%;

	@media (max-width: ${BREAKPOINTS}px) {
		width: auto;
		padding: 3rem 3rem 0 3rem;

		svg + div {
			margin-top: 2rem;
		}
	}
`;
const AuthText = styled('div')`
	display: flex;
	flex-direction: column;
	justify-content: top;
	min-height: fill-content;
	width: 60%;
	padding: 40px 40px 40px;
	background-image: url(${AuthIllus});
	background-repeat: no-repeat;
	background-size: cover;
	background-position: center bottom;

	@media (max-width: ${BREAKPOINTS}px) {
		background: none;
		width: auto;
	}
`;

const AuthTextContent = styled('div')`
	max-width: 700px;
	margin-left: auto;
	margin-right: auto;
`;
const TextTitle = styled(H1)`
	color: ${primaryBlue};
	font-size: 2rem;

	@media (max-width: ${BREAKPOINTS}px) {
		font-size: 1rem;
	}
`;
const TextContent = styled(P)`
	color: ${primaryNavyBlue};
	font-size: 1.3rem;

	@media (max-width: ${BREAKPOINTS}px) {
		font-size: 1rem;
	}
`;

class Auth extends Component {
	render() {
		return (
			<AuthMain>
				<AuthForm>
					<AppLogo />
					<Switch>
						<Route
							exact
							path="/auth/sign-up"
							component={SignUpForm}
						/>
						<Route
							exact
							path="/auth/sign-in"
							component={LoginForm}
						/>
						<Route
							path="/auth/forgotten-password"
							component={SendResetPasswordForm}
						/>
						<Route
							path="/auth/reset/:token"
							render={({match}) => (
								<ResetPasswordForm
									resetToken={match.params.token}
								/>
							)}
						/>
						<Redirect to="/auth/sign-up" />
					</Switch>

					<Switch>
						<Route
							exact
							path="/auth/sign-in"
							render={() => (
								<P>
									Vous êtes nouveau ?{' '}
									<Link to="/auth/sign-up">
										Créer un compte
									</Link>
								</P>
							)}
						/>
						<Route
							exact
							path="/auth/sign-up"
							render={() => (
								<P>
									Vous avez déjà un compte ?{' '}
									<Link to="/auth/sign-in">Se connecter</Link>
								</P>
							)}
						/>
					</Switch>
				</AuthForm>
				<AuthText>
					<AuthTextContent>
						<TextTitle>Créez votre compte gratuitement</TextTitle>
						<TextContent>
							Optimisez votre temps en automatisant des tâches
							répétitives et réévaluez vos projets en direct avec
							vos clients. Avec Inyo vous gagnez du temps en vous
							concentrant sur votre vrai métier et votre travail
							est payé à sa juste valeur.
						</TextContent>
					</AuthTextContent>
				</AuthText>
			</AuthMain>
		);
	}
}

export default Auth;
