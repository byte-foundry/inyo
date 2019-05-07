import React from 'react';
import {Link} from 'react-router-dom';
import styled from '@emotion/styled';

import {lightPurple} from '../../utils/new/design-system';

const Container = styled('div')`
	background: ${props => (props.unread ? lightPurple : '')};
	padding: 10px;
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
		objectLink = (
			<Link to={`/app/tasks?project=${object.id}`}>
				{object.name}
			</Link>
		);
		break;
	case 'Item':
		objectLink = (
			<Link to={`/app/tasks/${object.id}`}>{object.name}</Link>
		);
		break;
	default:
	}

	return (
		<Container unread={unread}>
			{from.firstName} {from.lastName} {action} {objectLink}
		</Container>
	);
};

export default NotificationItem;
