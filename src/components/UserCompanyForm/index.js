import React, {Component} from 'react';
import {Mutation} from 'react-apollo';
import styled from '@emotion/styled';
import {Formik} from 'formik';
import * as Sentry from '@sentry/browser';
import * as Yup from 'yup';
import ReactGA from 'react-ga';

import {UPDATE_USER_COMPANY} from '../../utils/mutations';
import {
	Button, primaryWhite, gray20, ErrorInput,
} from '../../utils/content';
import {GET_USER_INFOS} from '../../utils/queries';

import AddressAutocomplete from '../AddressAutocomplete';
import FormElem from '../FormElem';

const UserCompanyFormMain = styled('div')``;

const FormContainer = styled('div')`
	display: grid;
	grid-template-columns: 1fr 1fr;
	grid-column-gap: 20px;
`;
const ProfileSection = styled('div')`
	background: ${primaryWhite};
	padding: 60px 40px;
	border: 1px solid ${gray20};
`;
const UpdateButton = styled(Button)`
	display: block;
	margin-top: 15px;
	margin-left: auto;
	margin-right: 50px;
	margin-bottom: 80px;
`;

class UserCompanyForm extends Component {
	render() {
		const {name, address, phone} = this.props.data;
		const {buttonText, done} = this.props;

		return (
			<UserCompanyFormMain>
				<Mutation mutation={UPDATE_USER_COMPANY}>
					{updateUser => (
						<Formik
							initialValues={{
								name: name || '',
								phone: phone || '',
								address: address || '',
							}}
							validationSchema={Yup.object().shape({
								name: Yup.string().required('Requis'),
								phone: Yup.string(),
								address: Yup.object()
									.shape({
										street: Yup.string().required(),
										city: Yup.string().required(),
										postalCode: Yup.string().required(),
										country: Yup.string().required(),
									})
									.required('Requis'),
							})}
							onSubmit={async (values, actions) => {
								actions.setSubmitting(false);
								values.address.__typename = undefined; // eslint-disable-line no-underscore-dangle, no-param-reassign
								try {
									updateUser({
										variables: {
											company: values,
										},
										update: (
											cache,
											{data: {updateUser: updatedUser}},
										) => {
											window.Intercom(
												'trackEvent',
												'updated-company-data',
											);
											const data = cache.readQuery({
												query: GET_USER_INFOS,
											});

											data.me = updatedUser;
											ReactGA.event({
												category: 'User',
												action: 'Updated company data',
											});
											try {
												cache.writeQuery({
													query: GET_USER_INFOS,
													data,
												});
												done();
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
								const {
									status,
									handleSubmit,
									setFieldValue,
								} = props;

								return (
									<form onSubmit={handleSubmit}>
										<ProfileSection>
											<FormContainer>
												<FormElem
													{...props}
													name="name"
													type="text"
													label="Raison sociale"
													placeholder="Bertrand SA"
													padded
													required
												/>
												<FormElem
													{...props}
													name="phone"
													type="tel"
													label="Numéro de téléphone"
													placeholder="0427..."
													padded
												/>
												<AddressAutocomplete
													{...props}
													onChange={setFieldValue}
													name="address"
													values={address}
													placeholder=""
													label="Adresse de la société"
													padded
													required
													style={{
														gridColumn: '1 / 3',
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
											{buttonText || 'Mettre à jour'}
										</UpdateButton>
									</form>
								);
							}}
						</Formik>
					)}
				</Mutation>
			</UserCompanyFormMain>
		);
	}
}

export default UserCompanyForm;
