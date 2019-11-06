import styled from '@emotion/styled';
import moment from 'moment';
import React from 'react';
import {Link} from 'react-router-dom';

import fbt from '../../fbt/fbt.macro';
import {useQuery} from '../../utils/apollo-hooks';
import {BREAKPOINTS, EVENT_TYPES, ITEM_TYPES} from '../../utils/constants';
import {accentGrey, LoadingLogo} from '../../utils/content';
import {formatFullName, isCustomerTask} from '../../utils/functions';
import {
	A,
	CheckBoxFakeLabel,
	CheckBoxLabel,
	Heading,
	P,
	primaryBlack,
	primaryGrey,
	SubHeading,
} from '../../utils/new/design-system';
import {GET_PROJECT_ACTIVITY} from '../../utils/queries';
import useLocalStorage from '../../utils/useLocalStorage';
import IconButton from '../IconButton';
import MaterialIcon from '../MaterialIcon';

const Feed = styled('div')`
	flex: 1;
	display: flex;
	color: ${primaryGrey};

	@media (max-width: ${BREAKPOINTS.desktopSmall}px) {
		flex-direction: column;
		margin-bottom: 2rem;
	}
`;

const EventTextContainer = styled('span')`
	display: grid;
	grid-template-columns: 40px 1fr;
	align-items: self-start;
	flex: 0 1 auto;
`;

const EventInfo = styled('span')`
	text-overflow: ellipsis;
	white-space: nowrap;
	overflow: hidden;

	@media (max-width: ${BREAKPOINTS.desktopSmall}px) {
		text-overflow: initial;
		white-space: normal;
	}
`;

const EventRow = styled('div')`
	display: flex;
	margin-bottom: 0.5rem;
	font-size: 0.85rem;
	line-height: 1.4;

	@media (max-width: ${BREAKPOINTS.desktopSmall}px) {
		flex-direction: column-reverse;
		margin-bottom: 1.5rem;
	}
`;

const EventSpace = styled('div')`
	display: flex;
	height: 1px;
	border-top: 1px dotted lightGrey;
	flex: 1 1 10px;
	margin: 0 1.2rem;
	align-self: center;
`;

const EventTime = styled('time')`
	display: flex;
	flex: 0 0 auto;

	@media (max-width: ${BREAKPOINTS.desktopSmall}px) {
		padding-left: 40px;
		font-size: 0.7rem;
		color: ${primaryBlack};
	}
`;

const ObjectLink = A.withComponent(Link);

const EventText = ({
	from,
	type: eventType,
	object,
	subject,
	metadata,
	projectId,
}) => {
	let action = (
		<fbt desc="default notification action message">a effectué</fbt>
	);

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
	case 'REMOVED_ATTACHMENT':
		action = (
			<fbt
				project="inyo"
				desc="remove attachement notification message"
			>
					a supprimé le document
			</fbt>
		);
		icon = 'attachment';
		break;
	case 'UPLOADED_ATTACHMENT':
		action = (
			<fbt
				project="inyo"
				desc="upload attachement notification message"
			>
					a ajouté le document
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
	case 'UNFINISHED_TASK':
		action = (
			<fbt project="inyo" desc="finished tasked notification message">
					a dé-validé la tâche
			</fbt>
		);
		icon = 'done';
		break;
	case 'LINKED_CUSTOMER_TO_TASK':
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
				desc="link customer on a task event preposition"
			>
					à la tâche
			</fbt>
		);
		icon = 'person';
		break;
	case 'UNLINKED_CUSTOMER_TO_TASK':
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
				desc="unlink customer on a task event preposition"
			>
					de la tâche
			</fbt>
		);
		icon = 'person';
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
	case 'CREATED_PROJECT':
		action = (
			<fbt project="inyo" desc="created project event message">
					a créé le projet
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
	case 'ARCHIVED_PROJECT':
		action = (
			<fbt project="inyo" desc="archived project event message">
					a archivé le projet
			</fbt>
		);
		icon = 'archive';
		break;
	case 'UNARCHIVED_PROJECT':
		action = (
			<fbt project="inyo" desc="unarchived project event message">
					a désarchivé le projet
			</fbt>
		);
		icon = 'unarchive';
		break;
	case 'ADDED_SECTION':
		action = (
			<fbt project="inyo" desc="added section event message">
					a ajouté la section
			</fbt>
		);
		icon = 'calendar_view_day';
		break;
	case 'UPDATED_SECTION':
		action = (
			<fbt project="inyo" desc="updated section event message">
					a mis à jour la section
			</fbt>
		);
		icon = 'calendar_view_day';
		break;
	case 'REMOVED_SECTION':
		action = (
			<fbt project="inyo" desc="removed section event message">
					a supprimé la section
			</fbt>
		);
		icon = 'calendar_view_day';
		break;
	case 'ADDED_TASK':
		action = (
			<fbt project="inyo" desc="added task event message">
					a ajouté la tâche
			</fbt>
		);
		icon = 'done';
		break;
	case 'UPDATED_TASK':
		action = (
			<fbt project="inyo" desc="updated task event message">
					a mis à jour la tâche
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
	case 'FOCUSED_TASK':
		if (object && isCustomerTask(object.itemType)) {
			action = (
				<fbt
					project="inyo"
					desc="focused customer task event message"
				>
						a activé la tâche cliente
				</fbt>
			);
		}
		else {
			action = (
				<fbt project="inyo" desc="focused task event message">
						a programmé dans son calendrier la tâche
				</fbt>
			);
		}
		icon = 'done';
		break;
	case 'UNFOCUSED_TASK':
		if (object && isCustomerTask(object.itemType)) {
			action = (
				<fbt
					project="inyo"
					desc="focused customer task event message"
				>
						a désactivé la tâche cliente
				</fbt>
			);
		}
		else {
			action = (
				<fbt project="inyo" desc="focused task event message">
						a déprogrammé de son calendrier la tâche
				</fbt>
			);
		}
		icon = 'done';
		break;
	case 'SENT_REMINDER':
		action = (
			<fbt project="inyo" desc="removed task event message">
					Un rappel a été envoyé pour la tâche
			</fbt>
		);
		icon = 'alarm_on';
		break;
	case 'CANCELED_REMINDER':
		action = (
			<fbt project="inyo" desc="removed reminder event message">
					a annulé un rappel de la tâche
			</fbt>
		);
		icon = 'alarm_off';
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
			objectName = (
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
			objectName = (
				<ObjectLink
					to={{
						pathname: `/app/tasks/${object.task.id}`,
						state: {
							prevSearch: `?projectId=${projectId}&view=activity`,
						},
					}}
				>
					{object.task.name}
				</ObjectLink>
			);
			break;
		case 'Reminder':
			objectName = (
				<ObjectLink
					to={{
						pathname: `/app/tasks/${object.item.id}`,
						state: {
							prevSearch: `?projectId=${projectId}&view=activity`,
						},
					}}
				>
					{object.item.name}
				</ObjectLink>
			);
			break;
		case 'File':
			objectName = (
				<fbt desc="file url on task url">
					<fbt:param name="objectUrl">
						<A href={object.url}>{object.filename}</A>
					</fbt:param>{' '}
						sur{' '}
					<fbt:param name="taskUrl">
						<ObjectLink
							to={{
								pathname: `/app/tasks/${object.linkedTask.id}`,
								state: {
									prevSearch: `?projectId=${projectId}&view=activity`,
								},
							}}
						>
							{object.linkedTask.name}
						</ObjectLink>
					</fbt:param>
				</fbt>
			);
			break;
		default:
		}
	}
	else {
		objectName = metadata.name;
	}

	let subjectName = ' ';

	if (subject) {
		subjectName += `${formatFullName(
			subject.title,
			subject.firstName,
			subject.lastName,
		)} `;
	}

	return (
		<EventTextContainer>
			<MaterialIcon icon={icon} size="tiny" color={accentGrey} />
			<EventInfo>
				{from
					&& formatFullName(
						from.title,
						from.firstName,
						from.lastName,
					)}{' '}
				{action}
				{subjectName}
				{subjectOnObject} {objectName}.
			</EventInfo>
		</EventTextContainer>
	);
};

const EventList = styled('ul')`
	margin: 0;
	padding: 0;
	margin-right: 4rem;
	flex: 1;

	@media (max-width: ${BREAKPOINTS.mobile}px) {
		margin: 0 0 2rem 0;
	}

	@media (max-width: ${BREAKPOINTS.desktopSmall}px) {
		margin: 0 0 2rem 0;
	}
`;

const FilterCard = styled('div')`
	margin-bottom: 1rem;

	${SubHeading} {
		margin-bottom: 1rem;
	}
`;

const FilterHeading = styled(Heading.withComponent('h2'))`
	font-size: 1rem;
`;

const ActivityFeed = ({projectId}) => {
	const {data, loading, error} = useQuery(GET_PROJECT_ACTIVITY, {
		variables: {projectId},
		fetchPolicy: 'cache-and-network',
	});
	const [peopleFilter, setPeopleFilter] = useLocalStorage(
		'activityPeopleFilter',
		{},
	);
	const [eventTypesFilter, setEventTypesFilter] = useLocalStorage(
		'activityEventTypesFilter',
		{},
	);
	const [itemTypesFilter, setItemTypesFilter] = useLocalStorage(
		'activityItemTypesFilter',
		{},
	);

	if (error) throw error;
	if (!data && loading) return <LoadingLogo />;

	const people = data.activity.reduce((acc, event) => {
		if (event.subject) {
			acc[event.subject.id] = event.subject;
		}
		if (event.from) {
			acc[event.from.id] = event.from;
		}
		return acc;
	}, {});

	const filteredActivity = data.activity.filter((event) => {
		if (eventTypesFilter[event.type]) {
			return false;
		}
		if (event.object) {
			// eslint-disable-next-line no-underscore-dangle
			const type = event.object.__typename;

			if (
				(type === 'Item' && itemTypesFilter[event.object.itemType])
				|| (type === 'Comment'
					&& itemTypesFilter[event.object.task.type])
				|| (type === 'Reminder' && itemTypesFilter[event.object.item.type])
			) {
				return false;
			}
		}
		if (
			(!event.subject || peopleFilter[event.subject.id])
			&& (!event.from || peopleFilter[event.from.id])
			&& (event.subject || event.from)
		) {
			return false;
		}
		return true;
	});

	return (
		<Feed>
			<EventList>
				{data.activity.length === 0 && (
					<P>
						<fbt desc="no activity placeholder">
							Aucune activité n'a été enregistrée pour le moment.
						</fbt>
					</P>
				)}
				{data.activity.length > 0 && filteredActivity.length === 0 && (
					<P>
						<fbt desc="all activity filtered placeholder">
							Aucune activité correspondant aux éléments
							sélectionnés n'a été enregistrée pour le moment.
						</fbt>
					</P>
				)}
				{filteredActivity.map(event => (
					<EventRow>
						<EventText
							projectId={projectId}
							key={event.id}
							{...event}
						/>
						<EventSpace />
						<EventTime datetime={event.createdAt}>
							{moment(event.createdAt).calendar()}
						</EventTime>
					</EventRow>
				))}
			</EventList>

			<div style={{flexBasis: '300px'}}>
				<FilterHeading>
					<fbt desc="filters title">
						Filtres (Affichés :{' '}
						<fbt:param name="filteredEventsCount">
							{filteredActivity.length}
						</fbt:param>{' '}
						/{' '}
						<fbt:param name="eventsCount">
							{data.activity.length}
						</fbt:param>)
					</fbt>
				</FilterHeading>

				<FilterCard>
					<SubHeading>
						<fbt desc="project people filter title">
							Acteurs du projet
						</fbt>
					</SubHeading>
					{Object.values(people).map(person => (
						<CheckBoxLabel
							key={person.id}
							color={primaryBlack}
							condensed
							checked={!peopleFilter[person.id]}
						>
							<input
								type="checkbox"
								checked={!peopleFilter[person.id]}
								onChange={event => setPeopleFilter({
									...peopleFilter,
									[person.id]: !event.target.checked,
								})
								}
							/>
							{peopleFilter[person.id] ? (
								<IconButton
									icon="check_box_outline_blank"
									size="tiny"
									color={primaryBlack}
								/>
							) : (
								<IconButton
									icon="check_box"
									size="tiny"
									color={primaryBlack}
								/>
							)}
							<CheckBoxFakeLabel>
								{person.firstName} {person.lastName}{' '}
								{person.name && `(${person.name})`}
							</CheckBoxFakeLabel>
						</CheckBoxLabel>
					))}
				</FilterCard>

				<FilterCard>
					<SubHeading>
						<fbt desc="events filter title">Actions</fbt>
					</SubHeading>
					{EVENT_TYPES.map(({name, type}) => (
						<CheckBoxLabel
							key={type}
							color={primaryBlack}
							condensed
							checked={!eventTypesFilter[type]}
						>
							<input
								type="checkbox"
								checked={!eventTypesFilter[type]}
								onChange={event => setEventTypesFilter({
									...eventTypesFilter,
									[type]: !event.target.checked,
								})
								}
							/>
							{eventTypesFilter[type] ? (
								<IconButton
									icon="check_box_outline_blank"
									size="tiny"
									color={primaryBlack}
								/>
							) : (
								<IconButton
									icon="check_box"
									size="tiny"
									color={primaryBlack}
								/>
							)}
							<CheckBoxFakeLabel>{name}</CheckBoxFakeLabel>
						</CheckBoxLabel>
					))}
				</FilterCard>

				<FilterCard>
					<SubHeading>
						<fbt desc="task type filter title">Type de tâche</fbt>
					</SubHeading>
					{ITEM_TYPES.map(({name, type}) => (
						<CheckBoxLabel
							key={type}
							color={primaryBlack}
							condensed
							checked={!itemTypesFilter[type]}
						>
							<input
								type="checkbox"
								checked={!itemTypesFilter[type]}
								onChange={event => setItemTypesFilter({
									...itemTypesFilter,
									[type]: !event.target.checked,
								})
								}
							/>
							{itemTypesFilter[type] ? (
								<IconButton
									icon="check_box_outline_blank"
									size="tiny"
									color={primaryBlack}
								/>
							) : (
								<IconButton
									icon="check_box"
									size="tiny"
									color={primaryBlack}
								/>
							)}
							<CheckBoxFakeLabel>{name}</CheckBoxFakeLabel>
						</CheckBoxLabel>
					))}
				</FilterCard>
			</div>
		</Feed>
	);
};

export default ActivityFeed;
