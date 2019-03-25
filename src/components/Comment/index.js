import React from 'react';
import styled from '@emotion/styled';
import Remarkable from 'remarkable';

import {
	FlexRow,
	FlexColumn,
	primaryWhite,
	gray70,
	gray80,
} from '../../utils/content';

import {primaryPurple, primaryRed} from '../../utils/new/design-system';

const CommentMain = styled('div')`
	margin: 20px 0;
`;
const CommentImage = styled('div')`
	border-radius: 50%;
	background: ${props => (props.isCustomer ? primaryRed : primaryPurple)};
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

function Comment({
	comment: {
		text,
		author: {firstName, lastName},
		createdAt,
	},
	isCustomer,
}) {
	return (
		<CommentMain>
			<FlexRow>
				<CommentImage isCustomer={isCustomer}>
					{firstName && firstName.charAt(0)}
					{lastName && lastName.charAt(0)}
				</CommentImage>
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
