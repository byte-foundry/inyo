import {Mutation} from '@apollo/react-components';
import styled from '@emotion/styled';
import {Formik} from 'formik';
import gql from 'graphql-tag';
import React, {Component} from 'react';
import * as Yup from 'yup';

import fbt from '../../fbt/fbt.macro';
import {ErrorInput} from '../../utils/content';
import {Button, P} from '../../utils/new/design-system';
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
						<fbt
							project="inyo"
							desc="send reset password form sent message"
						>
							L'email a bien été envoyé ! Vérifiez votre boîte de
							réception d'ici quelques minutes !
						</fbt>
					</P>
				) : (
					<P>
						<fbt
							project="inyo"
							desc="send reset password form before sending message"
						>
							Entrez l'adresse mail que vous avez utilisé pour
							vous enregistrer, on vous enverra un lien pour
							réinitialiser votre mot de passe et accéder de
							nouveau à votre compte.
						</fbt>
					</P>
				)}
				<Mutation mutation={SEND_RESET_PASSWORD}>
					{sendResetPassword => (
						<Formik
							initialValues={{email: ''}}
							validationSchema={Yup.object().shape({
								email: Yup.string()
									.email(
										<fbt
											project="inyo"
											desc="invalid email"
										>
											L'email doit être valide
										</fbt>,
									)
									.required(
										<fbt project="inyo" desc="required">
											Requis
										</fbt>,
									),
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
										msg: (
											<fbt
												project="inyo"
												desc="something went wrong"
											>
												Quelque chose ne s'est pas passé
												comme prévu
											</fbt>
										),
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
												desc="placeholder email address"
											>
												jean@dupont.fr
											</fbt>
										}
										required
									/>
									{status && status.msg && (
										<ErrorInput
											style={{marginBottom: '1rem'}}
										>
											{status.msg}
										</ErrorInput>
									)}
									<SendButton
										type="submit"
										big
										disabled={isSubmitting}
									>
										<fbt
											project="inyo"
											desc="reset password button"
										>
											Réinitialiser le mot de passe
										</fbt>
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
