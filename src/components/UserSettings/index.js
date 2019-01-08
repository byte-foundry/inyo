import React, {Component} from 'react';
import {Mutation} from 'react-apollo';
import styled from 'react-emotion';
import {Formik} from 'formik';
import * as Sentry from '@sentry/browser';
import * as Yup from 'yup';
import ReactGA from 'react-ga';

import {UPDATE_USER_SETTINGS} from '../../utils/mutations';
import {
	Button,
	FlexRow,
	primaryWhite,
	gray20,
	ErrorInput,
} from '../../utils/content';
import {GET_USER_INFOS} from '../../utils/queries';

import FormCheckbox from '../FormCheckbox';

const UserDataFormMain = styled('div')``;

const FormContainer = styled('div')``;
const ProfileSection = styled('div')`
	background: ${primaryWhite};
	padding: 20px 40px;
	border: 1px solid ${gray20};
`;
const UpdateButton = styled(Button)`
	display: block;
	margin-top: 15px;
	margin-left: auto;
	margin-right: 50px;
	margin-bottom: 80px;
`;

class UserSettingsForm extends Component {
	render() {
		const {
			askStartProjectConfirmation,
			askItemFinishConfirmation,
		} = this.props.data.settings;

		return (
			<UserDataFormMain>
				<Mutation mutation={UPDATE_USER_SETTINGS}>
					{updateUser => (
						<Formik
							initialValues={{
								askStartProjectConfirmation,
								askItemFinishConfirmation,
							}}
							validationSchema={Yup.object().shape({
								askItemFinishConfirmation: Yup.boolean().required(
									'Requis',
								),
								askStartProjectConfirmation: Yup.boolean().required(
									'Requis',
								),
							})}
							onSubmit={async (values, actions) => {
								try {
									updateUser({
										variables: {
											settings: {
												askStartProjectConfirmation:
													values.askStartProjectConfirmation,
												askItemFinishConfirmation:
													values.askItemFinishConfirmation,
											},
										},
										update: (
											cache,
											{data: {updateUser: updatedUser}},
										) => {
											const data = cache.readQuery({
												query: GET_USER_INFOS,
											});

											data.me = updatedUser;
											try {
												cache.writeQuery({
													query: GET_USER_INFOS,
													data,
												});
												ReactGA.event({
													category: 'User',
													action: 'Updated user data',
												});
												this.props.done();
											}
											catch (e) {
												throw e;
											}
										},
									});
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
										msg: "Quelque chose s'est mal passé",
									});
								}
							}}
						>
							{(props) => {
								const {status, handleSubmit} = props;

								return (
									<form onSubmit={handleSubmit}>
										<ProfileSection>
											<FormContainer>
												<FlexRow justifyContent="space-between">
													<FormCheckbox
														{...props}
														name="askStartProjectConfirmation"
														type="checkbox"
														label="Toujours me demander confirmation lors de l'envoi d'un projet"
													/>
												</FlexRow>
												<FlexRow justifyContent="space-between">
													<FormCheckbox
														{...props}
														name="askItemFinishConfirmation"
														type="checkbox"
														label="Toujours me demander confirmation lors de la validation d'une tâche"
													/>
												</FlexRow>
											</FormContainer>
											{status
												&& status.msg && (
												<ErrorInput>
													{status.msg}
												</ErrorInput>
											)}
										</ProfileSection>
										<UpdateButton
											theme="Primary"
											size="Medium"
											type="submit"
										>
											Mettre à jour
										</UpdateButton>
									</form>
								);
							}}
						</Formik>
					)}
				</Mutation>
			</UserDataFormMain>
		);
	}
}

export default UserSettingsForm;
