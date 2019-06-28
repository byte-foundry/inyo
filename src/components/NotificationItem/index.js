import styled from '@emotion/styled/macro';
import React from 'react';
import {Link} from 'react-router-dom';

import {
	accentGrey,
	lightPurple,
	primaryBlack,
	primaryGrey,
} from '../../utils/new/design-system';
import MaterialIcon from '../MaterialIcon';

const A = styled(Link)`
	text-decoration: none;
	color: ${primaryGrey};

	&:hover {
		color: ${primaryBlack};
	}
`;

const Container = styled('span')`
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

	let objectName = '';

	switch (eventType) {
	case 'POSTED_COMMENT':
		action = 'a commenté la tâche';
		icon = 'mode_comment';
		break;
	case 'VIEWED_PROJECT':
		action = 'a consulté le projet';
		icon = 'visibility';
		break;
	case 'UPLOADED_ATTACHMENT':
		action = 'a ajouté un nouveau document sur la tâche';
		icon = 'attachment';
		break;
	case 'FINISHED_TASK':
		action = 'a validé la tâche';
		icon = 'done';
		break;
	default:
	}

	if (object) {
		// eslint-disable-next-line no-underscore-dangle
		switch (object.__typename) {
		case 'Project':
			objectLink = `/app/tasks?projectId=${object.id}`;
			objectName = object.name;
			break;
		case 'Item':
			objectLink = `/app/tasks/${object.id}`;
			objectName = object.name;
			break;
		default:
		}
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
					{from.firstName} {from.lastName} {action} {objectName}.
				</div>
			</Container>
		</A>
	);
};

export default NotificationItem;
