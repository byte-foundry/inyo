import React, {Component} from 'react';
import styled from 'react-emotion';

import {
	FlexRow,
	FlexColumn,
	primaryWhite,
	primarySalmon,
	primaryNavyBlue,
	gray70,
} from '../../utils/content';

const CommentMain = styled('div')`
	margin-bottom: 20px;
`;
const CommentImage = styled('div')`
	border-radius: 50%;
	background: ${props => (props.isCustomer ? primarySalmon : primaryNavyBlue)};
	width: 40px;
	height: 40px;
	text-align: center;
	line-height: 40px;
	color: ${primaryWhite};
	text-transform: uppercase;
	min-width: 40px;
`;
const CommentInfo = styled('div')`
	font-size: 11px;
	color: ${gray70};
`;
const CommentText = styled('div')`
	padding-top: 2px;
	font-size: 13px;
`;
const CommentContent = styled(FlexColumn)`
	margin-left: 20px;
`;

class Comment extends Component {
	render() {
		const {
			text,
			author: {firstName, lastName},
			createdAt,
		} = this.props.comment;

		const {isCustomer} = this.props;

		return (
			<CommentMain>
				<FlexRow>
					<CommentImage isCustomer={isCustomer}>
						{firstName.charAt(0)}
						{lastName.charAt(0)}
					</CommentImage>
					<CommentContent>
						<CommentInfo>
							{new Date(createdAt).toLocaleDateString('FR-fr')}{' '}
							{new Date(createdAt).toLocaleTimeString('FR-fr')}
						</CommentInfo>
						<CommentText>{text}</CommentText>
					</CommentContent>
				</FlexRow>
			</CommentMain>
		);
	}
}

export default Comment;
