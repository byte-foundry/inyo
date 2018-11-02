import React, {Component} from 'react';
import styled from 'react-emotion';

import {primaryWhite, gray20} from '../../utils/content';

const CommentIconMain = styled('div')`
	background: ${props => props.comments && props.comments.length > 0 ? '#3860ff' : gray20};
	color: ${primaryWhite};
	padding: 5px;
	width: 18px;
	height: 10px;
	position: relative;
	display: flex;
	justify-content: center;
	align-items: center;
	cursor: pointer;

	&:after {
		border-top: solid 5px ${props => props.comments && props.comments.length > 0 ? '#3860ff' : gray20};
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
		const {comments} = this.props;
		return (
			<CommentIconMain comments={this.props.comments} onClick={() => {this.props.onClick()}}>
			{comments && comments.length !== 0 && comments.length}
			</CommentIconMain>
		);
	}
}

export default CommentIcon;
