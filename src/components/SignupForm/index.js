import React, {Component} from 'react';
import {Mutation} from 'react-apollo';
import {Redirect} from 'react-router-dom';
import ReactGA from 'react-ga';
import * as Sentry from '@sentry/browser';
import styled from '@emotion/styled';
import {Formik} from 'formik';
import * as Yup from 'yup';

import {
	SIGNUP,
	CHECK_UNIQUE_EMAIL,
	CREATE_PROJECT,
} from '../../utils/mutations';
import {Button} from '../../utils/new/design-system';
import {ErrorInput} from '../../utils/content';
import {INTERCOM_APP_ID} from '../../utils/constants';
import {onboardingTemplate} from '../../utils/project-templates';

import FormElem from '../FormElem';

const SignupFormMain = styled('div')``;

const SignupButton = styled(Button)`
	display: block;
	margin-left: auto;
`;

class SignupForm extends Component {
	state = {
		shouldRedirect: false,
	};

	render() {
		const {shouldRedirect, projectId} = this.state;
		const from
			= this.props.from || `/app/onboarding?projectId=${projectId}`;

		if (shouldRedirect) {
			return <Redirect to={from} />;
		}
		return (
			<SignupFormMain>
				<Mutation mutation={SIGNUP}>
					{signup => (
						<Mutation
							mutation={CHECK_UNIQUE_EMAIL}
							context={{
								debounceKey: 'emailAvailability',
								debounceTimeout: 300,
							}}
						>
							{checkEmailAvailability => (
								<Mutation mutation={CREATE_PROJECT}>
									{createProject => (
										<Formik
											initialValues={{
												email: '',
												password: '',
												firstname: '',
												lastname: '',
											}}
											validationSchema={Yup.object().shape(
												{
													email: Yup.string()
														.email(
															"L'email doit être valide",
														)
														.required('Requis')
														.test(
															'unique-email',
															"L'email est déjà utilisé",
															value => checkEmailAvailability(
																{
																	variables: {
																		email: value,
																	},
																},
															).then(
																({data}) => data.isAvailable,
															),
														),
													password: Yup.string().required(
														'Requis',
													),
													firstname: Yup.string().required(
														'Requis',
													),
													lastname: Yup.string().required(
														'Requis',
													),
												},
											)}
											onSubmit={async (
												values,
												actions,
											) => {
												actions.setSubmitting(false);
												try {
													const {data} = await signup(
														{
															variables: {
																email:
																	values.email,
																password:
																	values.password,
																firstName:
																	values.firstname,
																lastName:
																	values.lastname,
															},
														},
													);

													if (data) {
														window.localStorage.setItem(
															'authToken',
															data.signup.token,
														);
														ReactGA.event({
															category: 'User',
															action:
																'Created an account',
														});

														const deadLineForOnboardingProjet = new Date();

														deadLineForOnboardingProjet.setDate(
															new Date().getDate()
																+ 10,
														);

														const {
															user,
														} = data.signup;

														const {
															data: {
																createProject: {
																	id: onboardProjectId,
																},
															},
														} = await createProject(
															{
																variables: {
																	template:
																		'BLANK',
																	customer: {
																		name:
																			'Client test',
																		email:
																			'edwige@inyo.me',
																		firstName:
																			'Edwige',
																	},
																	sections:
																		onboardingTemplate.sections,
																	name:
																		'Bienvenue, découvrez votre smart assistant!',
																	deadline: deadLineForOnboardingProjet.toISOString(),
																},
															},
														);

														window.Intercom(
															'boot',
															{
																app_id: INTERCOM_APP_ID,
																email:
																	user.email,
																user_id:
																	user.id,
																name: `${
																	user.firstName
																} ${
																	user.lastName
																}`,
																user_hash:
																	user.hmacIntercomId,
																phone:
																	user.company
																		.phone,
															},
														);

														this.setState({
															shouldRedirect: true,
															projectId: onboardProjectId,
														});
													}
												}
												catch (error) {
													if (
														error.networkError
														&& error.networkError
															.result
														&& error.networkError
															.result.errors
													) {
														Sentry.captureException(
															error.networkError
																.result.errors,
														);
													}
													else {
														Sentry.captureException(
															error,
														);
													}
													actions.setSubmitting(
														false,
													);
													actions.setErrors(error);
													actions.setStatus({
														msg:
															"Quelque chose ne s'est pas passé comme prévu",
													});
												}
											}}
										>
											{(props) => {
												const {
													isSubmitting,
													status,
													handleSubmit,
												} = props;

												return (
													<form
														onSubmit={handleSubmit}
													>
														<FormElem
															{...props}
															name="email"
															type="email"
															label="Adresse email"
															placeholder="jean@dupont.fr"
															required
														/>
														<FormElem
															{...props}
															name="password"
															type="password"
															label="Mot de passe"
															placeholder="***************"
															required
														/>
														<FormElem
															{...props}
															name="firstname"
															type="text"
															label="Prénom"
															placeholder="Jean"
															required
														/>
														<FormElem
															{...props}
															name="lastname"
															type="text"
															label="Nom"
															placeholder="Dupont"
															required
														/>
														{status
															&& status.msg && (
															<ErrorInput>
																{status.msg}
															</ErrorInput>
														)}
														<SignupButton
															type="submit"
															disabled={
																isSubmitting
															}
															big
														>
															Commencez
														</SignupButton>
													</form>
												);
											}}
										</Formik>
									)}
								</Mutation>
							)}
						</Mutation>
					)}
				</Mutation>
			</SignupFormMain>
		);
	}
}

export default SignupForm;
