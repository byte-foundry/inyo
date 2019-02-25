import React, {Component} from 'react';
import {Mutation} from 'react-apollo';
import styled from '@emotion/styled';
import {Formik} from 'formik';
import * as Sentry from '@sentry/browser';
import * as Yup from 'yup';
import ReactGA from 'react-ga';

import {UPDATE_USER, CHECK_UNIQUE_EMAIL} from '../../utils/mutations';
import {
	Button,
	FlexRow,
	primaryWhite,
	gray20,
	ErrorInput,
} from '../../utils/content';
import {GET_USER_INFOS} from '../../utils/queries';

import FormElem from '../FormElem';

const UserDataFormMain = styled('div')``;

const FormContainer = styled('div')`
	display: grid;
	grid-template-columns: 1fr 1fr;
	grid-column-gap: 20px;
`;

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

class UserDataForm extends Component {
	render() {
		const {firstName, lastName, email} = this.props.data;

		return (
			<UserDataFormMain>
				<Mutation mutation={UPDATE_USER}>
					{updateUser => (
						<Mutation
							mutation={CHECK_UNIQUE_EMAIL}
							context={{
								debounceKey: 'emailAvailability',
								debounceTimeout: 300,
							}}
						>
							{checkEmailAvailability => (
								<Formik
									initialValues={{
										firstName,
										lastName,
										email,
									}}
									validationSchema={Yup.object().shape({
										email: Yup.string()
											.email('Email invalide')
											.required('Requis')
											.test(
												'unique-email',
												"L'email est déjà utilisé",
												value => email === value
													|| checkEmailAvailability({
														variables: {
															email: value,
														},
													}).then(
														({data}) => data.isAvailable,
													),
											),
										firstName: Yup.string().required(
											'Requis',
										),
										lastName: Yup.string().required(
											'Requis',
										),
									})}
									onSubmit={async (values, actions) => {
										actions.setSubmitting(false);
										try {
											updateUser({
												variables: {
													firstName: values.firstName,
													lastName: values.lastName,
													email: values.email,
												},
												update: (
													cache,
													{
														data: {
															updateUser: updatedUser,
														},
													},
												) => {
													window.Intercom(
														'trackEvent',
														'updated-user-data',
													);
													const data = cache.readQuery(
														{
															query: GET_USER_INFOS,
														},
													);

													data.me = updatedUser;
													try {
														cache.writeQuery({
															query: GET_USER_INFOS,
															data,
														});
														ReactGA.event({
															category: 'User',
															action:
																'Updated user data',
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
													error.networkError.result
														.errors,
												);
											}
											else {
												Sentry.captureException(error);
											}
											actions.setSubmitting(false);
											actions.setErrors(error);
											actions.setStatus({
												msg:
													"Quelque chose s'est mal passé",
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
														<FormElem
															{...props}
															name="firstName"
															type="text"
															label="Prénom"
															placeholder="Jacques"
															padded
															required
														/>
														<FormElem
															{...props}
															name="lastName"
															type="text"
															label="Nom"
															placeholder="Bertrand"
															padded
															required
														/>
														<FormElem
															{...props}
															name="email"
															type="email"
															label="Email"
															placeholder="jacques@bertrandsa.com"
															padded
															required
															style={{
																gridColumn:
																	'1 / 3',
															}}
														/>
													</FormContainer>
													{status && status.msg && (
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
					)}
				</Mutation>
			</UserDataFormMain>
		);
	}
}

export default UserDataForm;
