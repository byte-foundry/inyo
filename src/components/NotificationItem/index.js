import React from 'react';
import {Link} from 'react-router-dom';
import styled from '@emotion/styled/macro';

import EyeIcon from '../../utils/icons/eye.svg';
import CommentIcon from '../../utils/icons/comment-icon.svg';
import DefaultIcon from '../../utils/icons/notifications.svg';

import {
	lightGrey,
	primaryGrey,
	lightPurple,
	primaryPurple,
	primaryRed,
} from '../../utils/new/design-system';

const A = styled(Link)`
	text-decoration: none;
	color: inherit;
`;

const IconType = styled('div')`
	background-color: ${primaryGrey};
	mask-position: center;
	mask-repeat: no-repeat;
	mask-size: 16px;
	mask-image: url(${props => (props.type ? props.type : DefaultIcon)});

	width: 20px;
	height: 20px;
`;

const Container = styled('div')`
	border-radius: 4px;
	padding: 10px;
	font-size: 0.85rem;
	line-height: 1.4;
	transition: all 200ms ease;

	display: grid;
	grid-template-columns: 30px 1fr;

	${IconType} {
		background-color: ${props => (props.unread ? primaryRed : primaryGrey)};
	}

	&:hover {
		background-color: ${lightPurple};

		${IconType} {
			background-color: ${primaryPurple};
		}
	}
`;

const NotificationItem = ({
	from, eventType, object, unread,
}) => {
	let action = 'a effectué';

	let icon = DefaultIcon;

	let objectLink = '';

	switch (eventType) {
	case 'POSTED_COMMENT':
		action = 'a commenté la tâche';
		icon = CommentIcon;
		break;
	case 'VIEWED_PROJECT':
		action = 'a consulté le projet';
		icon = EyeIcon;
		break;
	default:
	}

	// eslint-disable-next-line no-underscore-dangle
	switch (object.__typename) {
	case 'Project':
		objectLink = `/app/tasks?projectId=${object.id}`;
		break;
	case 'Item':
		objectLink = `/app/tasks/${object.id}`;
		break;
	default:
	}

	return (
		<A to={objectLink}>
			<Container unread={unread}>
				<IconType type={icon} />
				<div>
					{from.firstName} {from.lastName} {action} {object.name}.
				</div>
			</Container>
		</A>
	);
};

export default NotificationItem;
