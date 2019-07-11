import styled from '@emotion/styled/macro';
import React, {useState} from 'react';
import {useQuery} from 'react-apollo-hooks';

import AddCollaboratorModal from '../../../components/AddCollaboratorModal';
import ConfirmModal from '../../../components/ConfirmModal';
import IconButton from '../../../components/IconButton';
import {BREAKPOINTS} from '../../../utils/constants';
import Search from '../../../utils/icons/search.svg';
import {
	A,
	accentGrey,
	Button,
	FilterInput,
	Heading,
	HeadingLink,
	HeadingRow,
	lightGrey,
	P,
	primaryBlack,
	primaryPurple,
} from '../../../utils/new/design-system';
import {GET_USER_COLLABORATORS} from '../../../utils/queries';

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

const Actions = styled('div')`
	display: flex;
	flex-direction: row;
	align-items: center;
	justify-content: flex-end;

	* ~ * {
		margin-left: 2rem;
	}

	@media (max-width: ${BREAKPOINTS}px) {
		flex-direction: column-reverse;
		justify-content: flex-start;

		* ~ * {
			margin-left: 0;
			margin-bottom: 0.5rem;
		}
	}
`;

const Forms = styled('div')`
	display: grid;
	grid-template-columns: 50% 1fr;
	align-items: center;
	justify-content: space-between;

	@media (max-width: ${BREAKPOINTS}px) {
		display: flex;
		flex-direction: column;
		align-items: stretch;
		margin-bottom: 2rem;
	}
`;

const SubHeading = styled('h2')`
	color: ${accentGrey};
`;

const Collaborators = () => {
	const {data, error} = useQuery(GET_USER_COLLABORATORS, {suspend: true});

	if (error) throw error;

	const [filter, setFilter] = useState('');
	const [addCollaborator, setAddCollaborator] = useState(false);
	const [confirmRemoveCollaborator, setConfirmRemoveCollaborator] = useState(
		{},
	);
	const [collaboratorToBeRemoved, setCollaboratorToBeRemoved] = useState(
		null,
	);

	const sanitize = str => str
		.toLowerCase()
		.normalize('NFD')
		.replace(/[\u0300-\u036f]/g, '');
	const includesFilter = str => sanitize(str).includes(sanitize(filter));

	const filteredCollaborators = data.me.collaborators.filter(
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
				<HeadingRow>
					<HeadingLink to="/app/customers">Clients</HeadingLink>
					<Heading>Collaborateurs</Heading>
				</HeadingRow>
				<Forms>
					<FilterInput
						icon={Search}
						name="filter"
						placeholder="Filtrer par nom, email..."
						type="text"
						onChange={e => setFilter(e.target.value)}
						value={filter}
					/>
					<Actions>
						<A target="_blank" href="https://inyo.pro">
							Présenter Inyo à un collaborateur
						</A>
						<Button big onClick={() => setAddCollaborator(true)}>
							Inviter un collaborateur
						</Button>
					</Actions>
				</Forms>
				<SubHeading>Collaborateurs</SubHeading>
				<Table>
					<thead>
						<RowHeader>
							<HeaderCell>Prénom et nom</HeaderCell>
							<HeaderCell>Email</HeaderCell>
						</RowHeader>
					</thead>
					<tbody>
						{filteredCollaborators.map(collaborator => (
							<Row
								key={collaborator.id}
								tabIndex="0"
								role="button"
							>
								<Cell>
									{collaborator.firstName}{' '}
									{collaborator.lastName}
								</Cell>
								<Cell>{collaborator.email}</Cell>
								<ActionCell>
									<IconButton icon="edit" size="tiny" />
									<IconButton
										icon="delete_forever"
										size="tiny"
										danger
										data-test="customer-delete"
										onClick={async (e) => {
											e.stopPropagation();

											setCollaboratorToBeRemoved(
												collaborator,
											);

											const confirmed = await new Promise(
												resolve => setConfirmRemoveCollaborator(
													{
														resolve,
													},
												),
											);

											setConfirmRemoveCollaborator({});
											setCollaboratorToBeRemoved(null);

											if (confirmed) {
												// removeCollaborator
											}
										}}
									/>
								</ActionCell>
							</Row>
						))}
					</tbody>
				</Table>
				<SubHeading>Requête envoyées</SubHeading>
				<Table>
					<thead>
						<RowHeader>
							<HeaderCell>Prénom et nom</HeaderCell>
							<HeaderCell>Email</HeaderCell>
							<HeaderCell>Status</HeaderCell>
						</RowHeader>
					</thead>
					<tbody>
						<Row key="a" tabIndex="0" role="button">
							<Cell>Yoyo</Cell>
							<Cell>allo@ouais.fr</Cell>
							<Cell>Non</Cell>
						</Row>
					</tbody>
				</Table>

				{addCollaborator && (
					<AddCollaboratorModal
						onDismiss={() => setAddCollaborator(false)}
					/>
				)}

				{confirmRemoveCollaborator.resolve && (
					<ConfirmModal
						onConfirm={confirmed => confirmRemoveCollaborator.resolve(confirmed)
						}
						onDismiss={() => confirmRemoveCollaborator.resolve(false)
						}
					>
						<P>
							Êtes-vous sûr de vouloir supprimer{' '}
							{collaboratorToBeRemoved.email} ? Tous les projets
							et les tâches associés à ce client se retrouveront
							sans client.
						</P>
						<P>Êtes-vous sûr de vouloir continuer?</P>
					</ConfirmModal>
				)}
			</Container>
		</Main>
	);
};

export default Collaborators;
