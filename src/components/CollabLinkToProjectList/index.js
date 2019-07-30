import styled from '@emotion/styled';
import React from 'react';

import {FlexRow} from '../../utils/content';
import {formatName} from '../../utils/functions';
import CollaboratorAvatar from '../CollaboratorAvatar';

const CollaboratorEmail = styled('div')`
	align-self: center;
`;

const CollabLinkToProject = styled(FlexRow)`
	margin-top: 0.5rem;
`;

const CollabLinkToProjectList = ({project}) => (
	<div>
		{project.linkedCollaborators.map(collaborator => (
			<CollabLinkToProject key={collaborator.id}>
				<CollaboratorAvatar collaborator={collaborator} size={30} />
				<CollaboratorEmail>
					{formatName(collaborator.firstName, collaborator.lastName)}
				</CollaboratorEmail>
			</CollabLinkToProject>
		))}
	</div>
);

export default CollabLinkToProjectList;
