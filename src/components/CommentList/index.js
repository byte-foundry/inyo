import React, {Component} from 'react';
import styled from '@emotion/styled';
import {useQuery, useMutation} from 'react-apollo-hooks';
import * as Yup from 'yup';
import {Formik} from 'formik';
import ReactTooltip from 'react-tooltip';
import {Waypoint} from 'react-waypoint';

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
import {
	Button,
	primaryPurple,
	primaryBlack,
} from '../../utils/new/design-system';

import Comment from '../Comment';

const CommentRow = styled('div')`
	padding-right: 40px;
	padding-top: 5px;
	padding-bottom: 5px;
	position: relative;
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

const ScrollAlert = styled('div')`
	position: relative;
	margin-top: -2.5rem;
	margin-bottom: 2.5rem;
	height: 2rem;
	display: flex;
	justify-content: center;
	flex-shrink: 0;
	pointer-events: none;
`;

const ScrollAlertContent = styled('div')`
	display: ${props => (props.CommentListState ? 'none' : 'block')};
	background-color: ${primaryBlack};
	color: ${primaryWhite};
	font-weight: 500;
	padding: 0.4rem 0.8rem;
	font-size: 0.8rem;
	border-radius: 3rem;
`;

function CommentList({itemId, customerToken, linkedCustomer}) {
	const {data, loading, error} = useQuery(GET_COMMENTS_BY_ITEM, {
		variables: {
			itemId,
			token: customerToken,
		},
	});
	const postCommentMutation = useMutation(POST_COMMENT);

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

	let placeholderText = 'Votre commentaire';

	if (linkedCustomer && !customerToken) {
		placeholderText = 'Écrire et envoyer un commentaire à votre client';
	}
	else if (linkedCustomer) {
		placeholderText
			= 'Écrire et envoyer un commentaire à votre prestataire';
	}

	return (
		<>
			<ReactTooltip effect="solid" delayShow={TOOLTIP_DELAY} />
			<Comments id="comments">
				{comments.length ? (
					<CommentRow>{comments}</CommentRow>
				) : (
					<Empty>
						Une question ou une suggestion? Ajoutez un commentaire.
					</Empty>
				)}
				<Waypoint
					// onEnter={CommentListState}
					onEnter={() => this.setState({noScrollIndicator: true})}
					onLeave={() => this.setState({
						noScrollIndicator: false,
					})
					}
				/>
			</Comments>
			<ScrollAlert>
				{!this.state.noScrollIndicator && (
					<ScrollAlertContent>
						Scroller pour lire les autres commentaires
					</ScrollAlertContent>
				)}
			</ScrollAlert>
			<Formik
				initialValues={{
					newComment: '',
				}}
				validationSchema={Yup.object().shape({
					newComment: Yup.string().required('Requis'),
				})}
				onSubmit={async (values, actions) => {
					actions.setSubmitting(false);
					try {
						postCommentMutation({
							variables: {
								itemId,
								token: customerToken,
								comment: {
									text: values.newComment,
								},
							},
							update: (cache, {data: {postComment}}) => {
								window.Intercom('trackEvent', 'comment-sent');
								const commentsQueryResult = cache.readQuery({
									query: GET_COMMENTS_BY_ITEM,
									variables: {
										itemId,
										token: customerToken,
									},
								});

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
									placeholder={placeholderText}
									value={values.newComment}
									name="newComment"
									onChange={e => setFieldValue(
										'newComment',
										e.target.value,
									)
									}
								/>
							</FlexRow>
							{errors.comment && touched.comment && (
								<ErrorInput>{errors.comment}</ErrorInput>
							)}
							<FlexRow justifyContent="flex-end">
								<Button
									data-tip="Visible par les personnes liées au projet"
									type="submit"
								>
									Ajouter un commentaire
								</Button>
							</FlexRow>
						</form>
					);
				}}
			</Formik>
		</>
	);
}

export default CommentList;
