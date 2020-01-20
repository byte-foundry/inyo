import {useMutation} from '@apollo/react-hooks';
import styled from '@emotion/styled/macro';
import * as Sentry from '@sentry/browser';
import {Formik} from 'formik';
import React, {useState} from 'react';
import ReactGA from 'react-ga';
import * as Yup from 'yup';

import fbt from '../../fbt/fbt.macro';
import {BREAKPOINTS} from '../../utils/constants';
import {ErrorInput, gray20} from '../../utils/content';
import {REMOVE_ATTACHMENTS, UPDATE_USER_COMPANY} from '../../utils/mutations';
import {
	accentGrey,
	Button,
	InputLabel,
	Label,
	primaryPurple,
	primaryRed,
	primaryWhite,
} from '../../utils/new/design-system';
import useUserInfos from '../../utils/useUserInfos';
import AddressAutocomplete from '../AddressAutocomplete';
import FormElem from '../FormElem';
import IconButton from '../IconButton';
import ImagePickerModal from '../ImagePickerModal';
import MaterialIcon from '../MaterialIcon';
import UploadDashboardButton from '../UploadDashboardButton';

const UserCompanyFormMain = styled('div')``;

const FormContainer = styled('div')`
	display: grid;
	grid-template-columns: 1fr 1fr;
	grid-column-gap: 20px;

	@media (max-width: ${BREAKPOINTS.mobile}px) {
		display: flex;
		flex-direction: column;
	}
`;
const ProfileSection = styled('div')`
	background: ${primaryWhite};
	padding: 60px 40px;
	border: 1px solid ${gray20};

	@media (max-width: ${BREAKPOINTS.mobile}px) {
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

	@media (max-width: ${BREAKPOINTS.mobile}px) {
		margin-right: 0;
		margin-bottom: 20px;
	}
`;

const ImageContainer = styled('div')`
	width: ${props => props.width || '100%'};
	padding-top: ${props => props.height || '100%'};
	height: auto;
	position: relative;
	overflow: hidden;
	margin: 0 10px;

	img {
		display: block;
		position: absolute;
		top: 0;
		object-fit: cover;
		width: 100%;
	}
`;

const UploadButtons = styled('div')`
	display: flex;
	justify-content: left;
	margin-top: 1rem;

	button {
		margin-right: 15px;
	}
`;

const AttachedList = styled('div')`
	margin-top: 20px;
	margin-bottom: 40px;

	a {
		color: ${primaryPurple};
		font-size: 0.85rem;
	}

	div + button {
		margin-top: 1rem;
	}
`;

const RemoveFile = styled(IconButton)`
	opacity: 0;
	margin-left: 3rem;
	transition: all 300ms ease;
`;

const Attachment = styled('div')`
	display: flex;
	align-items: center;

	&:hover ${RemoveFile} {
		opacity: 1;
		transition: all 200ms ease;
		margin-left: 1.5rem;
	}
`;

const FileContainer = styled('span')`
	margin-right: 0.7rem;
	margin-bottom: -0.3rem;
`;

const UserCompanyForm = ({data, buttonText, done}) => {
	const {
		name,
		address,
		phone,
		logo,
		banner,
		documents,
		vat,
		siret,
		rcs,
		vatRate,
	} = data;
	const [updateUser] = useMutation(UPDATE_USER_COMPANY);
	const [removeFile] = useMutation(REMOVE_ATTACHMENTS);
	const [isOpenImagePickerModal, setisOpenImagePickerModal] = useState(false);
	const {language} = useUserInfos();

	return (
		<UserCompanyFormMain>
			<Formik
				initialValues={{
					name: name || '',
					phone: phone || '',
					address: address || '',
					vat: vat || '',
					siret: siret || '',
					rcs: rcs || '',
					vatRate,
				}}
				validationSchema={Yup.object().shape({
					name: Yup.string().required(
						<fbt project="inyo" desc="required">
							Requis
						</fbt>,
					),
					phone: Yup.string(),
					vat: Yup.string(),
					vatRate: Yup.number(),
					siret: Yup.string(),
					rcs: Yup.string(),
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
					try {
						await updateUser({
							variables: {
								company: {
									name: values.name,
									phone: values.phone,
									address: {
										...values.address,
										__typename: undefined,
									},
									vat: values.vat,
									vatRate: values.vatRate,
									siret: values.siret,
									rcs: values.rcs,
								},
							},
						});

						window.Intercom('trackEvent', 'updated-company-data');
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
								<fbt project="inyo" desc="something went wrong">
									Quelque chose s'est mal passé
								</fbt>
							),
						});
					}

					done();
				}}
			>
				{(props) => {
					const {status, handleSubmit, setFieldValue} = props;

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
										language={language}
										onChange={setFieldValue}
										name="address"
										values={address}
										placeholder=""
										label={
											<fbt
												project="inyo"
												desc="company address"
											>
												Adresse de la société
											</fbt>
										}
										padded
										required
										style={{
											gridColumn: '1 / 3',
										}}
									/>
									<FormElem
										{...props}
										name="siret"
										type="text"
										label={
											<fbt
												project="inyo"
												desc="company name"
											>
												SIRET
											</fbt>
										}
										placeholder={
											<fbt
												project="inyo"
												desc="company name placeholder"
											>
												123 456 789 12345
											</fbt>
										}
										padded
									/>
									<FormElem
										{...props}
										name="vat"
										type="text"
										label={
											<fbt
												project="inyo"
												desc="phone number"
											>
												N° TVA
											</fbt>
										}
										placeholder={
											<fbt
												project="inyo"
												desc="phone number"
											>
												FR 01 234 567 123
											</fbt>
										}
										padded
									/>
									<FormElem
										{...props}
										name="vatRate"
										type="number"
										label={
											<fbt
												project="inyo"
												desc="phone number"
											>
												Taux TVA
											</fbt>
										}
										placeholder={
											<fbt
												project="inyo"
												desc="phone number"
											>
												20
											</fbt>
										}
										padded
									/>
									<FormElem
										{...props}
										name="rcs"
										type="text"
										label={
											<fbt
												project="inyo"
												desc="phone number"
											>
												RCS
											</fbt>
										}
										placeholder={
											<fbt
												project="inyo"
												desc="phone number"
											>
												RCS Paris 012 345 678
											</fbt>
										}
										padded
									/>
									<div
										style={{
											gridColumn: '1 / 2',
											marginTop: '1rem',
										}}
									>
										<InputLabel>
											<Label>
												<fbt desc="Company's logo form label">
													Logo de la société
												</fbt>
											</Label>
											{logo && (
												<ImageContainer
													width="50%"
													height="50%"
												>
													<img
														src={logo.url}
														alt="Company logo"
													/>
												</ImageContainer>
											)}

											<UploadButtons>
												<UploadDashboardButton
													onUploadFiles={([file]) => updateUser({
														variables: {
															company: {
																logo: file,
															},
														},
														context: {
															hasUpload: true,
														},
													})
													}
													restrictions={{
														maxFileSize: 500 * 1024,
														maxNumberOfFiles: 1,
														allowedFileTypes: [
															'image/*',
															'.jpg',
															'.jpeg',
															'.png',
															'.gif',
														],
													}}
													allowMultipleUploads={false}
													autoProceed
												>
													<fbt desc="Company's logo upload button">
														Charger un logo
													</fbt>
												</UploadDashboardButton>
												{logo && (
													<IconButton
														icon="delete"
														size="tiny"
														color={primaryRed}
														onClick={() => updateUser({
															variables: {
																company: {
																	logo: null,
																},
															},
														})
														}
													/>
												)}
											</UploadButtons>
										</InputLabel>
									</div>
									<div
										style={{
											gridColumn: '2 / 3',
											marginTop: '1rem',
										}}
									>
										<InputLabel>
											<Label>
												<fbt desc="Company's logo form label">
													Bannière de la société
												</fbt>
											</Label>
											{banner && (
												<ImageContainer height="50%">
													<img
														src={
															banner.url
															|| banner.urls.small
														}
														alt="Company banner"
													/>
												</ImageContainer>
											)}
											<UploadButtons>
												<Button
													type="button"
													onClick={() => setisOpenImagePickerModal(
														true,
													)
													}
												>
													<fbt desc="Company's banner upload button">
														Choisir une image
														prédéfinie
													</fbt>
												</Button>

												{isOpenImagePickerModal && (
													<ImagePickerModal
														onDismiss={() => setisOpenImagePickerModal(
															false,
														)
														}
														onSelectImage={({
															id,
														}) => {
															updateUser({
																variables: {
																	company: {
																		bannerUnsplashId: id,
																	},
																},
															});
															setisOpenImagePickerModal(
																false,
															);
														}}
													/>
												)}

												<UploadDashboardButton
													onUploadFiles={([file]) => updateUser({
														variables: {
															company: {
																banner: file,
															},
														},
														context: {
															hasUpload: true,
														},
													})
													}
													restrictions={{
														maxFileSize:
															1024 * 1024,
														maxNumberOfFiles: 1,
														allowedFileTypes: [
															'image/*',
															'.jpg',
															'.jpeg',
															'.png',
															'.gif',
														],
													}}
													allowMultipleUploads={false}
													autoProceed
												>
													<fbt desc="Company's banner upload button">
														Charger une bannière
													</fbt>
												</UploadDashboardButton>

												{banner && (
													<IconButton
														icon="delete"
														size="tiny"
														color={primaryRed}
														onClick={() => updateUser({
															variables: {
																company: {
																	banner: null,
																	bannerUnsplashId: null,
																},
															},
														})
														}
													/>
												)}
											</UploadButtons>
										</InputLabel>
									</div>

									<div
										style={{
											gridColumn: '1 / 3',
											marginTop: '1rem',
										}}
									>
										<Label>
											<fbt desc="Company's admin documents">
												Documents administratifs
											</fbt>
										</Label>

										<AttachedList>
											{documents.map(
												({
													url,
													filename,
													id: attachmentId,
												}) => (
													<Attachment
														key={attachmentId}
													>
														<FileContainer>
															<MaterialIcon
																icon="attachment"
																size="tiny"
																color={
																	accentGrey
																}
															/>
														</FileContainer>
														<a
															href={url}
															target="_blank"
															rel="noopener noreferrer"
														>
															{filename}
														</a>
														<RemoveFile
															icon="delete_forever"
															size="tiny"
															danger
															onClick={async () => {
																await removeFile(
																	{
																		variables: {
																			attachmentId,
																		},
																	},
																);
															}}
														/>
													</Attachment>
												),
											)}
											<UploadDashboardButton
												onUploadFiles={newFiles => updateUser({
													variables: {
														company: {
															documents: newFiles,
														},
													},
													context: {
														hasUpload: true,
													},
												})
												}
											>
												<fbt desc="">
													Joindre un document
												</fbt>
											</UploadDashboardButton>
										</AttachedList>
									</div>
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
									<fbt project="inyo" desc="update">
										Mettre à jour
									</fbt>
								)}
							</UpdateButton>
						</form>
					);
				}}
			</Formik>
		</UserCompanyFormMain>
	);
};

export default UserCompanyForm;
