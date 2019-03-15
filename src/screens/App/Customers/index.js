import React, {useState} from 'react';
import styled from '@emotion/styled';
import {useQuery, useMutation} from 'react-apollo-hooks';

import {
	Heading,
	primaryPurple,
	accentGrey,
	lightGrey,
	Input,
	Button,
	primaryBlack,
} from '../../../utils/new/design-system';
import CustomerModal from '../../../components/CustomerModal';
import Pencil from '../../../utils/icons/pencil.svg';

import {GET_USER_CUSTOMERS} from '../../../utils/queries';
import {CREATE_CUSTOMER, UPDATE_CUSTOMER} from '../../../utils/mutations';

const Main = styled('div')`
	min-height: 100vh;
	padding: 0 10rem;
`;

const Container = styled('div')`
	max-width: 980px;
`;

const Table = styled('table')`
	border-collapse: collapse;
	text-align: left;
	width: 100%;
`;

const RowHeader = styled('tr')`
	border-top: 2px solid ${lightGrey};
	border-bottom: 2px solid ${lightGrey};
`;

const HeaderCell = styled('th')`
	font-weight: normal;
	color: ${accentGrey};
`;

const Row = styled('tr')`
	cursor: pointer;
	color: ${primaryBlack};
	border-bottom: 2px solid ${lightGrey};
	position: relative;
	line-height: 1.6;

	:hover {
		color: ${primaryPurple};

		&:after {
			content: '';
			display: block;
			background-color: ${accentGrey};
			mask-size: 35%;
			mask-position: center;
			mask-repeat: no-repeat;
			mask-image: url(${Pencil});
			position: absolute;
			top: 0;
			bottom: 0;
			width: 50px;
		}
	}
`;

const Cell = styled('td')`
	:empty::before {
		content: '\\2014';
	}
`;

const Forms = styled('div')`
	display: flex;
	align-items: center;
	justify-content: space-between;
`;

const FilterInput = styled(Input)`
	margin: 3rem 0;
	padding: 0.25rem 1rem;
	border-radius: 1.5rem;
	width: 50%;
`;

const Customers = () => {
	const {data, error} = useQuery(GET_USER_CUSTOMERS);
	const createCustomer = useMutation(CREATE_CUSTOMER);
	const updateCustomer = useMutation(UPDATE_CUSTOMER);

	if (error) throw error;

	const [filter, setFilter] = useState('');
	const [isEditingCustomer, setEditCustomer] = useState(false);
	const [customerToEdit, setCustomerToEdit] = useState(null);

	const filteredCustomers = data.me.customers.filter(
		({
			name, firstName, lastName, email,
		}) => name.includes(filter)
			|| firstName.includes(filter)
			|| lastName.includes(filter)
			|| email.includes(filter),
	);

	return (
		<Main>
			<Container>
				<Heading>Clients</Heading>
				<Forms>
					<FilterInput
						name="filter"
						placeholder="Filtrer par nom, email..."
						type="text"
						onChange={e => setFilter(e.target.value)}
						value={filter}
					/>
					<Button big onClick={() => setEditCustomer(true)}>
						Créer un nouveau client
					</Button>
				</Forms>
				<Table>
					<thead>
						<RowHeader>
							<HeaderCell>Raison sociale</HeaderCell>
							<HeaderCell>Référent·e</HeaderCell>
							<HeaderCell>Email</HeaderCell>
							<HeaderCell>Téléphone</HeaderCell>
						</RowHeader>
					</thead>
					<tbody>
						{filteredCustomers.map(customer => (
							<Row
								key={customer.id}
								tabIndex="0"
								role="button"
								onClick={() => {
									setCustomerToEdit(customer);
									setEditCustomer(true);
								}}
							>
								<Cell>{customer.name}</Cell>
								<Cell>
									{customer.firstName} {customer.lastName}
								</Cell>
								<Cell>{customer.email}</Cell>
								<Cell>{customer.phone}</Cell>
							</Row>
						))}
					</tbody>
				</Table>

				{isEditingCustomer && (
					<CustomerModal
						noSelect
						customer={customerToEdit}
						onValidate={async (selected) => {
							if (customerToEdit && selected.customer) {
								await updateCustomer({
									variables: {
										...customerToEdit,
										...selected.customer,
									},
								});

								setCustomerToEdit(null);
								setEditCustomer(false);
							}
							else if (selected.customer) {
								await createCustomer({
									variables: selected.customer,
									update(
										cache,
										{
											data: {
												createCustomer: addedCustomer,
											},
										},
									) {
										const query = cache.readQuery({
											query: GET_USER_CUSTOMERS,
											variables: {},
										});

										query.me.customers.push(addedCustomer);

										cache.writeQuery({
											query: GET_USER_CUSTOMERS,
											variables: {},
											data: query,
										});
									},
								});

								setEditCustomer(false);
							}
						}}
						onDismiss={() => {
							setCustomerToEdit(null);
							setEditCustomer(false);
						}}
					/>
				)}
			</Container>
		</Main>
	);
};

export default Customers;
