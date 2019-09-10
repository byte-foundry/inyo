import styled from '@emotion/styled';
import * as Sentry from '@sentry/browser';
import debounce from 'debounce-promise';
import {Formik} from 'formik';
import React from 'react';
import {useApolloClient, useMutation} from 'react-apollo-hooks';
import ReactGA from 'react-ga';
import * as Yup from 'yup';

import fbt from '../../fbt/fbt.macro';
import {INTERCOM_APP_ID} from '../../utils/constants';
import {ErrorInput} from '../../utils/content';
import {CHECK_UNIQUE_EMAIL, SIGNUP} from '../../utils/mutations';
import {A, Button, primaryPurple} from '../../utils/new/design-system';
import FormElem from '../FormElem';

const SignupFormMain = styled('div')``;

const SignupButton = styled(Button)`
	display: block;
	margin-left: auto;
`;

const CGU = styled('label')`
	padding: 1rem;
	color: ${primaryPurple};
	margin-bottom: 1rem;

	input {
		margin-right: 0.5rem;
	}
`;

const SignupForm = ({from, history, location}) => {
	const client = useApolloClient();
	const [signup] = useMutation(SIGNUP);
	const [checkEmailAvailability] = useMutation(CHECK_UNIQUE_EMAIL);
	const query = new URLSearchParams(location.search);
	const prefilledEmail = query.get('email');

	const debouncedCheckEmail = debounce(checkEmailAvailability, 500);

	return (
		<SignupFormMain>
			<Formik
				initialValues={{
					email: prefilledEmail || '',
					password: '',
					firstname: '',
					lastname: '',
				}}
				validationSchema={Yup.object().shape({
					email: Yup.string()
						.email(
							<fbt project="inyo" desc="invalid email">
								L'email doit être valide
							</fbt>,
						)
						.required(
							<fbt project="inyo" desc="required">
								Requis
							</fbt>,
						)
						.test(
							'unique-email',
							<fbt project="inyo" desc="email is already used">
								L'email est déjà utilisé
							</fbt>,
							value => debouncedCheckEmail({
								variables: {
									email: value || '',
								},
							}).then(({data}) => data.isAvailable),
						),
					password: Yup.string().required(
						<fbt project="inyo" desc="required">
							Requis
						</fbt>,
					),
					firstname: Yup.string().required(
						<fbt project="inyo" desc="required">
							Requis
						</fbt>,
					),
					lastname: Yup.string().required(
						<fbt project="inyo" desc="required">
							Requis
						</fbt>,
					),
				})}
				onSubmit={async (values, actions) => {
					try {
						const query = new URLSearchParams(location.search);
						const referrer = query.get('referral');
						const inyoOffer = query.get('ref');

						const {data} = await signup({
							variables: {
								email: values.email,
								password: values.password,
								firstName: values.firstname,
								lastName: values.lastname,
								settings: {
									language:
										navigator
										&& navigator.language
										&& navigator.language.includes('fr')
											? 'fr'
											: 'en',
								},
								referrer,
							},
						});

						if (data) {
							window.localStorage.setItem(
								'authToken',
								data.signup.token,
							);
							ReactGA.event({
								category: 'User',
								action: 'Created an account',
							});

							const {user} = data.signup;

							window.Intercom('boot', {
								app_id: INTERCOM_APP_ID,
								email: user.email,
								user_id: user.id,
								name: `${user.firstName} ${user.lastName}`,
								user_hash: user.hmacIntercomId,
								phone: user.company.phone,
								referrer,
								inyo_offer: inyoOffer,
							});

							await client.resetStore();
							const fromPage = from || '/app/onboarding';

							history.push(fromPage);
						}
					}
					catch (error) {
						if (
							error.networkError
							&& error.networkError.result
							&& error.networkError.result.errors
						) {
							Sentry.captureException(
								error.networkError.result.errors,
							);
						}
						else {
							Sentry.captureException(error);
						}
						actions.setSubmitting(false);
						actions.setErrors(error);
						actions.setStatus({
							msg: (
								<fbt project="inyo" desc="something went wrong">
									Quelque chose ne s'est pas passé comme prévu
								</fbt>
							),
						});
					}
				}}
			>
				{(props) => {
					const {isSubmitting, status, handleSubmit} = props;

					return (
						<form onSubmit={handleSubmit}>
							<FormElem
								{...props}
								name="email"
								type="email"
								label={
									<fbt
										project="inyo"
										desc="email address label"
									>
										Adresse email
									</fbt>
								}
								placeholder={
									<fbt
										project="inyo"
										desc="email address placeholder"
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
									<fbt project="inyo" desc="password">
										Mot de passe
									</fbt>
								}
								placeholder="***************"
								required
								big
							/>
							<FormElem
								{...props}
								name="firstname"
								type="text"
								label={
									<fbt project="inyo" desc="firstname label">
										Prénom
									</fbt>
								}
								placeholder={
									<fbt
										project="inyo"
										desc="firstname placeholder"
									>
										Jean
									</fbt>
								}
								required
								big
							/>
							<FormElem
								{...props}
								name="lastname"
								type="text"
								label={
									<fbt project="inyo" desc="lastname label">
										Nom
									</fbt>
								}
								placeholder={
									<fbt
										project="inyo"
										desc="lastname placeholder"
									>
										Dupont
									</fbt>
								}
								required
								big
							/>
							{status && status.msg && (
								<ErrorInput style={{marginBottom: '1rem'}}>
									{status.msg}
								</ErrorInput>
							)}
							<CGU>
								<input
									name="CGU"
									id="toscheck"
									type="checkbox"
									required
								/>
								<fbt project="inyo" desc="notification message">
									J'accepte les{' '}
									<b>
										<A
											target="blank"
											href="https://inyo.me/a-propos/cgu/"
										>
											CGU
										</A>
									</b>{' '}
									et consent à recevoir des emails de la part
									d'Inyo.
								</fbt>
							</CGU>
							<SignupButton
								type="submit"
								isSubmitting={isSubmitting}
								big
							>
								<fbt project="inyo" desc="sign up">
									Commencez
								</fbt>
							</SignupButton>
						</form>
					);
				}}
			</Formik>
		</SignupFormMain>
	);
};

export default SignupForm;
