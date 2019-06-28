import styled from '@emotion/styled';
import {Formik} from 'formik';
import gql from 'graphql-tag';
import React, {Component} from 'react';
import {Mutation} from 'react-apollo';
import ReactGA from 'react-ga';
import {Link, withRouter} from 'react-router-dom';
import * as Yup from 'yup';

import {ErrorInput} from '../../utils/content';
import apolloClient from '../../utils/graphQLConfig';
import {Button, P} from '../../utils/new/design-system';
import {CHECK_LOGIN_USER} from '../../utils/queries';
import FormElem from '../FormElem';

const CHECK_RESET_PASSWORD = gql`
	mutation checkResetPassword($resetToken: String!) {
		isValidToken: checkResetPassword(resetToken: $resetToken)
	}
`;

const UPDATE_PASSWORD = gql`
	mutation updatePassword($resetToken: String!, $newPassword: String!) {
		resetPassword(resetToken: $resetToken, newPassword: $newPassword) {
			token
			user {
				id
				email
				hmacIntercomId
				firstName
				lastName
				company {
					phone
				}
			}
		}
	}
`;

const ResetButton = styled(Button)`
	display: block;
	margin-left: auto;
`;

class ResetPasswordForm extends Component {
	constructor(props) {
		super(props);

		this.state = {
			isValidToken: false,
		};
	}

	componentDidMount() {
		this.checkResetPassword();
	}

	componentWillReceiveProps(nextProps) {
		if (nextProps.resetToken !== this.props.resetToken) {
			this.checkResetPassword();
		}
	}

	checkResetPassword = async () => {
		this.setState({isValidToken: false});

		const {
			data: {isValidToken},
		} = await apolloClient.mutate({
			mutation: CHECK_RESET_PASSWORD,
			variables: {resetToken: this.props.resetToken},
		});

		this.setState({isValidToken});
	};

	render() {
		const {loading, isValidToken} = this.state;
		const {resetToken} = this.props;

		if (loading) {
			return (
				<div>
					<P>Vérification de la validité du token...</P>
				</div>
			);
		}

		if (!isValidToken) {
			return (
				<div>
					<P>
						Ce lien n'est pas ou plus valide. Essayez de recommencer
						en vous rendant sur la page{' '}
						<Link to="/auth/forgotten-password">
							Mot de passe oublié ?
						</Link>{' '}
						.
					</P>
				</div>
			);
		}

		return (
			<div>
				<P>
					Entrez votre nouveau mot de passe. Vous serez connecté et
					redirigé automatiquement ensuite. Et cette fois, ne
					l'oubliez plus. ;)
				</P>
				<Mutation mutation={UPDATE_PASSWORD}>
					{updatePassword => (
						<Formik
							initialValues={{password: ''}}
							validationSchema={Yup.object().shape({
								password: Yup.string().required('Requis'),
							})}
							onSubmit={async (values, actions) => {
								actions.setSubmitting(false);
								this.setState({sent: false});
								try {
									await updatePassword({
										variables: {
											resetToken,
											newPassword: values.password,
										},
										update: (
											cache,
											{data: {resetPassword}},
										) => {
											window.localStorage.setItem(
												'authToken',
												resetPassword.token,
											);

											const data = cache.readQuery({
												query: CHECK_LOGIN_USER,
											});

											cache.writeQuery({
												query: CHECK_LOGIN_USER,
												data: {
													me: {
														...data.me,
														...resetPassword.user,
													},
												},
											});
										},
									});

									ReactGA.event({
										category: 'User',
										action: 'Logged in',
									});

									this.props.history.push('/app');
								}
								catch (error) {
									actions.setSubmitting(false);
									actions.setErrors(error);
									actions.setStatus({
										msg:
											"Quelque chose ne s'est pas passé comme prévu",
									});
								}
							}}
						>
							{({
								handleSubmit,
								isSubmitting,
								status,
								...props
							}) => (
								<form onSubmit={handleSubmit}>
									<FormElem
										{...props}
										name="password"
										type="password"
										label="Nouveau mot de passe"
										placeholder="***************"
										required
									/>
									{status && status.msg && (
										<ErrorInput
											style={{marginBottom: '1rem'}}
										>
											{status.msg}
										</ErrorInput>
									)}
									<ResetButton
										type="submit"
										big
										disabled={isSubmitting}
									>
										Changer le mot de passe
									</ResetButton>
								</form>
							)}
						</Formik>
					)}
				</Mutation>
			</div>
		);
	}
}

export default withRouter(ResetPasswordForm);
