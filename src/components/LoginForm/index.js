import React, {Component} from 'react';
import {Mutation} from 'react-apollo';
import {Link, Redirect} from 'react-router-dom';
import styled from '@emotion/styled';
import ReactGA from 'react-ga';
import {Formik} from 'formik';
import * as Yup from 'yup';

import FormElem from '../FormElem';
import {LOGIN} from '../../utils/mutations';
import {Button} from '../../utils/new/design-system';
import {ErrorInput} from '../../utils/content';

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

class LoginForm extends Component {
	constructor(props) {
		super(props);
		this.state = {
			shouldRedirect: false,
		};
	}

	render() {
		const {shouldRedirect} = this.state;
		const from = this.props.from || '/app';

		if (shouldRedirect) {
			return <Redirect to={from} />;
		}
		return (
			<LoginFormMain>
				<Mutation mutation={LOGIN}>
					{login => (
						<Formik
							initialValues={{email: ''}}
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
										this.setState({
											shouldRedirect: true,
										});
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
								const {
									status,
									isSubmitting,
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
											style={{marginBottom: '5px'}}
										/>
										<ForgotPasswordLinkContainer>
											<ForgotPasswordLink to="/auth/forgotten-password">
												Mot de passe oublié ?
											</ForgotPasswordLink>
										</ForgotPasswordLinkContainer>
										{status && status.msg && (
											<ErrorInput>
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
					)}
				</Mutation>
			</LoginFormMain>
		);
	}
}

export default LoginForm;
