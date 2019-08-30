import styled from '@emotion/styled';
import {Formik} from 'formik';
import React from 'react';
import {withApollo} from 'react-apollo';
import {useMutation} from 'react-apollo-hooks';
import ReactGA from 'react-ga';
import {Link} from 'react-router-dom';
import * as Yup from 'yup';

import fbt from '../../fbt/fbt.macro';
import {ErrorInput} from '../../utils/content';
import {LOGIN} from '../../utils/mutations';
import {Button} from '../../utils/new/design-system';
import {CHECK_LOGIN_USER} from '../../utils/queries';
import FormElem from '../FormElem';

const LoginFormMain = styled('div')``;

const ForgotPasswordLink = styled(Link)`
	font-size: 14px;
`;

const ForgotPasswordLinkContainer = styled('div')`
	text-align: right;
	margin-bottom: 2rem;
`;

const LoginButton = styled(Button)`
	display: block;
	margin-left: auto;
`;

function LoginForm({from = '/app', history, client}) {
	const [login] = useMutation(LOGIN);

	return (
		<LoginFormMain>
			<Formik
				initialValues={{email: '', password: ''}}
				validationSchema={Yup.object().shape({
					email: Yup.string()
						.email(
							<fbt project="inyo" desc="email invalid">
								L'email n'est pas valide
							</fbt>,
						)
						.required(
							<fbt project="inyo" desc="required">
								Requis
							</fbt>,
						),
					password: Yup.string().required(
						<fbt project="inyo" desc="required">
							Requis
						</fbt>,
					),
				})}
				onSubmit={async (values, actions) => {
					actions.setSubmitting(false);
					try {
						const {data} = await login({
							variables: {
								email: values.email,
								password: values.password,
							},
						});

						if (data) {
							window.localStorage.setItem(
								'authToken',
								data.login.token,
							);
							ReactGA.event({
								category: 'User',
								action: 'Logged in',
							});
							await client.resetStore();
							history.push(from);
						}
					}
					catch (error) {
						actions.setSubmitting(false);
						actions.setErrors(error);
						actions.setStatus({
							msg: (
								<fbt
									project="inyo"
									desc="wrong email or password"
								>
									Mauvais email ou mot de passe
								</fbt>
							),
						});
					}
				}}
			>
				{(props) => {
					const {status, isSubmitting, handleSubmit} = props;

					return (
						<form onSubmit={handleSubmit}>
							<FormElem
								{...props}
								name="email"
								type="email"
								label={
									<fbt
										project="inyo"
										desc="login form email label"
									>
										Adresse email
									</fbt>
								}
								placeholder={
									<fbt
										project="inyo"
										desc="placeholder email"
									>
										jean@dupont.fr
									</fbt>
								}
								required
								big
							/>
							<FormElem
								{...props}
								name="password"
								type="password"
								label={
									<fbt
										project="inyo"
										desc="login password label"
									>
										Mot de passe
									</fbt>
								}
								placeholder="***************"
								required
								big
							/>
							<ForgotPasswordLinkContainer>
								<ForgotPasswordLink to="/auth/forgotten-password">
									<fbt
										project="inyo"
										desc="login form forgotten password link"
									>
										Mot de passe oublié ?
									</fbt>
								</ForgotPasswordLink>
							</ForgotPasswordLinkContainer>
							{status && status.msg && (
								<ErrorInput style={{marginBottom: '1rem'}}>
									{status.msg}
								</ErrorInput>
							)}
							<LoginButton
								type="submit"
								big
								disabled={isSubmitting}
							>
								<fbt
									project="inyo"
									desc="login form sign in button"
								>
									Se connecter
								</fbt>
							</LoginButton>
						</form>
					);
				}}
			</Formik>
		</LoginFormMain>
	);
}

export default withApollo(LoginForm);
