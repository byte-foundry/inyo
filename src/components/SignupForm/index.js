import React, {Component} from 'react';
import {Mutation} from 'react-apollo';
import {Redirect} from 'react-router-dom';
import ReactGA from 'react-ga';
import * as Sentry from '@sentry/browser';
import styled from 'react-emotion';
import {Formik} from 'formik';
import * as Yup from 'yup';

import {SIGNUP} from '../../utils/mutations';
import {Button, ErrorInput} from '../../utils/content';

import FormElem from '../FormElem';

const SignupFormMain = styled('div')``;

class SignupForm extends Component {
	constructor(props) {
		super(props);
		this.state = {
			shouldRedirect: false,
		};
	}

	render() {
		const {shouldRedirect} = this.state;
		const from = this.props.from || '/app/onboarding';

		if (shouldRedirect) {
			return <Redirect to={from} />;
		}
		return (
			<SignupFormMain>
				<Mutation mutation={SIGNUP}>
					{signup => (
						<Formik
							initialValues={{email: ''}}
							validationSchema={Yup.object().shape({
								email: Yup.string()
									.email("L'email doit être valide")
									.required('Required'),
								password: Yup.string().required('Requis'),
								firstname: Yup.string().required('Requis'),
								lastname: Yup.string().required('Requis'),
							})}
							onSubmit={async (values, actions) => {
								actions.setSubmitting(false);
								try {
									const {data} = await signup({
										variables: {
											email: values.email,
											password: values.password,
											firstName: values.firstname,
											lastName: values.lastname,
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
										this.setState({
											shouldRedirect: true,
										});
									}
								}
								catch (error) {
									Sentry.captureException(error);
									actions.setSubmitting(false);
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
									<form onSubmit={handleSubmit}>
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
										<Button
											type="submit"
											theme={
												isSubmitting
													? 'Disabled'
													: 'PrimaryNavy'
											}
											size="Big"
											disabled={isSubmitting}
										>
											Commencez
										</Button>
									</form>
								);
							}}
						</Formik>
					)}
				</Mutation>
			</SignupFormMain>
		);
	}
}

export default SignupForm;
