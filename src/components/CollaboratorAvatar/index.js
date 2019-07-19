import styled from '@emotion/styled';
import React from 'react';

import InitialIdentifier from '../InitialIdentifier';

const CollaboratorAvatarContainer = styled('div')`
	border-radius: 50%;
	height: ${props => props.size}px;
	width: ${props => props.size}px;
	margin-right: 1rem;
	overflow: hidden;
`;

function CollaboratorAvatar({collaborator, size = 50}) {
	return (
		<CollaboratorAvatarContainer size={size}>
			<InitialIdentifier author={collaborator} size={size} />
		</CollaboratorAvatarContainer>
	);
}

export default CollaboratorAvatar;
