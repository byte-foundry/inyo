import React, { Component } from "react";
import styled from "react-emotion";
import { Query, Mutation } from "react-apollo";
import { withRouter } from "react-router-dom";
import * as Yup from "yup";
import { Formik } from "formik";

import { GET_COMMENTS_BY_ITEM } from "../../utils/queries";
import { POST_COMMENT } from "../../utils/mutations";

import { ReactComponent as CloseIcon } from "../../utils/icons/close.svg";

import {
	ModalContainer,
	ModalElem,
	ModalCloseIcon,
	ModalRow,
	H2,
} from '../../utils/content';

import Comment from "../Comment";


class CommentModal extends Component {
	closeCommentModal = () => {
		this.props.closeCommentModal();
	};

	render() {
		const { itemId, customerToken, taskName } = this.props;

		return (
			<Query
				query={GET_COMMENTS_BY_ITEM}
				variables={{ itemId, token: customerToken }}
			>
				{({ loading, error, data }) => {
					if (loading) return <span></span>;
					if (error) return <p>Error!: ${error.toString()}</p>;

					const { itemComments } = data;

					const commentsElem = itemComments.map(comment => (
						<Comment
							key={`comment${comment.id}`}
							comment={comment}
							isCustomer={
								comment.author.__typename === "Customer"
							}
						/>
					));

					return (
						<ModalContainer>
							<ModalElem>
								<ModalRow>
									<H2>Commentaires</H2>
								</ModalRow>
								<ModalRow>{commentsElem}</ModalRow>
								<ModalCloseIcon
									onClick={this.closeCommentModal}
								>
									<CloseIcon />
								</ModalCloseIcon>
							</ModalElem>
						</ModalContainer>
					);
				}}
			</Query>
		);
	}
}

export default withRouter(CommentModal);
