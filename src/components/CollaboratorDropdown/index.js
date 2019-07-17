import styled from '@emotion/styled';
import React, {useCallback} from 'react';
import {useMutation} from 'react-apollo-hooks';

import {BREAKPOINTS} from '../../utils/constants';
import {formatFullName} from '../../utils/functions';
import {
	ASSIGN_TO_TASK,
	REMOVE_ASSIGNEMENT_TO_TASK,
} from '../../utils/mutations';
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

function CollaboratorLine({taskId, collaborator, active}) {
	const [assignToTask] = useMutation(ASSIGN_TO_TASK);
	const [removeAssignementToTask] = useMutation(REMOVE_ASSIGNEMENT_TO_TASK);
	const assignOrUnassign = useCallback(() => {
		if (active) {
			removeAssignementToTask({
				variables: {
					taskId,
					collaboratorId: collaborator.id,
				},
			});
		}
		else {
			assignToTask({
				variables: {
					taskId,
					collaboratorId: collaborator.id,
				},
			});
		}
	}, [active, collaborator]);

	return (
		<DropdownCollaboratorLineRow active={active} onClick={assignOrUnassign}>
			<CollaboratorAvatar email={collaborator.email} />
			<div>
				{formatFullName(
					undefined,
					collaborator.firstName,
					collaborator.lastName,
				)}
			</div>
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

function CollaboratorDropdown({collaborators = [], assignee, taskId}) {
	return (
		<CollaboratorDropdownElem>
			{collaborators.map(collab => (
				<CollaboratorLine
					collaborator={collab}
					active={assignee && assignee.id === collab.id}
					taskId={taskId}
				/>
			))}
		</CollaboratorDropdownElem>
	);
}

export default CollaboratorDropdown;
