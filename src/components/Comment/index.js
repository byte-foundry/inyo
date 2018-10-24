import React, {Component} from 'react';
import styled from 'react-emotion';

import {FlexRow, FlexColumn, primaryBlue} from '../../utils/content';

const CommentMain = styled('div')``;
const CommentImage = styled('div')`
	border-radius: 50%;
	background: ${primaryBlue};
	width: 40px;
	height: 40px;
`;
const CommentInfo = styled('div')`
	padding-top: 8px;
`;
const CommentText = styled('div')`
	padding-top: 20px;
`;
const CommentContent = styled(FlexColumn)`
	margin-left: 20px;
`;

class Comment extends Component {
	render() {
		const {
			text,
			author: {firstName, lastName},
		} = this.props.comment;

		return (
			<CommentMain>
				<FlexRow>
					<CommentImage />
					<CommentContent>
						<CommentInfo>
							{firstName} {lastName} a commenté
						</CommentInfo>
						<CommentText>{text}</CommentText>
					</CommentContent>
				</FlexRow>
			</CommentMain>
		);
	}
}

export default Comment;
