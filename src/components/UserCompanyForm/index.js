import React, {Component} from 'react';
import {Mutation} from 'react-apollo';
import styled from 'react-emotion';
import {Formik} from 'formik';
import * as Yup from 'yup';
import ReactGA from 'react-ga';
import AddressAutocomplete from '../AddressAutocomplete';
import {UPDATE_USER_COMPANY} from '../../utils/mutations';
import {
	Button,
	FlexRow,
	primaryWhite,
	gray20,
	ErrorInput,
} from '../../utils/content';
import {GET_USER_INFOS} from '../../utils/queries';
import FormElem from '../FormElem';

const UserCompanyFormMain = styled('div')``;

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

class UserCompanyForm extends Component {
	constructor(props) {
		super(props);
	}

	render() {
		const {
			name,
			address,
			phone,
			siret,
			rcs,
			rm,
			vat,
			submit,
		} = this.props.data;
		const {buttonText, done} = this.props;

		return (
			<UserCompanyFormMain>
				<Mutation mutation={UPDATE_USER_COMPANY}>
					{updateUser => (
						<Formik
							initialValues={{
								name: name || '',
								phone: phone || '',
								siret: siret || '',
								address: address || '',
								rcs: rcs || '',
								rm: rm || '',
								vat: vat || '',
							}}
							validationSchema={Yup.object().shape({
								name: Yup.string().required('Requis'),
								phone: Yup.string(),
								siret: Yup.string().required('Requis'),
								address: Yup.object()
									.shape({
										street: Yup.string().required(),
										city: Yup.string().required(),
										postalCode: Yup.string().required(),
										country: Yup.string().required(),
									})
									.required('Requis'),
								rcs: Yup.string(),
								rm: Yup.string(),
								vat: Yup.string(),
							})}
							onSubmit={async (values, actions) => {
								actions.setSubmitting(false);
								values.address.__typename = undefined;
								try {
									updateUser({
										variables: {
											company: values,
										},
										update: (
											cache,
											{data: {updateUser}},
										) => {
											const data = cache.readQuery({
												query: GET_USER_INFOS,
											});

											data.me = updateUser;
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
												console.log(e);
											}
										},
									});
								}
								catch (error) {
									console.log(error);
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
									dirty,
									isSubmitting,
									status,
									handleSubmit,
									handleReset,
									setFieldValue,
								} = props;

								return (
									<form onSubmit={handleSubmit}>
										<ProfileSection>
											<FormContainer>
												<FlexRow justifyContent="space-between">
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
														name="siret"
														type="text"
														label="Siret"
														placeholder="123456824"
														padded
														required
													/>
												</FlexRow>
												<AddressAutocomplete
													{...props}
													onChange={setFieldValue}
													name="address"
													values={address}
													placeholder=""
													label="Adresse de la société"
													padded
													required
												/>
												<FlexRow justifyContent="space-between">
													<FormElem
														{...props}
														name="phone"
														type="tel"
														label="Numéro de téléphone"
														placeholder="0427..."
														padded
													/>
													<FormElem
														{...props}
														name="rcs"
														type="text"
														label="RCS"
														placeholder="RCS Paris  654 987 321"
														padded
													/>
												</FlexRow>
												<FlexRow justifyContent="space-between">
													<FormElem
														{...props}
														name="rm"
														type="text"
														label="RM"
														placeholder="RM 123"
														padded
													/>
													<FormElem
														{...props}
														name="vat"
														type="text"
														label="N° TVA"
														placeholder="FR 40 123456824"
														padded
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
