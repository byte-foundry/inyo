import styled from '@emotion/styled/macro';
import React from 'react';
import {useMutation} from 'react-apollo-hooks';
import {Link} from 'react-router-dom';

import fbt from '../../fbt/fbt.macro';
import {collabStatuses} from '../../utils/constants';
import {formatFullName, formatName} from '../../utils/functions';
import {
	ACCEPT_COLLAB_REQUEST,
	REJECT_COLLAB_REQUEST,
} from '../../utils/mutations';
import {
	accentGrey,
	Button,
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

const Actions = styled('div')`
	margin: 0.5rem 0;
	display: flex;

	span {
		margin-left: .5rem;
	}

	${Button} + ${Button} {
		margin-left: 1rem;
	}
`;

const Notification = ({
	icon, unread, link, children,
}) => {
	const base = (
		<Container unread={unread}>
			<MaterialIcon
				icon={icon}
				size="tiny"
				color={unread ? '' : accentGrey}
			/>
			<div>{children}</div>
		</Container>
	);

	if (link) {
		return <A to={link}>{base}</A>;
	}

	return base;
};

const TextPlusObjectNotification = ({
	from, eventType, object, unread,
}) => {
	let action = 'a effectué';

	let icon = 'notifications';

	let objectLink = '';

	let objectName = '';

	switch (eventType) {
	case 'POSTED_COMMENT':
		action = (
			<fbt project="inyo" desc="posted comment notification message">
					a commenté la tâche
			</fbt>
		);
		icon = 'mode_comment';
		break;
	case 'VIEWED_PROJECT':
		action = (
			<fbt project="inyo" desc="viewed project notification message">
					a consulté le projet
			</fbt>
		);
		icon = 'visibility';
		break;
	case 'UPLOADED_ATTACHMENT':
		action = (
			<fbt
				project="inyo"
				desc="upload attachement notification message"
			>
					a ajouté un nouveau document sur la tâche
			</fbt>
		);
		icon = 'attachment';
		break;
	case 'FINISHED_TASK':
		action = (
			<fbt project="inyo" desc="finished tasked notification message">
					a validé la tâche
			</fbt>
		);
		icon = 'done';
		break;
	case 'ASSIGNED_TO_TASK':
		action = (
			<fbt
				project="inyo"
				desc="assigned to task notification message"
			>
					vous a assigné à la tâche
			</fbt>
		);
		icon = 'assignment';
		break;
	case 'REMOVE_ASSIGNMENT_TO_TASK':
		action = (
			<fbt
				project="inyo"
				desc="remove assignement to task notification message"
			>
					vous a retiré la tâche
			</fbt>
		);
		icon = 'assignment';
		break;
	case 'COLLAB_ACCEPTED':
		action = (
			<fbt project="inyo" desc="collab accepted notification message">
					a accepté la collaboration
			</fbt>
		);
		icon = 'face';
		break;
	default:
		action = '';
		icon = 'done';
		break;
	}

	if (object) {
		// eslint-disable-next-line no-underscore-dangle
		switch (object.__typename) {
		case 'Project':
			objectLink = `/app/tasks?projectId=${object.id}`;
			objectName = object.name;
			break;
		case 'Item':
			objectLink = `/app/dashboard/${object.id}`;
			objectName = object.name;
			break;
		default:
		}
	}

	return (
		<Notification icon={icon} unread={unread} link={objectLink}>
			{formatFullName(from.title, from.firstName, from.lastName)} {action}{' '}
			{objectName}.
		</Notification>
	);
};

const CollaborationRequestNotification = ({unread, from, object}) => {
	const [acceptCollabRequest] = useMutation(ACCEPT_COLLAB_REQUEST);
	const [rejectCollabRequest] = useMutation(REJECT_COLLAB_REQUEST);

	if (object.status === collabStatuses.PENDING) {
		return (
			<Notification icon="people" unread={unread}>
				<fbt project="inyo" desc="collab request notification message">
					<fbt:param name="collabFullName">
						{formatName(from.firstName, from.lastName)}
					</fbt:param>{' '}
					vous a invité à collaborer
				</fbt>
				<Actions>
					<Button
						onClick={() => acceptCollabRequest({
							variables: {requestId: object.id},
						})
						}
						link
					>
						<MaterialIcon
							icon="check_circle"
							size="tiny"
							color="inherit"
						/>
						<span>
							<fbt project="inyo" desc="accept collab request">
								Accepter
							</fbt>
						</span>
					</Button>
					<Button
						onClick={() => rejectCollabRequest({
							variables: {requestId: object.id},
						})
						}
						link
						red
					>
						<MaterialIcon
							icon="remove_circle"
							size="tiny"
							color="inherit"
						/>
						<span>
							<fbt project="inyo" desc="reject collab request">
								Rejeter
							</fbt>
						</span>
					</Button>
				</Actions>
			</Notification>
		);
	}
	if (object.status === collabStatuses.ACCEPTED) {
		return (
			<Notification icon="people" unread={unread}>
				<fbt project="inyo" desc="accepted collab notification message">
					Vous avez accepté la requête de collaboration de{' '}
					<fbt:param name="collaboratorFullName">
						{formatName(from.firstName, from.lastName)}
					</fbt:param>
				</fbt>
			</Notification>
		);
	}
	if (object.status === collabStatuses.REJECTED) {
		return (
			<Notification icon="people" unread={unread}>
				<fbt project="inyo" desc="rejected collab notification message">
					Vous avez rejeté la requête de collaboration de{' '}
					<fbt:param name="collaboratorFullName">
						{formatName(from.firstName, from.lastName)}
					</fbt:param>
				</fbt>
			</Notification>
		);
	}

	return false;
};

const NotificationItem = (props) => {
	let notification;

	switch (props.eventType) {
	case 'POSTED_COMMENT':
	case 'VIEWED_PROJECT':
	case 'UPLOADED_ATTACHMENT':
	case 'FINISHED_TASK':
	case 'ASSIGNED_TO_TASK':
	case 'REMOVE_ASSIGNMENT_TO_TASK':
	case 'COLLAB_ACCEPTED':
	case 'COLLAB_REJECTED':
		notification = <TextPlusObjectNotification {...props} />;
		break;
	case 'COLLAB_ASKED':
		notification = <CollaborationRequestNotification {...props} />;
		break;
	default:
		notification = false;
	}

	return notification;
};

export default NotificationItem;
