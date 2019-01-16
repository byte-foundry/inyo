import React, {Component} from 'react';
import styled from 'react-emotion';

import {
	primaryWhite,
	primaryBlue,
	primaryNavyBlue,
	gray20,
} from '../../utils/content';

const CommentIconMain = styled('div')`
	background: ${props => (props.unreadCommentLength > 0 ? '#3860ff' : gray20)};
	color: ${props => (props.unreadCommentLength > 0 ? primaryWhite : primaryNavyBlue)};
	padding: 5px;
	flex: 0 0 18px;
	width: 18px;
	height: 10px;
	position: relative;
	display: flex;
	justify-content: center;
	align-items: center;
	cursor: pointer;
	margin-left: 1em;

	&::before {
		content: "${props => (props.commentsLength > 0 ? '' : '+')}";
		position: relative;
		font-weight: 800;
		font-size: 14px;
		color: ${primaryBlue};
	}

	&::after {
		border-top: solid 5px
			${props => (props.unreadCommentLength > 0 ? '#3860ff' : gray20)};
		border-left: solid 5px transparent;
		border-right: solid 5px transparent;
		content: '';
		height: 0px;
		width: 0px;
		position: absolute;
		bottom: -5px;
		display: block;
	}
`;

class CommentIcon extends Component {
	render() {
		const {comments, userType} = this.props;
		let commentLength = 0;

		if (comments && comments.length !== 0) {
			commentLength = comments.filter(
				comment => !comment.views.find(e => e.viewer.__typename === userType), // eslint-disable-line no-underscore-dangle
			).length;
		}
		return (
			<CommentIconMain
				unreadCommentLength={commentLength}
				commentsLength={comments.length}
				onClick={(e) => {
					this.props.onClick(e);
				}}
			>
				{comments.length !== 0 && comments.length}
			</CommentIconMain>
		);
	}
}

export default CommentIcon;
