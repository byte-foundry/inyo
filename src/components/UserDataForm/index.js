import styled from '@emotion/styled';
import * as Sentry from '@sentry/browser';
import debounce from 'debounce-promise';
import {Formik} from 'formik';
import React from 'react';
import {useMutation} from 'react-apollo-hooks';
import ReactGA from 'react-ga';
import * as Yup from 'yup';

import fbt from '../../fbt/fbt.macro';
import {BREAKPOINTS} from '../../utils/constants';
import {ErrorInput, gray20} from '../../utils/content';
import userIllus from '../../utils/images/bermuda-coming-soon.svg';
import {CHECK_UNIQUE_EMAIL, UPDATE_USER} from '../../utils/mutations';
import {Button, primaryWhite} from '../../utils/new/design-system';
import FormElem from '../FormElem';

const UserDataFormMain = styled('div')``;

const ProfileSection = styled('div')`
	background: ${primaryWhite};
	padding: 60px 40px;
	border: 1px solid ${gray20};
	display: grid;
	grid-template-columns: 1fr 1fr 1fr;
	column-gap: 20px;
	align-items: center;

	@media (max-width: ${BREAKPOINTS}px) {
		display: block;
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

const Illus = styled('img')`
	margin-right: 2rem;
	align-self: end;
	grid-row: 1 / 3;
`;

const UserDataForm = ({done, ...componentProps}) => {
	const {firstName, lastName, email} = componentProps.data;
	const [updateUser] = useMutation(UPDATE_USER);
	const [checkEmailAvailability] = useMutation(CHECK_UNIQUE_EMAIL);

	const debouncedCheckEmail = debounce(checkEmailAvailability, 500);

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
						.email(
							<fbt project="inyo" desc="invalid email">
								L'email doit être valide
							</fbt>,
						)
						.required(
							<fbt project="inyo" desc="required">
								Requis
							</fbt>,
						)
						.test(
							'unique-email',
							<fbt project="inyo" desc="email is already used">
								L'email est déjà utilisé
							</fbt>,
							value => email === value
								|| debouncedCheckEmail({
									variables: {
										email: value,
									},
								}).then(({data}) => data.isAvailable),
						),
					firstName: Yup.string().required(
						<fbt project="inyo" desc="required">
							Requis
						</fbt>,
					),
					lastName: Yup.string().required(
						<fbt project="inyo" desc="required">
							Requis
						</fbt>,
					),
				})}
				onSubmit={async (values, actions) => {
					try {
						await updateUser({
							variables: {
								firstName: values.firstName,
								lastName: values.lastName,
								email: values.email,
							},
						});

						window.Intercom('trackEvent', 'updated-user-data');

						ReactGA.event({
							category: 'User',
							action: 'Updated user data',
						});
						done();
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
						actions.setErrors(error);
						actions.setStatus({
							msg: (
								<fbt project="inyo" desc="something went wrong">
									Quelque chose s'est mal passé
								</fbt>
							),
						});
					}

					actions.setSubmitting(false);
				}}
			>
				{(props) => {
					const {status, handleSubmit} = props;

					return (
						<form onSubmit={handleSubmit}>
							<ProfileSection>
								<Illus src={userIllus} />
								<FormElem
									{...props}
									name="firstName"
									type="text"
									label={
										<fbt project="inyo" desc="first name">
											Prénom
										</fbt>
									}
									placeholder={
										<fbt
											project="inyo"
											desc="first name placeholder"
										>
											Jacques
										</fbt>
									}
									padded
									required
								/>
								<FormElem
									{...props}
									name="lastName"
									type="text"
									label={
										<fbt project="inyo" desc="last name">
											Nom
										</fbt>
									}
									placeholder={
										<fbt
											project="inyo"
											desc="last name placeholder"
										>
											Bertrand
										</fbt>
									}
									padded
									required
								/>
								<FormElem
									{...props}
									name="email"
									type="email"
									label={
										<fbt project="inyo" desc="email">
											Email
										</fbt>
									}
									placeholder={
										<fbt
											project="inyo"
											desc="email placeholder"
										>
											jacques@bertrandsa.com
										</fbt>
									}
									padded
									required
									style={{
										gridColumn: '2 / 4',
									}}
								/>
								{status && status.msg && (
									<ErrorInput style={{gridColumnEnd: '4'}}>
										{status.msg}
									</ErrorInput>
								)}
							</ProfileSection>
							<UpdateButton type="submit" big>
								<fbt project="inyo" desc="update">
									Mettre à jour
								</fbt>
							</UpdateButton>
						</form>
					);
				}}
			</Formik>
		</UserDataFormMain>
	);
};

export default UserDataForm;
