import React, {Component} from 'react';
import {Mutation} from 'react-apollo';
import {Link, withRouter} from 'react-router-dom';
import styled from '@emotion/styled';
import ReactGA from 'react-ga';
import {Formik} from 'formik';
import * as Yup from 'yup';
import gql from 'graphql-tag';

import apolloClient from '../../utils/graphQLConfig';
import {P, Button} from '../../utils/new/design-system';
import {ErrorInput} from '../../utils/content';
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
									const {data} = await updatePassword({
										variables: {
											resetToken,
											newPassword: values.password,
										},
									});

									window.localStorage.setItem(
										'authToken',
										data.resetPassword.token,
									);
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
										<ErrorInput>{status.msg}</ErrorInput>
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
