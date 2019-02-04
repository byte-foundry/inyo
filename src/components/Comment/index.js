import React, {Component} from 'react';
import styled from '@emotion/styled';
import Remarkable from 'remarkable';

import {
	FlexRow,
	FlexColumn,
	primaryWhite,
	primarySalmon,
	primaryNavyBlue,
	gray70,
	gray80,
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
}

export default Comment;
