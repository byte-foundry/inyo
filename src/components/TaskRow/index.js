import styled from '@emotion/styled/macro';
import React, {
	forwardRef, useCallback, useRef, useState,
} from 'react';
import {useMutation} from 'react-apollo-hooks';
import {Link, withRouter} from 'react-router-dom';

import {BREAKPOINTS, ITEM_TYPES, itemStatuses} from '../../utils/constants';
import {isCustomerTask} from '../../utils/functions';
import DragIconSvg from '../../utils/icons/drag.svg';
import {FINISH_ITEM, UNFINISH_ITEM} from '../../utils/mutations';
import {
	accentGrey,
	lightGrey,
	mediumGrey,
	primaryBlack,
	primaryGrey,
	TaskHeading,
	TaskIconText,
} from '../../utils/new/design-system';
import InitialIdentifier from '../InitialIdentifier';
import MaterialIcon from '../MaterialIcon';
import Plural from '../Plural';
import Tag from '../Tag';
import TaskComment from '../TaskComment';
import TaskDescription from '../TaskDescription';
import TaskReminderIcon from '../TaskReminderIcon';
import Tooltip from '../Tooltip';

export const TaskContainer = styled('div')`
	display: flex;
	position: relative;
	padding-left: 2rem;
	margin-left: -2rem;
	align-items: center;

	&:after {
		content: '';
		display: block;
		width: 0.8rem;
		height: 1.2rem;
		background: ${props => (props.isDraggable ? `url(${DragIconSvg})` : 'none')};
		background-repeat: no-repeat;
		position: absolute;
		left: -3rem;
		top: 0;
		bottom: 0;
		margin: auto;
		cursor: ${props => (props.isDraggable ? 'grab' : 'default')};

		opacity: 0;
		transition: all 300ms ease;
	}

	&:hover {
		&:after {
			opacity: 1;
			left: 0.2rem;
		}
	}

	@media (max-width: ${BREAKPOINTS}px) {
		padding-left: 0;
		margin-left: 0;
		margin-bottom: 0;

		&:after {
			display: none;
		}
	}
`;

const TaskAdd = styled('div')``;

const TaskIcon = styled('div')`
	cursor: pointer;
	width: 3.5rem;
	height: 3.5rem;
	margin-left: -0.8725rem;
	margin-right: ${props => (props.noData ? '.5rem' : '1rem')};
	overflow: visible;
	background: center no-repeat
		url(${(props) => {
		let {type} = props;

		if (props.assigned) {
			type += '_ASSIGNED';
		}

		const typeInfos
				= ITEM_TYPES.find(t => t.type === type) || ITEM_TYPES[0];

		let icon = typeInfos.iconUrl;

		if (props.status === itemStatuses.FINISHED) {
			icon
					= (props.justUpdated
					? typeInfos.iconUrlValidatedAnim
					: typeInfos.iconUrlValidated) || typeInfos.iconUrl;
		}
		return icon;
	}});
	margin-bottom: 0;

	transform: scale(${props => (props.noData ? 0.75 : '')});

	&:hover {
		background: center no-repeat
			url(${(props) => {
		const typeInfos
					= ITEM_TYPES.find(t => t.type === props.type)
					|| ITEM_TYPES[0];

		let icon = typeInfos.iconUrl;

		icon = typeInfos.iconUrlValidated || typeInfos.iconUrl;
		return icon;
	}});

		animation: ${props => (props.status === itemStatuses.FINISHED ? 'none' : 'growth 300ms')};

		@keyframes growth {
			0% {
				background-size: 0% auto;
			}
			50% {
				background-size: 50% auto;
			}
			70% {
				background-size: 40% auto;
			}
			100% {
				background-size: 50% auto;
			}
		}
	}

	@media (max-width: ${BREAKPOINTS}px) {
		transform: scale(0.6);
		margin: 0;
		position: absolute;
		left: -1rem;
	}
`;

const TaskHeadingPlaceholder = styled(TaskHeading.withComponent(Link))`
	text-decoration: none;
	font-style: italic;
	margin: 0.5rem 0;
	margin: ${props => (props.noData ? '0.1rem 0' : '0.5rem 0')};
	color: ${primaryGrey};

	@media (max-width: ${BREAKPOINTS}px) {
		font-size: 1rem;
		display: block;
	}
`;

const TaskHeadingLink = styled(TaskHeading.withComponent(Link))`
	text-decoration: ${props => (props.status === itemStatuses.FINISHED ? 'line-through' : 'none')};
	margin-right: 0.5rem;
	color: ${primaryBlack};
	white-space: nowrap;
	text-overflow: ellipsis;
	overflow: hidden;

	@media (max-width: ${BREAKPOINTS}px) {
		font-size: 0.85rem;
		display: block;
	}
`;

const TaskContent = styled('div')`
	flex: 1;
	display: grid;
	grid-template-columns: minmax(200px, auto) minmax(100px, 200px) 80px 110px;
	grid-gap: 15px;
	align-items: center;
	position: relative;
	cursor: pointer;

	&:hover {
		&:before {
			content: '';
			display: block;
			background: ${lightGrey};
			position: absolute;
			left: -1rem;
			top: 0;
			right: -1rem;
			bottom: 0;
			border-radius: 8px;
			z-index: -1;
		}
	}

	@media (max-width: ${BREAKPOINTS}px) {
		padding-left: 2rem;
		grid-template-columns: minmax(200px, 4fr) 1fr;
	}
`;

const EmptyProjectName = styled('div')`
	text-align: right;
	color: ${primaryGrey};
	text-decoration: none;
`;

const ProjectName = EmptyProjectName.withComponent(Link);

const CustomerCondensed = styled('div')`
	display: flex;
	align-items: center;

	@media (max-width: ${BREAKPOINTS}px) {
		display: none;
	}
`;

const TaskHeader = styled('div')`
	display: flex;
	align-items: center;
	margin: 0.5rem 0;

	${props => props.noProject && 'grid-column: 1 / 3;'}

	@media (max-width: ${BREAKPOINTS}px) {
		overflow: hidden;
		${props => props.noProject && 'grid-column: 1 / 3;'}
	}
`;

const TaskMetas = styled('div')`
	display: grid;
	grid-template-columns: repeat(4, 28px);

	@media (max-width: ${BREAKPOINTS}px) {
		display: none;
	}
`;

function TaskRow({
	item,
	location,
	isDraggable,
	noData,
	noProject,
	baseUrl = 'tasks',
	forwardedRef,
	userId,
}) {
	const [finishItem] = useMutation(FINISH_ITEM);
	const [unfinishItem] = useMutation(UNFINISH_ITEM);

	const [justUpdated, setJustUpdated] = useState(false);

	const iconRef = useRef();

	const finishItemCallback = useCallback(() => {
		finishItem({
			variables: {
				itemId: item.id,
			},
			optimisticResponse: {
				finishItem: {
					...item,
					status: 'FINISHED',
				},
			},
		});
		setJustUpdated(true);
	}, [finishItem, item]);

	const taskUrlPrefix = '/app';
	const isFinishable
		= item.status !== 'FINISHED' && !isCustomerTask(item.type);
	const isUnfinishable
		= item.status === 'FINISHED' && !isCustomerTask(item.type);

	return (
		<div ref={forwardedRef}>
			<TaskContainer noData={noData} isDraggable={isDraggable}>
				<TaskAdd />
				<TaskIcon
					status={item.status}
					type={item.type}
					assigned={item.assignee && item.assignee.id !== userId}
					noData={noData}
					ref={iconRef}
					justUpdated={justUpdated}
					onClick={() => {
						if (!isFinishable && !isUnfinishable) return;

						if (isFinishable) {
							finishItemCallback();
						}
						else if (isUnfinishable) {
							unfinishItem({
								variables: {
									itemId: item.id,
								},
							});
						}
					}}
				/>
				<Tooltip label="Cliquer pour voir le contenu de la tâche">
					<TaskContent>
						<TaskHeader noProject={noProject}>
							{item.name ? (
								<TaskHeadingLink
									noData={noData}
									small={false}
									status={item.status}
									to={{
										pathname: `${taskUrlPrefix}/${baseUrl}/${item.id}`,
										state: {prevSearch: location.search},
									}}
								>
									{item.name}
								</TaskHeadingLink>
							) : (
								<TaskHeadingPlaceholder
									noData={noData}
									small={false}
									to={{
										pathname: `${taskUrlPrefix}/tasks/${item.id}`,
										state: {prevSearch: location.search},
									}}
								>
									Choisir un titre pour cette tâche
								</TaskHeadingPlaceholder>
							)}
							{item.tags.slice(0, 2).map(tag => (
								<Tag tag={tag} key={tag.id} />
							))}
							{item.tags.length > 2 && (
								<Tag
									tag={{
										name: `${item.tags.length - 2}+`,
										colorBg: '#4b4b4b',
										colorText: '#fff',
									}}
								/>
							)}
						</TaskHeader>
						{!noProject
							&& (item.section && item.section.project ? (
								<ProjectName
									to={`/app/tasks?projectId=${item.section.project.id}`}
									onClick={(e) => {
										// needed to avoid another history push to be triggered, should be investigated
										e.stopPropagation();
									}}
								>
									{item.section.project.name}
								</ProjectName>
							) : (
								<EmptyProjectName>&mdash;</EmptyProjectName>
							))}
						{!noData && (
							<>
								{isCustomerTask(item.type) ? (
									<CustomerCondensed>
										<MaterialIcon
											style={{
												marginTop: '5px',
												marginRight: '5px',
											}}
											icon="person"
											size="tiny"
										/>
										{item.linkedCustomer
										|| (item.section
											&& item.section.project.customer) ? (
												<InitialIdentifier
													person={
														item.linkedCustomer
													|| (item.section
														&& item.section.project
															.customer)
													}
													size={20}
												/>
											) : (
												<span style={{marginLeft: '5px'}}>
												&mdash;
												</span>
											)}
									</CustomerCondensed>
								) : (
									<CustomerCondensed>
										<MaterialIcon
											style={{
												marginTop: '5px',
												marginRight: '5px',
											}}
											icon="face"
											size="tiny"
										/>
										{item.assignee ? (
											<InitialIdentifier
												person={item.assignee}
												size={20}
											/>
										) : (
											<span style={{marginLeft: '5px'}}>
												&mdash;
											</span>
										)}
									</CustomerCondensed>
								)}
								<TaskMetas>
									<TaskComment
										key={`TaskComment-${item.id}`}
										taskUrlPrefix={taskUrlPrefix}
										baseUrl={baseUrl}
										item={item}
										noComment
										locationSearch={location.search}
									/>
									{item.description ? (
										<TaskDescription
											taskUrlPrefix={taskUrlPrefix}
											baseUrl={baseUrl}
											item={item}
											locationSearch={location.search}
										/>
									) : (
										<div />
									)}
									<TaskReminderIcon
										item={item}
										taskUrlPrefix={taskUrlPrefix}
										baseUrl={baseUrl}
										locationSearch={location.search}
									/>
									{item.attachments.length > 0 ? (
										<Tooltip label="Fichiers joints">
											<TaskIconText
												inactive={false}
												icon={
													<MaterialIcon
														icon="attach_file"
														size="tiny"
													/>
												}
												style={{
													fontWeight: '600',
												}}
												content={
													<>
														{
															item.attachments
																.length
														}
													</>
												}
											/>
										</Tooltip>
									) : (
										<div />
									)}
								</TaskMetas>
							</>
						)}
					</TaskContent>
				</Tooltip>
			</TaskContainer>
		</div>
	);
}

const RouterTask = withRouter(TaskRow);

export default forwardRef((props, ref) => (
	<RouterTask forwardedRef={ref} {...props} />
));
