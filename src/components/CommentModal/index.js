import React, {Component} from 'react';
import styled from 'react-emotion';
import {Query, Mutation} from 'react-apollo';
import {withRouter} from 'react-router-dom';
import * as Yup from 'yup';
import {Formik} from 'formik';

import {GET_COMMENTS_BY_ITEM} from '../../utils/queries';
import {POST_COMMENT} from '../../utils/mutations';

import {ReactComponent as CloseIcon} from '../../utils/icons/close.svg';

import {
	ModalContainer,
	ModalElem,
	ModalCloseIcon,
	H4,
	Button,
	gray20,
	primaryWhite,
	gray80,
	ErrorInput,
	FlexRow,
} from '../../utils/content';

import Comment from '../Comment';

const CommentRow = styled('div')`
	padding-left: 20px;
	padding-right: 40px;
	padding-top: 5px;
	padding-bottom: 5px;
`;

const Comments = styled('div')`
	max-height: 60vh;
	overflow-y: auto;
`;

const ItemComment = styled('textarea')`
	margin-top: 10px;
	margin-left: 80px;
	width: 100%;
	background: ${primaryWhite};
	border: 1px solid ${gray20};
	padding: 15px 10px;
	font-family: 'Ligne';
	color: ${gray80};
	margin-bottom: 10px;
`;

const ActionButton = styled(Button)`
	margin-bottom: 10px;
	padding-left: 10px;
	padding-right: 10px;
`;

class CommentModal extends Component {
	closeCommentModal = () => {
		this.props.closeCommentModal();
	};

	render() {
		const {itemId, customerToken, taskName} = this.props;

		return (
			<Query
				query={GET_COMMENTS_BY_ITEM}
				variables={{itemId, token: customerToken}}
			>
				{({loading, error, data}) => {
					if (loading) return <span />;
					if (error) {
						throw new Error(error);
					}

					const {itemComments} = data;

					const commentsElem = itemComments.map(comment => (
						<Comment
							key={`comment${comment.id}`}
							comment={comment}
							isCustomer={
								comment.author.__typename === 'Customer' // eslint-disable-line no-underscore-dangle
							}
						/>
					));

					return (
						<ModalContainer>
							<ModalElem>
								<CommentRow>
									<H4>{taskName}</H4>
								</CommentRow>
								<Comments>
									<CommentRow>{commentsElem}</CommentRow>
								</Comments>
								<Mutation mutation={POST_COMMENT}>
									{postCommentMutation => (
										<Formik
											initialValues={{
												newComment: '',
											}}
											validationSchema={Yup.object().shape(
												{
													newComment: Yup.string().required(
														'Requis',
													),
												},
											)}
											onSubmit={async (
												values,
												actions,
											) => {
												actions.setSubmitting(false);
												try {
													postCommentMutation({
														variables: {
															itemId,
															token: customerToken,
															comment: {
																text:
																	values.newComment,
															},
														},
														update: (
															cache,
															{
																data: {
																	postComment,
																},
															},
														) => {
															window.$crisp.push([
																'set',
																'session:event',
																[
																	[
																		[
																			'comment_sent',
																			{
																				from: customerToken
																					? 'Customer'
																					: 'User',
																			},
																			'purple',
																		],
																	],
																],
															]);
															const commentsQueryResult = cache.readQuery(
																{
																	query: GET_COMMENTS_BY_ITEM,
																	variables: {
																		itemId,
																		token: customerToken,
																	},
																},
															);

															commentsQueryResult.itemComments
																= postComment.comments;
															try {
																cache.writeQuery(
																	{
																		query: GET_COMMENTS_BY_ITEM,
																		variables: {
																			itemId,
																			token: customerToken,
																		},
																		commentsQueryResult,
																	},
																);
																actions.resetForm();
															}
															catch (e) {
																throw e;
															}
														},
													});
												}
												catch (commentError) {
													actions.setSubmitting(
														false,
													);
													actions.setErrors(
														commentError,
													);
													actions.setStatus({
														msg:
															"Une erreur c'est produit pendant la soumission du commentaire",
													});
												}
											}}
										>
											{(props) => {
												const {
													touched,
													errors,
													handleSubmit,
													setFieldValue,
													values,
												} = props;

												return (
													<form
														onSubmit={handleSubmit}
													>
														<FlexRow>
															<ItemComment
																placeholder="Votre commentaire"
																value={
																	values.newComment
																}
																name="newComment"
																onChange={e => setFieldValue(
																	'newComment',
																	e.target
																		.value,
																)
																}
															/>
														</FlexRow>

														{errors.comment
															&& touched.comment && (
															<ErrorInput>
																{
																	errors.comment
																}
															</ErrorInput>
														)}
														<FlexRow justifyContent="flex-end">
															<ActionButton
																theme="Primary"
																size="Medium"
																type="submit"
															>
																Envoyer
															</ActionButton>
														</FlexRow>
													</form>
												);
											}}
										</Formik>
									)}
								</Mutation>
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
