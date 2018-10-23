import React, {Component} from 'react';
import styled from 'react-emotion';
import {Query} from 'react-apollo';
import {withRouter} from 'react-router-dom';

import {GET_COMMENTS_BY_ITEM} from '../../utils/queries';

import {
	ModalContainer,
	ModalElem,
	ModalCloseIcon,
	H2,
} from '../../utils/content.js';

import Comment from '../Comment';

const CommentRow = styled('div')`
	padding-left: 40px;
	padding-right: 40px;
	padding-top: 5px;
	padding-bottom: 5px;
`;

class CommentModal extends Component {
	closeCommentModal = () => {
		console.log('out');
		this.props.history.push(
			`/app/quotes/${this.props.match.params.quoteId}/view/${
				this.props.match.params.customerToken
			}`,
		);
	};

	render() {
		const {itemId, customerToken} = this.props.match.params;

		return (
			<Query
				query={GET_COMMENTS_BY_ITEM}
				variables={{itemId, token: customerToken}}
			>
				{({loading, error, data}) => {
					if (loading) return <p>Chargement...</p>;
					if (error) return <p>Error!: ${error.toString()}</p>;

					const {itemComments} = data;

					const commentsElem = itemComments.map(comment => (
						<Comment comment={comment} />
					));

					return (
						<ModalContainer>
							<ModalElem>
								<CommentRow>
									<H2>Commentaires</H2>
								</CommentRow>
								<CommentRow>{commentsElem}</CommentRow>
								<ModalCloseIcon
									onClick={this.closeCommentModal}
								/>
							</ModalElem>
						</ModalContainer>
					);
				}}
			</Query>
		);
	}
}

export default withRouter(CommentModal);
