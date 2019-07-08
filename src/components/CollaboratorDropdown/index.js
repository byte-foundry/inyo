import styled from '@emotion/styled';
import React from 'react';

import {BREAKPOINTS} from '../../utils/constants';
import {
	CollaboratorLineRow,
	GenericDropdown,
	primaryPurple,
	primaryWhite,
} from '../../utils/new/design-system';
import CollaboratorAvatar from '../CollaboratorAvatar';
import IconButton from '../IconButton';
import Tooltip from '../Tooltip';

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

	@media (max-width: ${BREAKPOINTS}px) {
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

function CollaboratorLine({collaborator, active}) {
	return (
		<DropdownCollaboratorLineRow active={active}>
			<CollaboratorAvatar email={collaborator.email} />
			<div>{collaborator.name}</div>
			{active && (
				<Actions>
					<Tooltip label="Renvoyer l'email de notification">
						<IconButton icon="email" size="tiny" invert />
					</Tooltip>
					<IconButton icon="close" size="tiny" invert />
				</Actions>
			)}
		</DropdownCollaboratorLineRow>
	);
}

function CollaboratorDropdown({collaborators = []}) {
	return (
		<CollaboratorDropdownElem>
			<CollaboratorLine
				active
				collaborator={{
					email: 'francois.poizat@gmail.com',
					name: 'zboub',
				}}
			/>
			{collaborators.map(collab => (
				<CollaboratorLine collaborator={collab} />
			))}
		</CollaboratorDropdownElem>
	);
}

export default CollaboratorDropdown;
