import React, {useState} from 'react';
import {useQuery, useMutation} from 'react-apollo-hooks';
import styled from '@emotion/styled';
import * as Yup from 'yup';
import {Formik} from 'formik';
import {convertToRaw} from 'draft-js';
import {Editor, createEditorState} from 'medium-draft';
import {BLOCK_BUTTONS} from 'medium-draft/lib/components/toolbar';
import 'medium-draft/lib/index.css';

import {ModalContainer, ModalElem, ErrorInput} from '../../utils/content';
import FormElem from '../FormElem';
import FormSelect from '../FormSelect';
import {
	SubHeading,
	Button,
	Label,
	primaryGrey,
	BackButton,
} from '../../utils/new/design-system';

import {GET_ALL_CUSTOMERS} from '../../utils/queries';
import {CREATE_CUSTOMER, UPDATE_CUSTOMER} from '../../utils/mutations';
import {BREAKPOINTS} from '../../utils/constants';

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
	const updateCustomer = useMutation(UPDATE_CUSTOMER);
	const createCustomer = useMutation(CREATE_CUSTOMER);
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

	let formTitle = 'Ou créer un nouveau client';

	if (noSelect && customerNotNull.id) {
		formTitle = 'Éditer un client';
	}
	else if (noSelect) {
		formTitle = 'Créer un nouveau client';
	}

	return (
		<ModalContainer onDismiss={onDismiss}>
			<ModalElem>
				{withBack && (
					<BackButton withMargin grey link onClick={onDismiss}>
						Retour
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
									.email('Email invalide')
									.required('Requis'),
								occupation: Yup.string(),
								phone: Yup.string(),
							}).validateSync(values, {abortEarly: false});

							if (
								!values.title
								&& !values.firstName
								&& !values.lastName
							) {
								return {
									title: 'Requis',
									firstName: 'Requis',
									lastName: 'Requis',
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
											Choisir un client existant
										</Header>
										<FormSelect
											{...props}
											name="customerId"
											placeholder="Tous les clients"
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
												label="Nom"
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
														label: 'M.',
													},
													{
														value: 'MADAME',
														label: 'Mme',
													},
												]}
												isClearable
												style={{gridColumn: '1 / 2'}}
											/>
											<FormElem
												{...props}
												label="Le prénom de votre contact"
												name="firstName"
												placeholder="John"
												style={{gridColumn: '2 / 3'}}
											/>
											<FormElem
												{...props}
												label="Le nom de votre contact"
												name="lastName"
												placeholder="Doe"
												style={{gridColumn: '3 / 4'}}
											/>
											<FormElem
												{...props}
												label="Son email"
												name="email"
												placeholder="contact@company.com"
												required
												style={{gridColumn: '2 / 4'}}
											/>
											<FormElem
												{...props}
												label="Son numéro de téléphone"
												name="phone"
												placeholder="08 36 65 65 65"
												style={{gridColumn: '2 / 4'}}
											/>
											<FormElem
												{...props}
												label="Son poste"
												name="occupation"
												placeholder="Comptable"
												style={{gridColumn: '2 / 4'}}
											/>
											<NotesFormLabel>
												Notes
											</NotesFormLabel>
											<NotesForm>
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
													placeholder="Notes personnelles à propos de ce client..."
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
											type="button"
											onClick={() => {
												onValidate({
													id: null,
												});
												onDismiss();
											}}
										>
											Enlever le client
										</Button>
									)}
									<Button
										type="submit"
										disabled={isSubmitting}
									>
										Valider
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
