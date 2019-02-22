import React, {useState} from 'react';
import {useQuery} from 'react-apollo-hooks';
import styled from '@emotion/styled';
import Select from 'react-select';
import * as Yup from 'yup';
import {Formik} from 'formik';

import {ModalContainer, ModalElem, ErrorInput} from '../../utils/content';
import FormElem from '../FormElem';
import FormSelect from '../FormSelect';
import {
	primaryPurple,
	primaryWhite,
	SubHeading,
	Button,
} from '../../utils/new/design-system';

import {GET_ALL_CUSTOMERS} from '../../utils/queries';

const customSelectStyles = {
	dropdownIndicator: styles => ({
		...styles,
		color: primaryPurple,
		paddingTop: 0,
		paddingBottom: 0,
	}),
	clearIndicator: styles => ({
		...styles,
		color: primaryPurple,
		paddingTop: 0,
		paddingBottom: 0,
	}),
	// option: (styles, state) => ({
	// 	...styles,
	// 	backgroundColor: state.isSelected ? primaryPurple : primaryWhite,
	// 	color: state.isSelected ? primaryWhite : primaryPurple,

	// 	':hover, :active, :focus': {
	// 		color: primaryWhite,
	// 		backgroundColor: primaryPurple,
	// 	},
	// }),
	placeholder: styles => ({
		...styles,
		color: '#888',
		fontStyle: 'italic',
		fontSize: '14px',
	}),
	singleValue: styles => ({
		...styles,
		color: primaryPurple,
	}),
	input: styles => ({
		...styles,
		padding: 0,
	}),
	control: styles => ({
		...styles,
		border: 'none',
		backgroundColor: '#f5f2fe',
		borderRadius: '20px',
		':hover, :focus, :active': {
			border: 'none',
		},
	}),
	indicatorSeparator: () => ({
		backgroundColor: 'transparent',
	}),
	// menu: styles => ({
	// 	...styles,
	// 	fontSize: '14px',
	// }),
	// valueContainer: styles => ({
	// 	...styles,
	// 	padding: 0,
	// }),
};

const Header = styled(SubHeading)`
	margin: 2rem 0;
`;

const CreateCustomerForm = styled('div')`
	display: grid;
	grid-template-columns: repeat(3, 1fr);
`;

const CustomerModal = ({selectedCustomerId, onDismiss, onValidate}) => {
	const [currentCustomerId, selectCustomer] = useState(selectedCustomerId);
	const {data, error} = useQuery(GET_ALL_CUSTOMERS);
	const newCustomer = null;

	if (error) throw error;

	const {customers} = data.me;

	const options = customers.map(customer => ({
		value: customer.id,
		label: customer.name,
	}));
	const selectedItem = options.find(item => item.value === currentCustomerId);

	return (
		<ModalContainer onDismiss={onDismiss}>
			<ModalElem>
				<Formik
					initialValues={{
						name: '',
						title: null,
						firstName: '',
						lastName: '',
						email: '',
						phone: '',
					}}
					validationSchema={Yup.object({
						name: Yup.string().required('Requis'),
						title: Yup.string(),
						firstName: Yup.string().required('Requis'),
						lastName: Yup.string().required('Requis'),
						email: Yup.string()
							.email('Email invalide')
							.required('Requis'),
						phone: Yup.string(),
					})}
					onSubmit={async (values, actions) => {}}
				>
					{(props) => {
						const {
							values,
							setFieldValue,
							status,
							isSubmitting,
						} = props;

						return (
							<form onSubmit={props.handleSubmit}>
								<Header>Choisir un client existant</Header>
								<Select
									placeholder="Tous les clients"
									options={options}
									styles={customSelectStyles}
									value={selectedItem}
									hideSelectedOptions
									isSearchable
									isClearable
									onChange={selected => selectCustomer(
										selected && selected.value,
									)
									}
								/>
								<Header>Ou créer un nouveau client</Header>
								<CreateCustomerForm>
									<FormElem
										{...props}
										label="Nom"
										type="text"
										required
										name="customer.label"
									/>
									<FormSelect
										{...props}
										label="Civilité"
										name="title"
										paddedRight
										options={[
											{
												value: undefined,
												label: '',
											},
											{
												value: 'MONSIEUR',
												label: 'M.',
											},
											{
												value: 'MADAME',
												label: 'Mme',
											},
										]}
									/>
									<FormElem
										{...props}
										label="Le prénom de votre contact"
										name="firstName"
										placeholder="John"
									/>
									<FormElem
										{...props}
										label="Le nom de votre contact"
										name="lastName"
										placeholder="Doe"
									/>
									<FormElem
										{...props}
										label="Son email"
										name="email"
										placeholder="contact@company.com"
										required
									/>
									<FormElem
										{...props}
										label="Son numéro de téléphone"
										name="phone"
										placeholder="08 36 65 65 65"
									/>
								</CreateCustomerForm>
								{status && status.msg && (
									<ErrorInput>{status.msg}</ErrorInput>
								)}

								<Button
									type="submit"
									disabled={isSubmitting}
									onClick={() => {
										onValidate({
											customerId: currentCustomerId,
											customer: newCustomer,
										});
									}}
								>
									Valider
								</Button>
							</form>
						);
					}}
				</Formik>
			</ModalElem>
		</ModalContainer>
	);
};

export default CustomerModal;
