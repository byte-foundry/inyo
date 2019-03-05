import React, {Component} from 'react';
import {Mutation} from 'react-apollo';
import styled from '@emotion/styled';
import {Formik} from 'formik';
import * as Yup from 'yup';
import gql from 'graphql-tag';

import {P, Button} from '../../utils/new/design-system';
import {ErrorInput} from '../../utils/content';

import FormElem from '../FormElem';

const SEND_RESET_PASSWORD = gql`
	mutation sendResetPassword($email: String!) {
		sendResetPassword(email: $email)
	}
`;

const Container = styled('div')``;

const SendButton = styled(Button)`
	display: block;
	margin-left: auto;
`;

class SendResetPasswordForm extends Component {
	constructor(props) {
		super(props);

		this.state = {
			sent: false,
		};
	}

	render() {
		const {sent} = this.state;

		return (
			<Container>
				{sent ? (
					<P>
						L'email a bien été envoyé ! Vérifiez votre boîte de
						réception d'ici quelques minutes !
					</P>
				) : (
					<P>
						Entrez l'adresse mail que vous avez utilisé pour vous
						enregistrer, on vous enverra un lien pour réinitialiser
						votre mot de passe et accéder de nouveau à votre compte.
					</P>
				)}
				<Mutation mutation={SEND_RESET_PASSWORD}>
					{sendResetPassword => (
						<Formik
							initialValues={{email: ''}}
							validationSchema={Yup.object().shape({
								email: Yup.string()
									.email("L'email doit être valide")
									.required('Requis'),
							})}
							onSubmit={async (values, actions) => {
								actions.setSubmitting(false);
								this.setState({sent: false});
								try {
									await sendResetPassword({
										variables: {email: values.email},
									});

									this.setState({sent: true});
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
										name="email"
										type="email"
										label="Adresse email"
										placeholder="jean@dupont.fr"
										required
									/>
									{status && status.msg && (
										<ErrorInput>{status.msg}</ErrorInput>
									)}
									<SendButton
										type="submit"
										big
										disabled={isSubmitting}
									>
										Réinitialiser le mot de passe
									</SendButton>
								</form>
							)}
						</Formik>
					)}
				</Mutation>
			</Container>
		);
	}
}

export default SendResetPasswordForm;
