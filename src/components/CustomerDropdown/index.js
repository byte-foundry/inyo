import styled from '@emotion/styled';
import React from 'react';

import fbt from '../../fbt/fbt.macro';
import {useMutation, useQuery} from '../../utils/apollo-hooks';
import {BREAKPOINTS} from '../../utils/constants';
import {formatFullName} from '../../utils/functions';
import {UPDATE_ITEM} from '../../utils/mutations';
import {
	accentGrey,
	CollaboratorLineRow,
	GenericDropdown,
	primaryPurple,
	primaryWhite,
} from '../../utils/new/design-system';
import {GET_ALL_CUSTOMERS} from '../../utils/queries';
import IconButton from '../IconButton';
import InitialIdentifier from '../InitialIdentifier';

const Actions = styled('div')`
	display: flex;
	flex-direction: row;
	align-items: center;
	justify-content: flex-end;
	flex: 1;
	margin-left: 1rem;

	* ~ * {
		margin-left: 0.2rem;
	}

	@media (max-width: ${BREAKPOINTS.mobile}px) {
		flex-direction: column-reverse;
		justify-content: flex-start;

		* ~ * {
			margin-left: 0;
			margin-bottom: 0.5rem;
		}
	}
`;

const CollaboratorDropdownElem = styled(GenericDropdown)`
	min-width: 250px;
`;

const DropdownCollaboratorLineRow = styled(CollaboratorLineRow)`
	margin: 0rem 0.25rem;
	padding: 0.25rem;
	cursor: pointer;

	&:first-of-type {
		margin-top: 0.25rem;
	}

	&:last-of-type {
		margin-bottom: 0.25rem;
	}

	${props => props.active
		&& `
		background: ${primaryPurple};
		color: ${primaryWhite};
	`}

	&:hover {
		background: ${primaryPurple};
		color: ${primaryWhite};
	}
`;

function CustomerLine({taskId, customer, active}) {
	const [updateItem] = useMutation(UPDATE_ITEM);

	return (
		<DropdownCollaboratorLineRow
			active={active}
			onMouseUp={() => {
				updateItem({
					variables: {
						itemId: taskId,
						linkedCustomerId: active ? null : customer.id,
					},
				});
			}}
		>
			<InitialIdentifier person={customer} size={50} />
			<div>{customer.name}</div>
			{active && (
				<Actions>
					<IconButton icon="close" size="tiny" invert />
				</Actions>
			)}
		</DropdownCollaboratorLineRow>
	);
}

function CollaboratorDropdown({assignee, taskId}) {
	const {data, errors} = useQuery(GET_ALL_CUSTOMERS, {suspend: true});

	if (errors) throw errors;
	const customers = data.me.customers.map(customer => ({
		...customer,
		name: `${customer.name} (${formatFullName(
			customer.title,
			customer.firstName,
			customer.lastName,
		)})`,
	}));

	return (
		<CollaboratorDropdownElem>
			{customers.length > 0
				&& customers.map(customer => (
					<CustomerLine
						key={customer.id}
						customer={customer}
						active={assignee && assignee.id === customer.id}
						taskId={taskId}
					/>
				))}
			{customers.length === 0 && (
				<div style={{padding: '1rem', color: accentGrey}}>
					<fbt project="inyo" desc="missing client on task">
						Vous devez d'abord créer un client.
					</fbt>
				</div>
			)}
		</CollaboratorDropdownElem>
	);
}

export default CollaboratorDropdown;
