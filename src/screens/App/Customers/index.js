import styled from '@emotion/styled/macro';
import React, {useState} from 'react';

import ConfirmModal from '../../../components/ConfirmModal';
import CustomerModalAndMail from '../../../components/CustomerModalAndMail';
import HelpButton from '../../../components/HelpButton';
import IconButton from '../../../components/IconButton';
import fbt from '../../../fbt/fbt.macro';
import {useMutation, useQuery} from '../../../utils/apollo-hooks';
import {BREAKPOINTS} from '../../../utils/constants';
import Search from '../../../utils/icons/search.svg';
import {REMOVE_CUSTOMER} from '../../../utils/mutations';
import {
	A,
	accentGrey,
	ActionCell,
	Actions,
	Button,
	Cell,
	FilterInput,
	HeaderCell,
	Heading,
	HeadingLink,
	HeadingRow,
	lightGrey,
	P,
	primaryBlack,
	primaryPurple,
	Row,
	RowHeader,
	Table,
} from '../../../utils/new/design-system';
import {GET_USER_CUSTOMERS} from '../../../utils/queries';

const Main = styled('div')`
	min-height: 100vh;
	display: flex;
	flex: 1;

	@media (max-width: ${BREAKPOINTS.mobile}px) {
		padding: 1rem;
	}
`;

const Container = styled('div')`
	flex: 1;
	max-width: 1200px;
	margin: 3.5rem auto;
`;

const Forms = styled('div')`
	display: grid;
	grid-template-columns: 50% 1fr;
	align-items: center;
	justify-content: space-between;

	@media (max-width: ${BREAKPOINTS.mobile}px) {
		display: flex;
		flex-direction: column;
		align-items: stretch;
		margin-bottom: 2rem;
	}
`;

const Customers = () => {
	const {data, error} = useQuery(GET_USER_CUSTOMERS, {suspend: true});
	const [removeCustomer] = useMutation(REMOVE_CUSTOMER);

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
			<HelpButton />
			<Container>
				<HeadingRow>
					<Heading>
						<fbt project="inyo" desc="clients">
							Clients
						</fbt>
					</Heading>
				</HeadingRow>
				<Forms>
					<FilterInput
						icon={Search}
						name="filter"
						placeholder={
							<fbt project="inyo" desc="filter">
								Filtrer par nom, email...
							</fbt>
						}
						type="text"
						onChange={e => setFilter(e.target.value)}
						value={filter}
					/>
					<Actions>
						<A
							target="_blank"
							href={fbt('https://inyo.pro', 'inyo pro link')}
						>
							<fbt project="inyo" desc="present">
								Présenter Inyo à un client
							</fbt>
						</A>
						<Button big onClick={() => setEditCustomer(true)}>
							<fbt project="inyo" desc="create client">
								Créer un nouveau client
							</fbt>
						</Button>
					</Actions>
				</Forms>
				<Table>
					<thead>
						<RowHeader>
							<HeaderCell>
								<fbt project="inyo" desc="company name">
									Raison sociale
								</fbt>
							</HeaderCell>
							<HeaderCell>
								<fbt project="inyo" desc="contact name">
									Référent·e
								</fbt>
							</HeaderCell>
							<HeaderCell>
								<fbt project="inyo" desc="email">
									Email
								</fbt>
							</HeaderCell>
							<HeaderCell>
								<fbt project="inyo" desc="phone number">
									Téléphone
								</fbt>
							</HeaderCell>
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
									<IconButton icon="edit" size="tiny" />
									<IconButton
										icon="delete_forever"
										size="tiny"
										danger
										data-test="customer-delete"
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
						close={() => {
							setCustomerToEdit(null);
							setEditCustomer(false);
						}}
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
							<fbt project="inyo" desc="confirm message intro">
								Êtes-vous sûr de vouloir supprimer{' '}
								<fbt:param name="email">
									{customerToBeRemoved.email}
								</fbt:param>{' '}
								? Tous les projets et les tâches associés à ce
								client se retrouveront sans client.
							</fbt>
						</P>
						<P>
							<fbt project="inyo" desc="confirm message">
								Êtes-vous sûr de vouloir continuer?
							</fbt>
						</P>
					</ConfirmModal>
				)}
			</Container>
		</Main>
	);
};

export default Customers;
