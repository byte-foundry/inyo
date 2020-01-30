import styled from '@emotion/styled/macro';
import React, {useState} from 'react';

import AddCollaboratorModal from '../../../components/AddCollaboratorModal';
import ConfirmModal from '../../../components/ConfirmModal';
import IconButton from '../../../components/IconButton';
import fbt from '../../../fbt/fbt.macro';
import {useMutation, useQuery} from '../../../utils/apollo-hooks';
import {BREAKPOINTS, collabStatuses} from '../../../utils/constants';
import {formatCollabStatus, formatName} from '../../../utils/functions';
import Search from '../../../utils/icons/search.svg';
import {
	ACCEPT_COLLAB_REQUEST,
	CANCEL_REQUEST_COLLAB,
	REJECT_COLLAB_REQUEST,
	REMOVE_COLLABORATION,
} from '../../../utils/mutations';
import {
	A,
	accentGrey,
	Actions,
	Button,
	FilterInput,
	Heading,
	HeadingLink,
	HeadingRow,
	lightGrey,
	P,
	primaryBlack,
	primaryPurple,
	SubHeading,
} from '../../../utils/new/design-system';
import {GET_USER_COLLABORATORS} from '../../../utils/queries';

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

	@media (max-width: ${BREAKPOINTS.mobile}px) {
		margin: 0 auto 3.5rem auto;
	}
`;

const Table = styled('table')`
	border-collapse: collapse;
	text-align: left;
	width: 100%;
	margin: 1rem 0 2rem;

	th,
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

	@media (max-width: ${BREAKPOINTS.mobile}px) {
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
	justify-content: flex-end;
	align-items: center;
	opacity: ${props => (props.unhidden ? 1 : 0)};

	@media (max-width: ${BREAKPOINTS.mobile}px) {
		flex-direction: column;
		button + button {
			margin-left: 0;
		}
	}
`;

const Row = styled('tr')`
	cursor: pointer;
	color: ${primaryBlack};
	border-bottom: 2px solid ${lightGrey};
	position: relative;
	line-height: 1.6;

	td {
		padding: 0.25rem 0;

		@media (max-width: ${BREAKPOINTS.mobile}px) {
			&:first-of-type {
				color: ${primaryPurple};
			}
		}
	}

	:hover {
		color: ${primaryPurple};

		${ActionCell} {
			opacity: 1;
		}
	}

	@media (max-width: ${BREAKPOINTS.mobile}px) {
		display: grid;
		padding-bottom: 1rem;
	}
`;

const Forms = styled('div')`
	display: grid;
	grid-template-columns: 50% 1fr;
	align-items: center;
	justify-content: space-between;

	@media (max-width: ${BREAKPOINTS.mobile}px) {
		display: flex;
		flex-direction: column-reverse;
		align-items: stretch;
		margin-bottom: 2rem;
	}
`;

const Collaborators = () => {
	const {data, error} = useQuery(GET_USER_COLLABORATORS, {suspend: true});
	const [acceptCollabRequest] = useMutation(ACCEPT_COLLAB_REQUEST);
	const [rejectCollabRequest] = useMutation(REJECT_COLLAB_REQUEST);
	const [removeCollab] = useMutation(REMOVE_COLLABORATION);
	const [cancelRequestCollab] = useMutation(CANCEL_REQUEST_COLLAB);

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
		({firstName, lastName, email}) => includesFilter(firstName || '')
			|| includesFilter(lastName || '')
			|| includesFilter(email),
	);

	const filteredCollaboratorRequests = data.me.collaboratorRequests.filter(
		({status, requestee, requesteeEmail}) => (requestee
			? includesFilter(requestee.firstName || '')
				  || includesFilter(requestee.lastName || '')
				  || includesFilter(requestee.email)
			: includesFilter(requesteeEmail))
			&& status !== collabStatuses.CANCELED
			&& status !== collabStatuses.ACCEPTED,
	);

	const filteredCollaborationRequests = data.me.collaborationRequests.filter(
		({status, requester: {firstName, lastName, email}}) => (includesFilter(firstName || '')
				|| includesFilter(lastName || '')
				|| includesFilter(email))
			&& status !== collabStatuses.CANCELED
			&& status !== collabStatuses.ACCEPTED,
	);

	return (
		<Main>
			<Container>
				<HeadingRow>
					<Heading>
						<fbt project="inyo" desc="Collaborateurs">
							Collaborateurs
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
								Présenter Inyo à un collaborateur
							</fbt>
						</A>
						<Button big onClick={() => setAddCollaborator(true)}>
							<fbt project="inyo" desc="invite">
								Inviter un collaborateur
							</fbt>
						</Button>
					</Actions>
				</Forms>
				<SubHeading>
					<fbt project="inyo" desc="collaborators">
						Collaborateurs
					</fbt>
				</SubHeading>
				<Table>
					<thead>
						<RowHeader>
							<HeaderCell>
								<fbt project="inyo" desc="full name">
									Prénom et nom
								</fbt>
							</HeaderCell>
							<HeaderCell>
								<fbt project="inyo" desc="email">
									Email
								</fbt>
							</HeaderCell>
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
												removeCollab({
													variables: {
														collaboratorId:
															collaborator.id,
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
				<SubHeading>
					<fbt project="inyo" desc="request">
						Requêtes reçues
					</fbt>
				</SubHeading>
				<Table>
					<thead>
						<RowHeader>
							<HeaderCell>
								<fbt project="inyo" desc="full name">
									Prénom et nom
								</fbt>
							</HeaderCell>
							<HeaderCell>
								<fbt project="inyo" desc="email">
									Email
								</fbt>
							</HeaderCell>
							<HeaderCell>
								<fbt project="inyo" desc="status">
									Status
								</fbt>
							</HeaderCell>
						</RowHeader>
					</thead>
					<tbody>
						{filteredCollaborationRequests.map(
							({
								status,
								id,
								requester: {firstName, lastName, email},
							}) => (
								<Row key="a" tabIndex="0" role="button">
									<Cell>
										{formatName(firstName, lastName)}
									</Cell>
									<Cell>{email}</Cell>
									<ActionCell unhidden>
										{status !== collabStatuses.REJECTED ? (
											<>
												<Button
													aligned
													onClick={() => acceptCollabRequest({
														variables: {
															requestId: id,
														},
													})
													}
												>
													Accepter
												</Button>
												<Button
													onClick={() => rejectCollabRequest({
														variables: {
															requestId: id,
														},
													})
													}
													red
												>
													Rejeter
												</Button>
											</>
										) : (
											formatCollabStatus(status)
										)}
									</ActionCell>
								</Row>
							),
						)}
					</tbody>
				</Table>
				<SubHeading>
					<fbt project="inyo" desc="request">
						Requêtes envoyées
					</fbt>
				</SubHeading>
				<Table>
					<thead>
						<RowHeader>
							<HeaderCell>
								<fbt project="inyo" desc="full name">
									Prénom et nom
								</fbt>
							</HeaderCell>
							<HeaderCell>
								<fbt project="inyo" desc="email">
									Email
								</fbt>
							</HeaderCell>
							<HeaderCell>
								<fbt project="inyo" desc="status">
									Statut
								</fbt>
							</HeaderCell>
						</RowHeader>
					</thead>
					<tbody>
						{filteredCollaboratorRequests.map(
							({
								id, status, requestee, requesteeEmail,
							}) => (
								<Row key="a" tabIndex="0" role="button">
									<Cell>
										{requestee ? (
											formatName(
												requestee.firstName,
												requestee.lastName,
											)
										) : (
											<>&mdash;</>
										)}
									</Cell>
									<Cell>
										{requesteeEmail || requestee.email}
									</Cell>
									<Cell>{formatCollabStatus(status)}</Cell>
									<Cell>
										<Button
											onClick={() => cancelRequestCollab({
												variables: {
													collabRequestId: id,
												},
											})
											}
										>
											<fbt project="inyo" desc="cancel">
												Annuler
											</fbt>
										</Button>
									</Cell>
								</Row>
							),
						)}
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
							<fbt project="inyo" desc="notification message">
								Êtes-vous sûr de vouloir supprimer{' '}
								<fbt:param name="email">
									{collaboratorToBeRemoved.email}
								</fbt:param>{' '}
								? Tous les projets et les tâches assignées à ce
								collaborateur seront desassignées.
							</fbt>
						</P>
						<P>
							<fbt project="inyo" desc="continue">
								Êtes-vous sûr de vouloir continuer?
							</fbt>
						</P>
					</ConfirmModal>
				)}
			</Container>
		</Main>
	);
};

export default Collaborators;
