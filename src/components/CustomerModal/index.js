import 'medium-draft/lib/index.css';

import styled from '@emotion/styled';
import {convertToRaw} from 'draft-js';
import {Formik} from 'formik';
import {createEditorState, Editor} from 'medium-draft';
import {BLOCK_BUTTONS} from 'medium-draft/lib/components/toolbar';
import React, {useState} from 'react';
import {useMutation, useQuery} from 'react-apollo-hooks';
import * as Yup from 'yup';

import fbt from '../../fbt/fbt.macro';
import {BREAKPOINTS} from '../../utils/constants';
import {ErrorInput, ModalContainer, ModalElem} from '../../utils/content';
import {CREATE_CUSTOMER, UPDATE_CUSTOMER} from '../../utils/mutations';
import {
	BackButton,
	Button,
	Label,
	primaryGrey,
	SubHeading,
} from '../../utils/new/design-system';
import {GET_ALL_CUSTOMERS} from '../../utils/queries';
import FormElem from '../FormElem';
import FormSelect from '../FormSelect';

const Header = styled(SubHeading)`
	margin-bottom: 2rem;
`;

const CreateCustomerForm = styled('div')`
	display: grid;
	grid-template-columns: 125px 1fr 1fr;
	grid-column-gap: 20px;

	@media (max-width: ${BREAKPOINTS}px) {
		display: contents;
	}
`;

const Buttons = styled('div')`
	display: flex;
	justify-content: flex-end;
`;

BLOCK_BUTTONS.unshift({
	description: 'Heading 1',
	icon: 'header',
	label: 'H1',
	style: 'header-one',
});
BLOCK_BUTTONS.unshift({
	description: 'Heading 2',
	icon: 'header',
	label: 'H2',
	style: 'header-two',
});

const NotesFormLabel = styled(Label)`
	margin-bottom: 10px;
`;

const NotesForm = styled('div')`
	border: 1px solid ${primaryGrey};
	grid-column: 1 / 4;
	margin-bottom: 10px;
`;

const CustomerModal = ({
	selectedCustomerId,
	onDismiss,
	onValidate = () => {},
	onCustomerWasCreated,
	noSelect,
	withBack,
	customer,
}) => {
	const {data, error} = useQuery(GET_ALL_CUSTOMERS, {
		skip: noSelect,
		suspend: true,
	});
	const [updateCustomer] = useMutation(UPDATE_CUSTOMER);
	const [createCustomer] = useMutation(CREATE_CUSTOMER);
	const customerNotNull = customer || {}; // This is important because js is dumb and default parameters do not replace null
	const [editorState, setEditorState] = useState(
		createEditorState(
			customerNotNull.userNotes && customerNotNull.userNotes.blocks
				? customerNotNull.userNotes
				: undefined,
		),
	);

	let options = [];

	if (!noSelect) {
		if (error) throw error;

		const {customers} = data.me;

		options = customers.map(c => ({
			value: c.id,
			label: c.name,
		}));
	}

	let formTitle = (
		<fbt project="inyo" desc="Create a new client form title">
			Ou créer un nouveau client
		</fbt>
	);

	if (noSelect && customerNotNull.id) {
		formTitle = (
			<fbt project="inyo" desc="Edit a client form title">
				Éditer un client
			</fbt>
		);
	}
	else if (noSelect) {
		formTitle = (
			<fbt project="inyo" desc="Create a new client form title">
				Créer un nouveau client
			</fbt>
		);
	}

	return (
		<ModalContainer onDismiss={onDismiss}>
			<ModalElem>
				{withBack && (
					<BackButton withMargin grey link onClick={onDismiss}>
						<fbt project="inyo" desc="back">
							Retour
						</fbt>
					</BackButton>
				)}
				<Formik
					initialValues={{
						customerId: selectedCustomerId,
						name: customerNotNull.name || '',
						title: customerNotNull.title || null,
						firstName: customerNotNull.firstName || '',
						lastName: customerNotNull.lastName || '',
						email: customerNotNull.email || '',
						phone: customerNotNull.phone || '',
						occupation: customerNotNull.occupation || '',
					}}
					validate={(values) => {
						if (
							values.customerId
							&& options.find(
								option => option.value === values.customerId,
							)
						) {
							return {};
						}

						try {
							Yup.object({
								name: Yup.string().required('Requis'),
								title: Yup.string().nullable(),
								firstName: Yup.string(),
								lastName: Yup.string(),
								email: Yup.string()
									.email(
										<fbt
											project="inyo"
											desc="invalid email"
										>
											Email invalide
										</fbt>,
									)
									.required(
										<fbt project="inyo" desc="required">
											Requis
										</fbt>,
									),
								occupation: Yup.string(),
								phone: Yup.string(),
							}).validateSync(values, {abortEarly: false});

							if (
								!values.title
								&& !values.firstName
								&& !values.lastName
							) {
								return {
									title: (
										<fbt project="inyo" desc="required">
											Requis
										</fbt>
									),
									firstName: (
										<fbt project="inyo" desc="required">
											Requis
										</fbt>
									),
									lastName: (
										<fbt project="inyo" desc="required">
											Requis
										</fbt>
									),
								};
							}

							return {};
						}
						catch (err) {
							return err.inner.reduce((errors, errorContent) => {
								errors[errorContent.path]
									= errorContent.message;
								return errors;
							}, {});
						}
					}}
					onSubmit={async (values, actions) => {
						actions.setSubmitting(true);

						if (values.customerId) {
							onValidate({id: values.customerId});
							onDismiss();
						}
						else if (customer && customer.id) {
							updateCustomer({
								variables: {
									...customer,
									name: values.name,
									title: values.title,
									firstName: values.firstName,
									lastName: values.lastName,
									email: values.email,
									phone: values.phone,
									occupation: values.occupation,
									userNotes: convertToRaw(
										editorState.getCurrentContent(),
									),
								},
							});
							onValidate(customer);
							onDismiss();
						}
						else {
							const {
								data: {createCustomer: createdCustomer},
							} = await createCustomer({
								variables: {
									name: values.name,
									title: values.title,
									firstName: values.firstName,
									lastName: values.lastName,
									email: values.email,
									phone: values.phone,
									occupation: values.occupation,
									userNotes: convertToRaw(
										editorState.getCurrentContent(),
									),
								},
							});

							onCustomerWasCreated(createdCustomer);
						}

						actions.setSubmitting(false);
					}}
				>
					{(props) => {
						const {values, status, isSubmitting} = props;

						return (
							<form onSubmit={props.handleSubmit}>
								{!noSelect && (
									<>
										<Header>
											<fbt
												project="inyo"
												desc="Choose an existing customer"
											>
												Choisir un client existant
											</fbt>
										</Header>
										<FormSelect
											{...props}
											name="customerId"
											placeholder={
												<fbt
													project="inyo"
													desc="Customer modal client select placeholder"
												>
													Tous les clients
												</fbt>
											}
											options={options}
											hideSelectedOptions
											isSearchable
											isClearable
											style={{marginBottom: '30px'}}
										/>
									</>
								)}
								{!values.customerId && (
									<>
										<Header>{formTitle}</Header>
										<CreateCustomerForm>
											<FormElem
												{...props}
												label={
													<fbt
														project="inyo"
														desc="Customer modal company name label"
													>
														Nom de l'entreprise
													</fbt>
												}
												type="text"
												required
												name="name"
												style={{gridColumn: '1 / 4'}}
											/>
											<FormSelect
												{...props}
												label="Civilité"
												name="title"
												options={[
													{
														value: 'MONSIEUR',
														label: (
															<fbt
																project="inyo"
																desc="label mister"
															>
																M.
															</fbt>
														),
													},
													{
														value: 'MADAME',
														label: (
															<fbt
																project="inyo"
																desc="label mrs"
															>
																Mme
															</fbt>
														),
													},
												]}
												isClearable
												style={{gridColumn: '1 / 2'}}
											/>
											<FormElem
												{...props}
												label={
													<fbt
														project="inyo"
														desc="label customer modal first name contact"
													>
														Le prénom de votre
														contact
													</fbt>
												}
												name="firstName"
												placeholder="John"
												style={{gridColumn: '2 / 3'}}
											/>
											<FormElem
												{...props}
												label={
													<fbt
														project="inyo"
														desc="label customer modal last name contact"
													>
														Le nom de votre contact
													</fbt>
												}
												name="lastName"
												placeholder="Doe"
												style={{gridColumn: '3 / 4'}}
											/>
											<FormElem
												{...props}
												label={
													<fbt
														project="inyo"
														desc="label customer modal email contact"
													>
														Son email
													</fbt>
												}
												name="email"
												placeholder="contact@company.com"
												required
												style={{gridColumn: '2 / 4'}}
											/>
											<FormElem
												{...props}
												label={
													<fbt
														project="inyo"
														desc="label customer modal phone contact"
													>
														Son numéro de téléphone
													</fbt>
												}
												name="phone"
												placeholder="08 36 65 65 65"
												style={{gridColumn: '2 / 4'}}
											/>
											<FormElem
												{...props}
												label={
													<fbt
														project="inyo"
														desc="label customer modal position contact"
													>
														Son poste
													</fbt>
												}
												name="occupation"
												placeholder="Comptable"
												style={{gridColumn: '2 / 4'}}
											/>
											<NotesFormLabel>
												<fbt
													project="inyo"
													desc="customer modal title notes"
												>
													Notes
												</fbt>
											</NotesFormLabel>
											<NotesForm data-test="customer-notes">
												<Editor
													editorEnabled
													editorState={editorState}
													onChange={newState => setEditorState(newState)
													}
													sideButtons={[]}
													toolbarConfig={{
														block: [
															'header-one',
															'header-two',
															'header-three',
															'ordered-list-item',
															'unordered-list-item',
															'blockquote',
														],
														inline: [
															'BOLD',
															'ITALIC',
															'UNDERLINE',
															'hyperlink',
															'HIGHLIGHT',
														],
													}}
													placeholder={
														<fbt
															project="inyo"
															desc="customer modal placeholder contact notes"
														>
															Notes personnelles à
															propos de ce
															client...
														</fbt>
													}
												/>
											</NotesForm>
										</CreateCustomerForm>
										{status && status.msg && (
											<ErrorInput>
												{status.msg}
											</ErrorInput>
										)}
									</>
								)}

								<Buttons>
									{selectedCustomerId && (
										<Button
											red
											aligned
											type="button"
											onClick={() => {
												onValidate({
													id: null,
												});
												onDismiss();
											}}
										>
											<fbt
												project="inyo"
												desc="customer modal remove customer"
											>
												Enlever le client
											</fbt>
										</Button>
									)}
									<Button
										type="submit"
										aligned
										disabled={isSubmitting}
									>
										<fbt
											project="inyo"
											desc="customer modal confirm modification"
										>
											Valider
										</fbt>
									</Button>
								</Buttons>
							</form>
						);
					}}
				</Formik>
			</ModalElem>
		</ModalContainer>
	);
};

CustomerModal.defaultProps = {
	customer: {},
};

export default CustomerModal;
