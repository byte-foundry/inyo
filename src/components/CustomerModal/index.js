import React from 'react';
import {useQuery} from 'react-apollo-hooks';
import styled from '@emotion/styled';
import * as Yup from 'yup';
import {Formik} from 'formik';

import {ModalContainer, ModalElem, ErrorInput} from '../../utils/content';
import FormElem from '../FormElem';
import FormSelect from '../FormSelect';
import {SubHeading, Button} from '../../utils/new/design-system';

import {GET_ALL_CUSTOMERS} from '../../utils/queries';
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

const CustomerModal = ({
	selectedCustomerId,
	onDismiss,
	onValidate,
	noSelect,
	customer,
}) => {
	const {data, error} = useQuery(GET_ALL_CUSTOMERS, {skip: noSelect});
	const customerNotNull = customer || {}; // This is important because js is dumb and default parameters do not replace null

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
				<Formik
					initialValues={{
						customerId: selectedCustomerId,
						name: customerNotNull.name || '',
						title: customerNotNull.title || null,
						firstName: customerNotNull.firstName || '',
						lastName: customerNotNull.lastName || '',
						email: customerNotNull.email || '',
						phone: customerNotNull.phone || '',
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
								errors[error.path] = errorContent.message;
								return errors;
							}, {});
						}
					}}
					onSubmit={async (values, actions) => {
						actions.setSubmitting(true);

						await onValidate({
							customerId: values.customerId,
							customer: {
								name: values.name,
								title: values.title,
								firstName: values.firstName,
								lastName: values.lastName,
								email: values.email,
								phone: values.phone,
							},
						});

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
											onClick={() => onValidate({
												customerId: null,
												customer: null,
											})
											}
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
