import styled from '@emotion/styled';
import React from 'react';
import Gravatar from 'react-gravatar';

const CollaboratorAvatarContainer = styled('div')`
	border-radius: 50%;
	height: ${props => props.size}px;
	width: ${props => props.size}px;
	margin-right: 1rem;
	overflow: hidden;
`;

function CollaboratorAvatar({email, size = 50}) {
	return (
		<CollaboratorAvatarContainer size={size}>
			<Gravatar email={email} size={size} />
		</CollaboratorAvatarContainer>
	);
}

export default CollaboratorAvatar;
