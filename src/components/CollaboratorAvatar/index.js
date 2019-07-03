import styled from '@emotion/styled';
import React from 'react';
import Gravatar from 'react-gravatar';

const CollaboratorAvatarContainer = styled('div')`
	border-radius: 50%;
	height: 50px;
	margin-right: 1rem;
	overflow: hidden;
`;

function CollaboratorAvatar({email}) {
	return (
		<CollaboratorAvatarContainer>
			<Gravatar email={email} />
		</CollaboratorAvatarContainer>
	);
}

export default CollaboratorAvatar;
