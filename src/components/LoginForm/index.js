import styled from '@emotion/styled';
import {Formik} from 'formik';
import React from 'react';
import {withApollo} from 'react-apollo';
import {useMutation} from 'react-apollo-hooks';
import ReactGA from 'react-ga';
import {Link} from 'react-router-dom';
import * as Yup from 'yup';

import {ErrorInput} from '../../utils/content';
import {LOGIN} from '../../utils/mutations';
import {Button} from '../../utils/new/design-system';
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
						.email("L'email n'est pas valide")
						.required('Requis'),
					password: Yup.string().required('Requis'),
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
							msg: 'Mauvais email ou mot de passe',
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
								label="Adresse email"
								placeholder="jean@dupont.fr"
								required
								big
							/>
							<FormElem
								{...props}
								name="password"
								type="password"
								label="Mot de passe"
								placeholder="***************"
								required
								big
							/>
							<ForgotPasswordLinkContainer>
								<ForgotPasswordLink to="/auth/forgotten-password">
									Mot de passe oublié ?
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
								Se connecter
							</LoginButton>
						</form>
					);
				}}
			</Formik>
		</LoginFormMain>
	);
}

export default withApollo(LoginForm);
