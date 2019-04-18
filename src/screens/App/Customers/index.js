import React, {useState} from 'react';
import styled from '@emotion/styled/macro';
import {useQuery, useMutation} from 'react-apollo-hooks';

import {
	Heading,
	primaryPurple,
	accentGrey,
	lightGrey,
	FilterInput,
	Button,
	primaryBlack,
	P,
} from '../../../utils/new/design-system';
import CustomerModalAndMail from '../../../components/CustomerModalAndMail';
import ConfirmModal from '../../../components/ConfirmModal';
import Search from '../../../utils/icons/search.svg';
import {ReactComponent as PencilIcon} from '../../../utils/icons/pencil.svg';
import {ReactComponent as TrashIcon} from '../../../utils/icons/trash-icon.svg';

import {GET_USER_CUSTOMERS} from '../../../utils/queries';
import {
	CREATE_CUSTOMER,
	UPDATE_CUSTOMER,
	REMOVE_CUSTOMER,
} from '../../../utils/mutations';

import {BREAKPOINTS} from '../../../utils/constants';

const Main = styled('div')`
	min-height: 100vh;

	@media (max-width: ${BREAKPOINTS}px) {
		padding: 1rem;
	}
`;

const Container = styled('div')`
	max-width: 980px;
	margin: 0 auto;
`;

const Table = styled('table')`
	border-collapse: collapse;
	text-align: left;
	width: 100%;
`;

const RowHeader = styled('tr')`
	border-top: 2px solid ${lightGrey};
	border-bottom: 2px solid ${lightGrey};

	&:after {
		content: '';
		display: block;
		background: none;
		width: 50px;
	}

	@media (max-width: ${BREAKPOINTS}px) {
		display: none;
	}
`;

const HeaderCell = styled('th')`
	font-weight: normal;
	color: ${accentGrey};
`;

const Cell = styled('td')`
	:empty::before {
		content: '\\2014';
	}
`;

const ActionCell = styled(Cell)`
	display: flex;
	align-items: center;
`;

const Row = styled('tr')`
	cursor: pointer;
	color: ${primaryBlack};
	border-bottom: 2px solid ${lightGrey};
	position: relative;
	line-height: 1.6;

	td {
		padding: 0.25rem 0;

		@media (max-width: ${BREAKPOINTS}px) {
			&:first-of-type {
				color: ${primaryPurple};
			}
		}
	}

	${ActionCell} {
		opacity: 0;
	}

	:hover {
		color: ${primaryPurple};

		${ActionCell} {
			opacity: 1;
		}
	}

	@media (max-width: ${BREAKPOINTS}px) {
		display: grid;
		padding-bottom: 1rem;
	}
`;

const Forms = styled('div')`
	display: flex;
	flex-direction: row-reverse;
	align-items: center;
	justify-content: space-between;

	@media (max-width: ${BREAKPOINTS}px) {
		flex-direction: column;
		margin-bottom: 1rem;
	}
`;

const EditIcon = styled(PencilIcon)`
	width: 18px;
	padding: 0 5px;

	path {
		fill: ${accentGrey};
	}
`;

const DeleteIcon = styled(TrashIcon)`
	path {
		fill: ${accentGrey};
	}
`;

const Customers = () => {
	const {data, error} = useQuery(GET_USER_CUSTOMERS, {suspend: true});
	const createCustomer = useMutation(CREATE_CUSTOMER);
	const updateCustomer = useMutation(UPDATE_CUSTOMER);
	const removeCustomer = useMutation(REMOVE_CUSTOMER);

	if (error) throw error;

	const [filter, setFilter] = useState('');
	const [isEditingCustomer, setEditCustomer] = useState(false);
	const [customerToEdit, setCustomerToEdit] = useState(null);
	const [confirmRemoveCustomer, setConfirmRemoveCustomer] = useState({});
	const [customerToBeRemoved, setCustomerToBeRemoved] = useState(null);

	const sanitize = str => str
		.toLowerCase()
		.normalize('NFD')
		.replace(/[\u0300-\u036f]/g, '');
	const includesFilter = str => sanitize(str).includes(sanitize(filter));

	const filteredCustomers = data.me.customers.filter(
		({
			name, firstName, lastName, email,
		}) => includesFilter(name)
			|| includesFilter(firstName || '')
			|| includesFilter(lastName || '')
			|| includesFilter(email),
	);

	return (
		<Main>
			<Container>
				<Heading>Clients</Heading>
				<Forms>
					<Button big onClick={() => setEditCustomer(true)}>
						Créer un nouveau client
					</Button>
					<FilterInput
						icon={Search}
						name="filter"
						placeholder="Filtrer par nom, email..."
						type="text"
						onChange={e => setFilter(e.target.value)}
						value={filter}
					/>
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
								<ActionCell>
									<EditIcon />
									<DeleteIcon
										onClick={async (e) => {
											e.stopPropagation();

											setCustomerToBeRemoved(customer);

											const confirmed = await new Promise(
												resolve => setConfirmRemoveCustomer({
													resolve,
												}),
											);

											setConfirmRemoveCustomer({});
											setCustomerToBeRemoved(null);

											if (confirmed) {
												removeCustomer({
													variables: {
														id: customer.id,
													},
												});
											}
										}}
									/>
								</ActionCell>
							</Row>
						))}
					</tbody>
				</Table>

				{isEditingCustomer && (
					<CustomerModalAndMail
						noSelect
						customer={customerToEdit}
						onValidate={async () => {
							setCustomerToEdit(null);
						}}
						onDismiss={() => {
							setCustomerToEdit(null);
							setEditCustomer(false);
						}}
					/>
				)}

				{confirmRemoveCustomer.resolve && (
					<ConfirmModal
						onConfirm={confirmed => confirmRemoveCustomer.resolve(confirmed)
						}
						onDismiss={() => confirmRemoveCustomer.resolve(false)}
					>
						<P>
							Êtes-vous sûr de vouloir supprimer{' '}
							{customerToBeRemoved.email} ? Tous les projets et
							les tâches associés à ce client se retrouveront sans
							client.
						</P>
						<P>Êtes-vous sûr de vouloir continuer?</P>
					</ConfirmModal>
				)}
			</Container>
		</Main>
	);
};

export default Customers;
