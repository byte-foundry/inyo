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

const Header = styled(SubHeading)`
	margin: 2rem 0;
`;

const CreateCustomerForm = styled('div')`
	display: grid;
	grid-template-columns: 125px 1fr 1fr;
	grid-column-gap: 20px;
`;

const Buttons = styled('div')`
	display: flex;
	justify-content: flex-end;
`;

const CustomerModal = ({selectedCustomerId, onDismiss, onValidate}) => {
	const {data, error} = useQuery(GET_ALL_CUSTOMERS);

	if (error) throw error;

	const {customers} = data.me;

	const options = customers.map(customer => ({
		value: customer.id,
		label: customer.name,
	}));

	return (
		<ModalContainer onDismiss={onDismiss}>
			<ModalElem>
				<Formik
					initialValues={{
						customerId: selectedCustomerId,
						name: '',
						title: null,
						firstName: '',
						lastName: '',
						email: '',
						phone: '',
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
								firstName: Yup.string().required('Requis'),
								lastName: Yup.string().required('Requis'),
								email: Yup.string()
									.email('Email invalide')
									.required('Requis'),
								phone: Yup.string(),
							}).validateSync(values, {abortEarly: false});

							return {};
						}
						catch (err) {
							return err.inner.reduce((errors, error) => {
								errors[error.path] = error.message;
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
								<Header>Choisir un client existant</Header>
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
								{!values.customerId && (
									<>
										<Header>
											Ou créer un nouveau client
										</Header>
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
												required
												style={{gridColumn: '2 / 3'}}
											/>
											<FormElem
												{...props}
												label="Le nom de votre contact"
												name="lastName"
												placeholder="Doe"
												required
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

export default CustomerModal;
