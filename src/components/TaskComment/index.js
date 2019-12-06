import styled from '@emotion/styled/macro';
import React, {memo} from 'react';
import {withRouter} from 'react-router-dom';

import fbt from '../../fbt/fbt.macro';
import {
	primaryRed,
	primaryWhite,
	TaskInfosItemLink
} from '../../utils/new/design-system';
import IconButton from '../IconButton';
import Tooltip from '../Tooltip';

const CommentWrap = styled('span')`
	position: relative;
`;

const CommentNumber = styled('span')`
	color: ${primaryWhite};
	position: absolute;
	left: 8px;
	top: 5px;
	font-weight: 600;
	font-size: 10px;
	width: 0.75rem;
	text-align: center;
	pointer-events: none;
`;

function TaskComment({
	taskUrlPrefix,
	baseUrl,
	item,
	noComment,
	customerToken,
	location
}) {
	let unreadCommentLength = (item.comments || []).length;

	if (unreadCommentLength > 0) {
		unreadCommentLength = item.comments.filter(
			comment =>
				!comment.views.find(
					e =>
						e.viewer.__typename ===
						(customerToken ? 'Customer' : 'User')
				)
		).length;
	}

	return (
		<TaskInfosItemLink
			to={{
				pathname: `${taskUrlPrefix}/${baseUrl}/${item.id}`,
				state: {prevSearch: location.search}
			}}
			id="icon-meta-comment"
		>
			<CommentWrap>
				<Tooltip
					label={
						<fbt project="inyo" desc="open comments tooltip">
							Ouvrir les commentaires
						</fbt>
					}
				>
					<IconButton
						icon={
							item.comments.length > 0
								? 'mode_comment'
								: 'add_comment'
						}
						size="tiny"
						color={unreadCommentLength > 0 ? primaryRed : ''}
					/>
				</Tooltip>
				<CommentNumber unread={unreadCommentLength > 0}>
					{item.comments.length > 0 ? item.comments.length : ''}
				</CommentNumber>
			</CommentWrap>
		</TaskInfosItemLink>
	);
}

export default withRouter(
	memo(
		TaskComment,
		(prevProps, nextProps) =>
			prevProps.taskUrlPrefix === nextProps.taskUrlPrefix &&
			prevProps.baseUrl === nextProps.baseUrl &&
			prevProps.item === nextProps.item &&
			prevProps.noComment === nextProps.noComment &&
			prevProps.customerToken === nextProps.customerToken &&
			prevProps.location.search === nextProps.location.search
	)
);
