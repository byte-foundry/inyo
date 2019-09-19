import {Mutation} from '@apollo/react-components';
import styled from '@emotion/styled';
import * as Sentry from '@sentry/browser';
import {Formik} from 'formik';
import React, {Component} from 'react';
import ReactGA from 'react-ga';
import * as Yup from 'yup';

import fbt from '../../fbt/fbt.macro';
import {BREAKPOINTS} from '../../utils/constants';
import {ErrorInput, gray20} from '../../utils/content';
import {UPDATE_USER_COMPANY} from '../../utils/mutations';
import {Button, primaryWhite} from '../../utils/new/design-system';
import {GET_USER_INFOS} from '../../utils/queries';
import AddressAutocomplete from '../AddressAutocomplete';
import FormElem from '../FormElem';

const UserCompanyFormMain = styled('div')``;

const FormContainer = styled('div')`
	display: grid;
	grid-template-columns: 1fr 1fr;
	grid-column-gap: 20px;

	@media (max-width: ${BREAKPOINTS}px) {
		display: flex;
		flex-direction: column;
	}
`;
const ProfileSection = styled('div')`
	background: ${primaryWhite};
	padding: 60px 40px;
	border: 1px solid ${gray20};

	@media (max-width: ${BREAKPOINTS}px) {
		padding: 0;
		border: none;
	}
`;
const UpdateButton = styled(Button)`
	display: block;
	margin-top: 15px;
	margin-left: auto;
	margin-right: 50px;
	margin-bottom: 80px;

	@media (max-width: ${BREAKPOINTS}px) {
		margin-right: 0;
		margin-bottom: 20px;
	}
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
								name: Yup.string().required(
									<fbt project="inyo" desc="required">
										Requis
									</fbt>,
								),
								phone: Yup.string(),
								address: Yup.object()
									.shape({
										street: Yup.string().required(),
										city: Yup.string().required(),
										postalCode: Yup.string().required(),
										country: Yup.string().required(),
									})
									.required(
										<fbt project="inyo" desc="required">
											Requis
										</fbt>,
									),
							})}
							onSubmit={async (values, actions) => {
								actions.setSubmitting(false);
								values.address.__typename = undefined; // eslint-disable-line no-underscore-dangle, no-param-reassign
								try {
									await updateUser({
										variables: {
											company: values,
										},
									});

									window.Intercom(
										'trackEvent',
										'updated-company-data',
									);
									ReactGA.event({
										category: 'User',
										action: 'Updated company data',
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
										msg: (
											<fbt
												project="inyo"
												desc="something went wrong"
											>
												Quelque chose s'est mal passé
											</fbt>
										),
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
													label={
														<fbt
															project="inyo"
															desc="company name"
														>
															Raison sociale
														</fbt>
													}
													placeholder={
														<fbt
															project="inyo"
															desc="company name placeholder"
														>
															Bertrand SA
														</fbt>
													}
													padded
													required
												/>
												<FormElem
													{...props}
													name="phone"
													type="tel"
													label={
														<fbt
															project="inyo"
															desc="phone number"
														>
															Numéro de téléphone
														</fbt>
													}
													placeholder={
														<fbt
															project="inyo"
															desc="phone number"
														>
															0427...
														</fbt>
													}
													padded
												/>
												<AddressAutocomplete
													{...props}
													onChange={setFieldValue}
													name="address"
													values={address}
													placeholder=""
													label={
														<fbt
															project="inyo"
															desc="company address"
														>
															Adresse de la
															société
														</fbt>
													}
													padded
													required
													style={{
														gridColumn: '1 / 3',
													}}
												/>
											</FormContainer>

											{status && status.msg && (
												<ErrorInput
													style={{
														marginBottom: '1rem',
													}}
												>
													{status.msg}
												</ErrorInput>
											)}
										</ProfileSection>
										<UpdateButton type="submit" big>
											{buttonText || (
												<fbt
													project="inyo"
													desc="update"
												>
													Mettre à jour
												</fbt>
											)}
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
