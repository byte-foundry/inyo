import styled from '@emotion/styled';
import React from 'react';
import Remarkable from 'remarkable';

import {
	FlexColumn, FlexRow, gray70, gray80,
} from '../../utils/content';
import InitialIdentifier from '../InitialIdentifier';

const CommentMain = styled('div')`
	margin: 20px 0;
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
	return (
		<CommentMain>
			<FlexRow>
				<InitialIdentifier author={author} />
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
