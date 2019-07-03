import styled from '@emotion/styled';
import React from 'react';

import {BREAKPOINTS} from '../../utils/constants';
import {Button} from '../../utils/new/design-system';
import CollaboratorAvatar from '../CollaboratorAvatar';
import IconButton from '../IconButton';

const Actions = styled('div')`
	display: flex;
	flex-direction: row;
	align-items: center;
	justify-content: flex-end;
	flex: 1;

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

const CollaboratorLineRow = styled('div')`
	display: flex;
	align-items: center;
	margin-bottom: 2rem;
`;

function CollaboratorLine({collaborator, isNew}) {
	return (
		<CollaboratorLineRow>
			<CollaboratorAvatar email={collaborator.email} />
			<div>{collaborator.name}</div>
			<Actions>
				{isNew && (
					<>
						<Button red>Ce n'est pas la bonne personne</Button>
						<Button icon="✓">Confirmer</Button>
					</>
				)}
				{collaborator.collaborationStatus
					=== 'COLLABORATION_ACCEPTED' && (
					<IconButton icon="delete" size="small" />
				)}
				{collaborator.collaborationStatus
					=== 'WAITING_FOR_CONFIRMATION' && (
					<>
						<div>En attente</div>
						<Button>Renvoyer l'email</Button>
					</>
				)}
				{collaborator.collaborationStatus
					=== 'COLLABORATION_REJECTED' && (
					<>
						<div>A rejeté la collaboration</div>
					</>
				)}
			</Actions>
		</CollaboratorLineRow>
	);
}

function CollaboratorList({collaborators}) {
	return (
		<div>
			<CollaboratorLine
				collaborator={{
					email: 'yorunohikage@gmail.com',
					name: 'New Zboub',
				}}
				isNew
			/>
			{collaborators.map(c => (
				<CollaboratorLine collaborator={c} />
			))}
		</div>
	);
}

export default CollaboratorList;
