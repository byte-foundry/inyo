import styled from '@emotion/styled';
import {Field, Formik} from 'formik';
import debounce from 'lodash.debounce';
import React, {forwardRef, useRef, useState} from 'react';
import {Waypoint} from 'react-waypoint';
import * as Yup from 'yup';

import fbt from '../../fbt/fbt.macro';
import {useMutation, useQuery} from '../../utils/apollo-hooks';
import {
	ErrorInput,
	FlexRow,
	gray20,
	gray80,
	primaryWhite,
} from '../../utils/content';
import {POST_COMMENT} from '../../utils/mutations';
import {
	accentGrey,
	Button,
	primaryBlack,
	primaryPurple,
} from '../../utils/new/design-system';
import {GET_COMMENTS_BY_ITEM} from '../../utils/queries';
import Comment from '../Comment';
import Tooltip from '../Tooltip';

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

const FieldWithRef = forwardRef((props, ref) => (
	<Field {...props} innerRef={ref} />
));

const ItemComment = styled(FieldWithRef)`
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
	box-shadow: 3px 3px 20px ${accentGrey};
`;

function CommentList({itemId, customerToken, linkedCustomer}) {
	const [noScrollIndicator, setNoScrollIndicator] = useState(false);
	const {data, loading, error} = useQuery(GET_COMMENTS_BY_ITEM, {
		variables: {
			itemId,
			token: customerToken,
			updateCommentViews: true,
		},
		suspend: true,
		pollInterval: 1000 * 60 * 5,
	});
	const [postCommentMutation] = useMutation(POST_COMMENT);
	const debouncePostComment = useRef(
		debounce(postCommentMutation, 500, {leading: true, trailing: false}),
	);

	if (loading) return <span />;
	if (
		error
		&& !(
			data.item
			&& typeof error.message === 'string'
			&& error.message.includes('NetworkError')
		)
	) throw error;

	const {comments: itemComments} = data.item;

	const comments = itemComments.map(comment => (
		<Comment key={`comment${comment.id}`} comment={comment} />
	));

	let placeholderText = (
		<fbt project="inyo" desc="comment placeholder text">
			Votre commentaire
		</fbt>
	);

	if (linkedCustomer && !customerToken) {
		placeholderText = (
			<fbt project="inyo" desc="comment placeholder text for customer">
				Écrire et envoyer un commentaire à votre client
			</fbt>
		);
	}
	else if (linkedCustomer) {
		placeholderText = (
			<fbt project="inyo" desc="comment placeholder text for user">
				Écrire et envoyer un commentaire à votre prestataire
			</fbt>
		);
	}

	return (
		<>
			<Comments id="comments">
				{comments.length ? (
					<CommentRow>{comments}</CommentRow>
				) : (
					<Empty>
						<fbt project="inyo" desc="empty comment message">
							Une question ou une suggestion? Ajoutez un
							commentaire.
						</fbt>
					</Empty>
				)}
				<Waypoint
					onEnter={() => setNoScrollIndicator(true)}
					onLeave={() => setNoScrollIndicator(false)}
					bottomOffset={-50}
				/>
			</Comments>
			<ScrollAlert>
				{!noScrollIndicator && (
					<ScrollAlertContent>
						<fbt project="inyo" desc="other comments scroll alert">
							↓ Autres commentaires
						</fbt>
					</ScrollAlertContent>
				)}
			</ScrollAlert>
			<Formik
				initialValues={{
					newComment: '',
				}}
				validationSchema={Yup.object().shape({
					newComment: Yup.string().required(
						<fbt project="inyo" desc="required">
							Requis
						</fbt>,
					),
				})}
				onSubmit={async (values, actions) => {
					actions.setSubmitting(false);
					try {
						await debouncePostComment.current({
							variables: {
								itemId,
								token: customerToken,
								comment: {
									text: values.newComment,
								},
							},
						});

						window.Intercom('trackEvent', 'comment-sent');

						actions.resetForm();
					}
					catch (commentError) {
						actions.setSubmitting(false);
						actions.setErrors(commentError);
						actions.setStatus({
							msg: (
								<fbt
									project="inyo"
									desc="unpecified error message for comment"
								>
									Une erreur s'est produite pendant la
									soumission du commentaire
								</fbt>
							),
						});
					}
				}}
			>
				{(props) => {
					const {touched, errors, handleSubmit} = props;

					return (
						<form onSubmit={handleSubmit}>
							<FlexRow>
								<Tooltip
									label={
										<fbt
											project="inyo"
											desc="tooltipe comment text area"
										>
											Les personnes liées à la tâche
											seront notifiées
										</fbt>
									}
								>
									<ItemComment
										id="comment-textarea"
										placeholder={placeholderText}
										name="newComment"
										component="textarea"
									/>
								</Tooltip>
							</FlexRow>
							{errors.comment && touched.comment && (
								<ErrorInput>{errors.comment}</ErrorInput>
							)}
							<FlexRow justifyContent="flex-end">
								<Tooltip
									label={
										<fbt
											project="inyo"
											desc="add comment button tooltip"
										>
											Visible par les personnes liées au
											projet
										</fbt>
									}
								>
									<Button
										id="add-comment-button"
										type="submit"
									>
										<fbt
											project="inyo"
											desc="add comment button label"
										>
											Ajouter un commentaire
										</fbt>
									</Button>
								</Tooltip>
							</FlexRow>
						</form>
					);
				}}
			</Formik>
		</>
	);
}

export default CommentList;
