import styled from '@emotion/styled';
import React from 'react';
import {Link} from 'react-router-dom';

import fbt from '../../fbt/fbt.macro';
import {useQuery} from '../../utils/apollo-hooks';
import {
	accentGrey,
	lightGrey,
	lightPurple,
	LoadingLogo,
	primaryBlack,
	primaryGrey,
	primaryPurple,
	primaryWhite,
} from '../../utils/content';
import {formatFullName} from '../../utils/functions';
import {A} from '../../utils/new/design-system';
import {GET_PROJECT_ACTIVITY} from '../../utils/queries';
import MaterialIcon from '../MaterialIcon';

const Feed = styled('div')`
	flex: 1;
`;

const Container = styled('span')`
	border-radius: 4px;
	padding: 10px 10px 10px 0;
	font-size: 0.85rem;
	line-height: 1.4;
	transition: all 200ms ease;

	display: grid;
	grid-template-columns: 40px 1fr;
	align-items: self-start;

	color: ${primaryGrey};
`;

const ObjectLink = A.withComponent(Link);

const TextPlusObjectNotification = ({
	from,
	type: eventType,
	object,
	subject,
	metadata,
	projectId,
}) => {
	let action = 'a effectué';

	let subjectOnObject = ' ';

	let icon = 'notifications';

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
	case 'LINKED_CUSTOMER_TO_PROJECT':
		action = (
			<fbt
				project="inyo"
				desc="link customer to project event message"
			>
					a ajouté le client
			</fbt>
		);
		subjectOnObject = (
			<fbt
				project="inyo"
				desc="link customer on project event preposition"
			>
					au projet
			</fbt>
		);
		icon = 'person';
		break;
	case 'UNLINKED_CUSTOMER_TO_PROJECT':
		action = (
			<fbt
				project="inyo"
				desc="unlink customer to project event message"
			>
					a retiré le client
			</fbt>
		);
		subjectOnObject = (
			<fbt
				project="inyo"
				desc="unlink customer on project event preposition"
			>
					du projet
			</fbt>
		);
		icon = 'person';
		break;
	case 'LINKED_COLLABORATOR_TO_PROJECT':
		action = (
			<fbt
				project="inyo"
				desc="link collaborator to project event message"
			>
					a ajouté le collaborateur
			</fbt>
		);
		subjectOnObject = (
			<fbt
				project="inyo"
				desc="link collaborator on project event preposition"
			>
					au projet
			</fbt>
		);
		icon = 'face';
		break;
	case 'UNLINKED_COLLABORATOR_TO_PROJECT':
		action = (
			<fbt
				project="inyo"
				desc="unlink collaborator to project event message"
			>
					a retiré le collaborateur
			</fbt>
		);
		subjectOnObject = (
			<fbt
				project="inyo"
				desc="unlink collaborator on project event preposition"
			>
					du projet
			</fbt>
		);
		icon = 'face';
		break;
	case 'ASSIGNED_TO_TASK':
		action = (
			<fbt project="inyo" desc="assigned to task event message">
					a assigné
			</fbt>
		);
		subjectOnObject = (
			<fbt
				project="inyo"
				desc="assigned to task on project event preposition"
			>
					à la tâche
			</fbt>
		);
		icon = 'assignment';
		break;
	case 'REMOVE_ASSIGNMENT_TO_TASK':
		action = (
			<fbt
				project="inyo"
				desc="removed assigned to task event message"
			>
					a retiré
			</fbt>
		);
		subjectOnObject = (
			<fbt
				project="inyo"
				desc="removed assigned to task on project event preposition"
			>
					de la tâche
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
	case 'CREATED_PROJECT':
		action = (
			<fbt project="inyo" desc="created project event message">
					a crée le projet
			</fbt>
		);
		icon = 'folder_open';
		break;
	case 'UPDATED_PROJECT':
		action = (
			<fbt project="inyo" desc="updated project event message">
					a mis à jour le projet
			</fbt>
		);
		icon = 'folder_open';
		break;
	case 'ADDED_TASK':
		action = (
			<fbt project="inyo" desc="added task event message">
					a ajouté la tâche
			</fbt>
		);
		icon = 'done';
		break;
	case 'REMOVED_TASK':
		action = (
			<fbt project="inyo" desc="removed task event message">
					a supprimé la tâche
			</fbt>
		);
		icon = 'done';
		break;
	default:
		action = eventType;
		icon = 'done';
		break;
	}

	if (object) {
		// eslint-disable-next-line no-underscore-dangle
		switch (object.__typename) {
		case 'Project':
			objectName = (
				<ObjectLink to={`/app/tasks?projectId=${object.id}`}>
					{object.name}
				</ObjectLink>
			);
			break;
		case 'Section':
			objectName = object.name;
			break;
		case 'Item':
			objectName = objectName = (
				<ObjectLink
					to={{
						pathname: `/app/tasks/${object.id}`,
						state: {
							prevSearch: `?projectId=${projectId}&view=activity`,
						},
					}}
				>
					{object.name}
				</ObjectLink>
			);
			break;
		case 'Comment':
			objectName = object.text;
			// objectName = <A to={`/app/tasks/${object.item.id}`}>{object.name}</A>;
			break;
			// case 'Reminder':
			// 		objectName = <A to={`/app/tasks/${object.item.id}`}>{object.name}</A>;
			// 	break;
		default:
		}
	}
	else {
		objectName = metadata.name;
	}

	let subjectName = ' ';

	if (subject) {
		subjectName
			+= `${formatFullName(subject.title, subject.firstName, subject.lastName)
			 } `;
	}

	return (
		<Container>
			<MaterialIcon icon={icon} size="tiny" color={accentGrey} />
			<span>
				{formatFullName(from.title, from.firstName, from.lastName)}{' '}
				{action}
				{subjectName}
				{subjectOnObject} {objectName}.
			</span>
		</Container>
	);
};

const ActivityFeed = ({projectId}) => {
	const {data, loading, error} = useQuery(GET_PROJECT_ACTIVITY, {
		variables: {projectId},
		fetchPolicy: 'cache-and-network',
	});

	if (error) throw error;
	if (!data && loading) return <LoadingLogo />;

	return (
		<Feed>
			<ul>
				{data.activity.map(event => (
					<TextPlusObjectNotification
						projectId={projectId}
						key={event.id}
						{...event}
					/>
				))}
			</ul>
		</Feed>
	);
};

export default ActivityFeed;
