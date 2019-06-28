import styled from '@emotion/styled';
import React from 'react';
import Remarkable from 'remarkable';

import {
	FlexColumn,
	FlexRow,
	gray70,
	gray80,
	primaryWhite,
} from '../../utils/content';
import {
	primaryGrey,
	primaryPurple,
	primaryRed,
} from '../../utils/new/design-system';

const CommentMain = styled('div')`
	margin: 20px 0;
`;
const CommentImage = styled('div')`
	border-radius: 50%;
	background: ${props => props.color};
	width: 40px;
	height: 40px;
	text-align: center;
	line-height: 40px;
	color: ${primaryWhite};
	text-transform: uppercase;
	min-width: 40px;
`;
const CommentInfo = styled('time')`
	font-size: 13px;
	margin-bottom: 5px;
	color: ${gray70};
`;
const CommentText = styled('div')`
	padding-top: 2px;
	font-size: 15px;
	line-height: 1.5;
	color: ${gray80};
	p {
		margin-top: 0;
	}
`;
const CommentContent = styled(FlexColumn)`
	margin-left: 20px;
`;

function Comment({comment: {text, author, createdAt}}) {
	let color = primaryGrey;

	let initials = '?';

	if (author) {
		// eslint-disable-next-line no-underscore-dangle
		const isCustomer = author.__typename === 'Customer';

		color = isCustomer ? primaryRed : primaryPurple;
		initials
			= (author.firstName || '').charAt(0)
			+ (author.lastName || '').charAt(0);
	}

	return (
		<CommentMain>
			<FlexRow>
				<CommentImage color={color}>{initials}</CommentImage>
				<CommentContent>
					<CommentInfo dateTime={createdAt}>
						{new Date(createdAt).toLocaleString()}
					</CommentInfo>
					<CommentText
						className="content"
						dangerouslySetInnerHTML={{
							__html: new Remarkable({linkify: true}).render(
								text,
							),
						}}
					/>
				</CommentContent>
			</FlexRow>
		</CommentMain>
	);
}

export default Comment;
