import React, {Component} from 'react';
import {Mutation} from 'react-apollo';
import styled from 'react-emotion';
import {Formik} from 'formik';
import * as Sentry from '@sentry/browser';
import * as Yup from 'yup';
import ReactGA from 'react-ga';

import {UPDATE_USER} from '../../utils/mutations';
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

class UserDataForm extends Component {
	render() {
		const {firstName, lastName, email} = this.props.data;

		return (
			<UserDataFormMain>
				<Mutation mutation={UPDATE_USER}>
					{updateUser => (
						<Formik
							initialValues={{
								firstName,
								lastName,
								email,
							}}
							validationSchema={Yup.object().shape({
								email: Yup.string()
									.email('Email invalide')
									.required('Requis'),
								firstName: Yup.string().required('Requis'),
								lastName: Yup.string().required('Requis'),
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
											{data: {updateUser: updatedUser}},
										) => {
											window.$crisp.push([
												'set',
												'session:event',
												[
													[
														[
															'updated_user_data',
															undefined,
															'green',
														],
													],
												],
											]);
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
									Sentry.captureException(error);
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
												</FlexRow>
												<FlexRow justifyContent="space-between">
													<FormElem
														{...props}
														name="email"
														type="email"
														label="Email"
														placeholder="jacques@bertrandsa.com"
														padded
														required
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

export default UserDataForm;
