import styled from '@emotion/styled';
import React from 'react';
import {
	Link, Redirect, Route, Switch,
} from 'react-router-dom';

import LoginForm from '../../components/LoginForm';
import ResetPasswordForm from '../../components/ResetPasswordForm';
import SendResetPasswordForm from '../../components/SendResetPasswordForm';
import SignUpForm from '../../components/SignupForm';
import {BREAKPOINTS} from '../../utils/constants';
import {
	H1, P, primaryBlue, primaryNavyBlue,
} from '../../utils/content';
import {ReactComponent as AppLogo} from '../../utils/icons/appLogo.svg';
import SuccessIllus from '../../utils/images/bermuda-success.svg';

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
	font-size: 24px;

	@media (max-width: ${BREAKPOINTS}px) {
		font-size: 1rem;
	}
`;
const TextContent = styled(P)`
	color: ${primaryNavyBlue};
	font-size: 18px;

	@media (max-width: ${BREAKPOINTS}px) {
		font-size: 1rem;
	}
`;

const Illus = styled('img')`
	max-width: 60%;
	margin: 0 auto;
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
					<Illus src={SuccessIllus} />
					<TextTitle>
						Partagez avec votre client une liste de tâches
						intelligente.
					</TextTitle>
					<TextContent>
						Déclenchez automatiquement des actions en fonction de
						vos projets. Vous ne perdrez plus de temps à relancer
						vos clients et ceux-ci auront une meilleure
						compréhension de votre travail.
					</TextContent>
				</AuthTextContent>
			</AuthText>
		</AuthMain>
	);
}

export default Auth;
