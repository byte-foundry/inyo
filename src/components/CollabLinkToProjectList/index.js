import styled from '@emotion/styled';
import React from 'react';

import {FlexRow} from '../../utils/content';
import {formatFullName} from '../../utils/functions';
import CollaboratorAvatar from '../CollaboratorAvatar';

const CollaboratorEmail = styled('div')`
	align-self: center;
`;

const CollabLinkToProject = styled(FlexRow)`
	margin-top: 0.5rem;
`;

const CollabLinkToProjectList = ({project}) => (
	<CollabLinkToProject>
		{project.collabLinkToProject.map(collaborator => (
				<>
					<CollaboratorAvatar email={collaborator.email} size={30} />
					<CollaboratorEmail>
						{formatFullName(
							undefined,
							collaborator.firstName,
							collaborator.lastName,
						)}
					</CollaboratorEmail>
				</>
		))}
	</CollabLinkToProject>
);

export default CollabLinkToProjectList;
