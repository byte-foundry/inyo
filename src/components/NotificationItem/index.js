import React from 'react';
import {Link} from 'react-router-dom';
import styled from '@emotion/styled';

import {lightGrey, lightPurple} from '../../utils/new/design-system';

const A = styled(Link)`
	text-decoration: none;
	color: inherit;
`;

const Container = styled('div')`
	background: ${props => (props.unread ? lightPurple : '')};
	border-bottom: 1px solid ${lightPurple};
	border-radius: 4px;
	padding: 10px;
	font-size: 0.85rem;
	line-height: 1.4;
	transition: all 200ms ease;

	&:hover {
		background-color: ${lightGrey};
	}
`;

const NotificationItem = ({
	from, eventType, object, unread,
}) => {
	let action = 'a effectué';

	let objectLink = '';

	switch (eventType) {
	case 'POSTED_COMMENT':
		action = 'a commenté la tâche';
		break;
	case 'VIEWED_PROJECT':
		action = 'a consulté le projet';
		break;
	default:
	}

	// eslint-disable-next-line no-underscore-dangle
	switch (object.__typename) {
	case 'Project':
		objectLink = `/app/tasks?project=${object.id}`;
		break;
	case 'Item':
		objectLink = `/app/tasks/${object.id}`;
		break;
	default:
	}

	return (
		<A to={objectLink}>
			<Container unread={unread}>
				{from.firstName} {from.lastName} {action} {object.name}.
			</Container>
		</A>
	);
};

export default NotificationItem;
