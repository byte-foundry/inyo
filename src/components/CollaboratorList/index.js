import styled from '@emotion/styled';
import React from 'react';
import {useMutation} from 'react-apollo-hooks';

import {BREAKPOINTS} from '../../utils/constants';
import {formatFullName} from '../../utils/functions';
import {LINK_TO_PROJECT, REMOVE_LINK_TO_PROJECT} from '../../utils/mutations';
import {Button, CollaboratorLineRow} from '../../utils/new/design-system';
import CollaboratorAvatar from '../CollaboratorAvatar';
import MaterialIcon from '../MaterialIcon';

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

function CollaboratorLine({collaborator: {collaborator, isLinked}, projectId}) {
	const [linkToProject] = useMutation(LINK_TO_PROJECT);
	const [removeLinkToProject] = useMutation(REMOVE_LINK_TO_PROJECT);

	return (
		<CollaboratorLineRow
			onClick={() => {
				if (isLinked) {
					removeLinkToProject({
						variables: {
							collaboratorId: collaborator.id,
							projectId,
						},
					});
				}
				else {
					linkToProject({
						variables: {
							collaboratorId: collaborator.id,
							projectId,
						},
					});
				}
			}}
		>
			<CollaboratorAvatar email={collaborator.email} />
			<div>
				{formatFullName(
					undefined,
					collaborator.firstName,
					collaborator.lastName,
				)}
			</div>
			<Actions>
				{isLinked && <MaterialIcon icon="done" size="small" />}
			</Actions>
		</CollaboratorLineRow>
	);
}

function CollaboratorList({collaborators, projectId}) {
	return (
		<div>
			{collaborators.map(c => (
				<CollaboratorLine collaborator={c} projectId={projectId} />
			))}
		</div>
	);
}

export default CollaboratorList;
