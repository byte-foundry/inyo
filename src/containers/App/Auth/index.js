import React, {Component} from 'react';
import {
	Link, Switch, Route, Redirect,
} from 'react-router-dom';
import styled from 'react-emotion';

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

import {ReactComponent as AppLogo} from '../appLogo.svg';
import AuthLogo from './authLogo.svg';

const AuthMain = styled('div')`
	display: flex;
	flex-direction: row;
	min-height: 100vh;
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
`;
const AuthText = styled('div')`
	display: flex;
	flex-direction: column;
	justify-content: top;
	min-height: fill-content;
	width: 60%;
	background: ${primaryNavyBlue};
	color: ${primaryWhite};
	padding-left: 5%;
	padding-right: 5%;
	padding-top: 5%;
`;

const AuthTextContent = styled('div')`
	max-width: 700px;
	margin-left: auto;
	margin-right: auto;
`;
const TextTitle = styled(H1)`
	color: ${primaryBlue};
`;
const TextContent = styled(P)`
	color: ${primaryWhite};
	font-size: 24px;
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
						<img src={AuthLogo} alt="auth logo" />
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
