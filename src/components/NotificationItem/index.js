import React from 'react';
import {Link} from 'react-router-dom';
import styled from '@emotion/styled/macro';

import MaterialIcon from '../MaterialIcon';

import {
	primaryGrey,
	accentGrey,
	lightPurple,
	primaryBlack,
} from '../../utils/new/design-system';

const A = styled(Link)`
	text-decoration: none;
	color: ${primaryGrey};

	&:hover {
		color: ${primaryBlack};
	}
`;

const Container = styled('div')`
	border-radius: 4px;
	padding: 10px;
	font-size: 0.85rem;
	line-height: 1.4;
	transition: all 200ms ease;

	display: grid;
	grid-template-columns: 30px 1fr;

	&:hover {
		background-color: ${lightPurple};
	}
`;

const NotificationItem = ({
	from, eventType, object, unread,
}) => {
	let action = 'a effectué';

	let icon = 'notifications';

	let objectLink = '';

	switch (eventType) {
	case 'POSTED_COMMENT':
		action = 'a commenté la tâche';
		icon = 'mode_comment';
		break;
	case 'VIEWED_PROJECT':
		action = 'a consulté le projet';
		icon = 'visibility';
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
				<MaterialIcon
					icon={icon}
					size="tiny"
					color={unread ? '' : accentGrey}
				/>
				<div>
					{from.firstName} {from.lastName} {action} {object.name}.
				</div>
			</Container>
		</A>
	);
};

export default NotificationItem;
