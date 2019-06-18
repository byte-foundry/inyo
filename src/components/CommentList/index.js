import React, {useState, useRef, forwardRef} from 'react';
import styled from '@emotion/styled';
import {useQuery, useMutation} from 'react-apollo-hooks';
import * as Yup from 'yup';
import debounce from 'lodash.debounce';
import {Formik, Field} from 'formik';
import {Waypoint} from 'react-waypoint';

import {GET_COMMENTS_BY_ITEM} from '../../utils/queries';
import {POST_COMMENT} from '../../utils/mutations';

import {
	gray20,
	primaryWhite,
	gray80,
	ErrorInput,
	FlexRow,
} from '../../utils/content';
import {
	Button,
	primaryPurple,
	primaryBlack,
	accentGrey,
} from '../../utils/new/design-system';

import Tooltip from '../Tooltip';
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
		},
		suspend: true,
	});
	const postCommentMutation = useMutation(POST_COMMENT);
	const debouncePostComment = useRef(
		debounce(postCommentMutation, 500, {leading: true, trailing: false}),
	);

	if (loading) return <span />;
	if (error) throw error;

	const {comments: itemComments} = data.item;

	const comments = itemComments.map(comment => (
		<Comment key={`comment${comment.id}`} comment={comment} />
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
			<Comments id="comments">
				{comments.length ? (
					<CommentRow>{comments}</CommentRow>
				) : (
					<Empty>
						Une question ou une suggestion? Ajoutez un commentaire.
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
						↓ Autres commentaires
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
							msg:
								"Une erreur s'est produite pendant la soumission du commentaire",
						});
					}
				}}
			>
				{(props) => {
					const {touched, errors, handleSubmit} = props;

					return (
						<form onSubmit={handleSubmit}>
							<FlexRow>
								<Tooltip label="Les personnes liées à la tâche seront notifiées">
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
								<Tooltip label="Visible par les personnes liées au projet">
									<Button
										id="add-comment-button"
										type="submit"
									>
										Ajouter un commentaire
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
