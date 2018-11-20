import React, {Component} from 'react';
import styled from 'react-emotion';

import {comment} from 'postcss';
import {primaryWhite, primaryBlue, gray20} from '../../utils/content';

const CommentIconMain = styled('div')`
	background: ${props => (props.commentLength > 0 ? '#3860ff' : gray20)};
	color: ${primaryWhite};
	padding: 5px;
	width: 18px;
	height: 10px;
	position: relative;
	display: flex;
	justify-content: center;
	align-items: center;
	cursor: pointer;
	margin-left: 1em;

	&::before {
		content: "${props => (props.commentLength > 0 ? '' : '+')}";
		position: relative;
		font-weight: bold;
		font-size: 14px;
		color: ${primaryBlue};
	}

	&::after {
		border-top: solid 5px
			${props => (props.commentLength > 0 ? '#3860ff' : gray20)};
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
				comment => !comment.views.find(e => e.viewer.__typename === userType),
			).length;
		}
		return (
			<CommentIconMain
				commentLength={commentLength}
				onClick={(e) => {
					this.props.onClick(e);
				}}
			>
				{commentLength !== 0 && commentLength}
			</CommentIconMain>
		);
	}
}

export default CommentIcon;
