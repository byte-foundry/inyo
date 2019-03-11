import React, {Component} from 'react';
import {
	Link, Switch, Route, Redirect,
} from 'react-router-dom';
import styled from '@emotion/styled';

import {
	P, primaryNavyBlue, primaryBlue, H1,
} from '../../utils/content';

import LoginForm from '../../components/LoginForm';
import SignUpForm from '../../components/SignupForm';
import SendResetPasswordForm from '../../components/SendResetPasswordForm';
import ResetPasswordForm from '../../components/ResetPasswordForm';

import {ReactComponent as AppLogo} from '../../utils/icons/appLogo.svg';
import AuthIllus from './illustration-inyo.gif';

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
	padding: 40px 40px 40px;
	background-image: url(${AuthIllus});
	background-repeat: no-repeat;
	background-size: cover;
	background-position: center bottom;
`;

const AuthTextContent = styled('div')`
	max-width: 700px;
	margin-left: auto;
	margin-right: auto;
`;
const TextTitle = styled(H1)`
	color: ${primaryBlue};
	font-size: 32px;
`;
const TextContent = styled(P)`
	color: ${primaryNavyBlue};
	font-size: 20px;
`;

function Auth() {
	return (
		<AuthMain>
			<AuthForm>
				<AppLogo />
				<Switch>
					<Route exact path="/auth/sign-up" component={SignUpForm} />
					<Route exact path="/auth/sign-in" component={LoginForm} />
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
								<Link to="/auth/sign-up">Créer un compte</Link>
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
						répétitives et réévaluez vos projets en direct avec vos
						clients. Avec Inyo vous gagnez du temps en vous
						concentrant sur votre vrai métier et votre travail est
						payé à sa juste valeur.
					</TextContent>
				</AuthTextContent>
			</AuthText>
		</AuthMain>
	);
}

export default Auth;
