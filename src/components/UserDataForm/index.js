import React from 'react';
import {useMutation} from 'react-apollo-hooks';
import styled from '@emotion/styled';
import {Formik} from 'formik';
import * as Sentry from '@sentry/browser';
import * as Yup from 'yup';
import ReactGA from 'react-ga';
import debounce from 'lodash.debounce';

import {UPDATE_USER, CHECK_UNIQUE_EMAIL} from '../../utils/mutations';
import {gray20, ErrorInput} from '../../utils/content';
import {Button, primaryWhite} from '../../utils/new/design-system';
import {GET_USER_INFOS} from '../../utils/queries';
import userIllus from '../../utils/images/bermuda-coming-soon.svg';

import {BREAKPOINTS} from '../../utils/constants';

import FormElem from '../FormElem';

const UserDataFormMain = styled('div')``;

const FormContainer = styled('div')`
	display: grid;
	grid-template-columns: 1fr 1fr;
	grid-column-gap: 20px;
	flex: 1;

	@media (max-width: ${BREAKPOINTS}px) {
		display: flex;
		flex-direction: column;
	}
`;

const ProfileSection = styled('div')`
	background: ${primaryWhite};
	padding: 60px 40px;
	border: 1px solid ${gray20};
	display: flex;
	flex-direction: row;

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
	}
`;

const Illus = styled('img')`
	margin-right: 2rem;
	align-self: end;
`;

const UserDataForm = (componentProps) => {
	const {firstName, lastName, email} = componentProps.data;
	const updateUser = useMutation(UPDATE_USER);
	const checkEmailAvailability = useMutation(CHECK_UNIQUE_EMAIL);

	const debouncedCheckEmail = debounce(checkEmailAvailability, 300);

	return (
		<UserDataFormMain>
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
								|| debouncedCheckEmail({
									variables: {
										email: value,
									},
								}).then(({data}) => data.isAvailable),
						),
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
								window.Intercom(
									'trackEvent',
									'updated-user-data',
								);
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
								<Illus src={userIllus} />
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
											gridColumn: '1 / 3',
										}}
									/>
								</FormContainer>
								{status && status.msg && (
									<ErrorInput>{status.msg}</ErrorInput>
								)}
							</ProfileSection>
							<UpdateButton type="submit" big>
								Mettre à jour
							</UpdateButton>
						</form>
					);
				}}
			</Formik>
		</UserDataFormMain>
	);
};

export default UserDataForm;
