import styled from '@emotion/styled';
import React from 'react';

import {primaryWhite} from '../../utils/content';
import {
	primaryGrey,
	primaryPurple,
	primaryRed,
} from '../../utils/new/design-system';

const CommentImage = styled('div')`
	border-radius: 50%;
	background: ${props => props.color};
	min-width: ${props => props.size}px;
	height: ${props => props.size}px;
	text-align: center;
	line-height: ${props => props.size}px;
	color: ${primaryWhite};
	text-transform: uppercase;
`;

const InitialIdentifier = ({person, size = 40}) => {
	let color = primaryGrey;

	let initials = '?';

	if (person) {
		// eslint-disable-next-line no-underscore-dangle
		const isCustomer = person.__typename === 'Customer';

		color = isCustomer ? primaryRed : primaryPurple;
		initials
			= (person.firstName || '').charAt(0)
			+ (person.lastName || '').charAt(0);
	}

	return (
		<CommentImage color={color} size={size}>
			{initials}
		</CommentImage>
	);
};

export default InitialIdentifier;
