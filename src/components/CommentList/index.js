import React, {Component} from 'react';
import styled from '@emotion/styled';
import {Query, Mutation} from 'react-apollo';
import * as Yup from 'yup';
import {Formik} from 'formik';
import ReactTooltip from 'react-tooltip';

import {GET_COMMENTS_BY_ITEM} from '../../utils/queries';
import {POST_COMMENT} from '../../utils/mutations';
import {TOOLTIP_DELAY} from '../../utils/constants';

import {
	gray20,
	primaryWhite,
	gray50,
	gray80,
	primaryBlue,
	ErrorInput,
	FlexRow,
} from '../../utils/content';
import {Button, primaryPurple} from '../../utils/new/design-system';

import Comment from '../Comment';

const CommentRow = styled('div')`
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
	width: 100%;
	background: ${primaryWhite};
	border: 1px solid ${gray20};
	padding: 15px;
	font-family: 'Work Sans', sans-serif;
	font-size: 12px;
	line-height: 1.6;
	color: ${gray80};
	margin-bottom: 10px;
`;

const Empty = styled('p')`
	color: ${primaryPurple};
`;

class CommentList extends Component {
	render() {
		const {itemId, customerToken} = this.props;

		return (
			<Query
				query={GET_COMMENTS_BY_ITEM}
				variables={{itemId, token: customerToken}}
			>
				{({loading, error, data}) => {
					if (loading) return <span />;
					if (error) throw error;

					const {itemComments} = data;

					const comments = itemComments.map(comment => (
						<Comment
							key={`comment${comment.id}`}
							comment={comment}
							isCustomer={
								comment.author.__typename === 'Customer' // eslint-disable-line no-underscore-dangle
							}
						/>
					));

					return (
						<>
							<ReactTooltip
								effect="solid"
								delayShow={TOOLTIP_DELAY}
							/>
							<Comments id="comments">
								{comments.length ? (
									<CommentRow>{comments}</CommentRow>
								) : (
									<Empty>
										Une question ou une suggestion? Ajoutez
										un commentaire.
									</Empty>
								)}
							</Comments>
							<Mutation mutation={POST_COMMENT}>
								{postCommentMutation => (
									<Formik
										initialValues={{
											newComment: '',
										}}
										validationSchema={Yup.object().shape({
											newComment: Yup.string().required(
												'Requis',
											),
										})}
										onSubmit={async (values, actions) => {
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
														{data: {postComment}},
													) => {
														window.Intercom(
															'trackEvent',
															'comment-sent',
														);
														const commentsQueryResult = cache.readQuery(
															{
																query: GET_COMMENTS_BY_ITEM,
																variables: {
																	itemId,
																	token: customerToken,
																},
															},
														);

														commentsQueryResult.itemComments.push(
															postComment.comments.pop(),
														);

														cache.writeQuery({
															query: GET_COMMENTS_BY_ITEM,
															variables: {
																itemId,
																token: customerToken,
															},
															data: commentsQueryResult,
														});
														actions.resetForm();
													},
												});
											}
											catch (commentError) {
												actions.setSubmitting(false);
												actions.setErrors(commentError);
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
												<form onSubmit={handleSubmit}>
													<FlexRow>
														<ItemComment
															data-tip="Les personnes liées à la tâche seront notifiées"
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
															{errors.comment}
														</ErrorInput>
													)}
													<FlexRow justifyContent="flex-end">
														<Button
															data-tip="Visible par les personnes liées au projet"
															type="submit"
														>
															Ajouter un
															commentaire
														</Button>
													</FlexRow>
												</form>
											);
										}}
									</Formik>
								)}
							</Mutation>
						</>
					);
				}}
			</Query>
		);
	}
}

export default CommentList;
