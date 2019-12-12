import styled from '@emotion/styled/macro';
import Portal from '@reach/portal';
import moment from 'moment';
import React, {
	forwardRef,
	useCallback,
	useEffect,
	useRef,
	useState,
	memo
} from 'react';
import {Link, withRouter} from 'react-router-dom';

import fbt from '../../fbt/fbt.macro';
import {useMutation} from '../../utils/apollo-hooks';
import {BREAKPOINTS, itemStatuses} from '../../utils/constants';
import {isCustomerTask} from '../../utils/functions';
import DragIconSvg from '../../utils/icons/drag.svg';
import {FINISH_ITEM, UNFINISH_ITEM} from '../../utils/mutations';
import {
	lightGrey,
	primaryBlack,
	primaryGrey,
	TaskHeading,
	TaskIcon,
	TaskIconText
} from '../../utils/new/design-system';
import useOnClickOutside from '../../utils/useOnClickOutside';
import useUserInfos from '../../utils/useUserInfos';
import CollaboratorDropdown from '../CollaboratorDropdown';
import ConfirmFinishCustomerTaskModal from '../ConfirmFinishCustomerTaskModal';
import {useConfirmation} from '../ConfirmModal';
import CreateTask from '../CreateTask';
import CustomerDropdown from '../CustomerDropdown';
import HelpAndTooltip from '../HelpAndTooltip';
import InitialIdentifier from '../InitialIdentifier';
import MaterialIcon from '../MaterialIcon';
import Tag from '../Tag';
import TaskComment from '../TaskComment';
import TaskDescription from '../TaskDescription';
import TaskReminderIcon from '../TaskReminderIcon';
import Tooltip from '../Tooltip';
import UnitDisplay from '../UnitDisplay';

const CreateButton = styled('div')`
	margin-right: 0.5rem;
`;

export const TaskContainer = styled('div')`
	display: flex;
	position: relative;
	padding-left: ${props => (props.withCreate ? '0' : '2rem')};
	margin-left: -2rem;
	align-items: center;

	${CreateButton} {
		visibility: hidden;
	}

	&:after {
		content: '';
		display: block;
		width: 0.8rem;
		height: 1.2rem;
		background: ${props =>
			props.isDraggable ? `url(${DragIconSvg})` : 'none'};
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
		${CreateButton} {
			visibility: visible;
		}

		&:after {
			opacity: 1;
			left: ${props => (props.withCreate ? '-1.2rem' : '0.2rem')};
		}
	}

	@media (max-width: ${BREAKPOINTS.mobile}px) {
		padding-left: 0;
		margin-left: 0;
		margin-bottom: 0;

		&:after {
			display: none;
		}
	}
`;

const TaskHeadingPlaceholder = styled(TaskHeading.withComponent(Link))`
	text-decoration: none;
	font-style: italic;
	margin: 0.5rem 0;
	margin: ${props => (props.noData ? '0.1rem 0' : '0.5rem 0')};
	color: ${primaryGrey};

	@media (max-width: ${BREAKPOINTS.mobile}px) {
		font-size: 1rem;
		display: block;
	}
`;

const TaskHeadingLink = styled(TaskHeading.withComponent(Link))`
	text-decoration: ${props =>
		props.status === itemStatuses.FINISHED ? 'line-through' : 'none'};
	margin-right: 0.5rem;
	color: ${primaryBlack};
	white-space: nowrap;
	text-overflow: ellipsis;
	overflow: hidden;
	display: flex;

	i {
		margin-right: 0.5rem;
		display: inline-block !important;
	}

	@media (max-width: ${BREAKPOINTS.mobile}px) {
		font-size: 0.85rem;
		display: block;
	}
`;

const TaskContent = styled('div')`
	flex: 1;
	display: grid;
	grid-template-columns: minmax(200px, auto) minmax(100px, 150px) 80px 110px;
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

	@media (max-width: ${BREAKPOINTS.mobile}px) {
		padding-left: 2rem;
		grid-template-columns: minmax(200px, 4fr) 75px;
	}
`;

const ProjectNameWrap = styled('div')`
	display: flex;
`;

const EmptyProjectName = styled('div')`
	color: ${primaryGrey};
	text-decoration: none;

	text-overflow: ellipsis;
	overflow: hidden;
	white-space: nowrap;
	text-align: right;
	flex: 1;
`;

const ProjectName = EmptyProjectName.withComponent(Link);

const IconAndText = styled('div')`
	display: flex;
	align-items: center;
`;

const IconAndTextOptional = styled(IconAndText)`
	@media (max-width: ${BREAKPOINTS.mobile}px) {
		display: none;
	}
`;

const TaskHeader = styled('div')`
	display: flex;
	align-items: center;
	margin: 0.5rem 0;

	@media (max-width: ${BREAKPOINTS.mobile}px) {
		overflow: hidden;
	}
`;

const TaskMetas = styled('div')`
	display: grid;
	grid-template-columns: repeat(4, 28px);

	@media (max-width: ${BREAKPOINTS.mobile}px) {
		display: none;
	}
`;

function TaskRow({
	item,
	location,
	isDraggable,
	noData,
	noProject: inProject,
	baseUrl = 'tasks',
	forwardedRef,
	userId,
	projectId,
}) {
	const [finishItem] = useMutation(FINISH_ITEM);
	const [unfinishItem] = useMutation(UNFINISH_ITEM);

	const [confirmModal, askConfirmationNotification] = useConfirmation();
	const [justUpdated, setJustUpdated] = useState(false);
	const [editAssignee, setEditAssignee] = useState(false);
	const [dropdownStyle, setDropdownStyle] = useState(false);
	const containerRef = useRef();

	const iconRef = useRef();
	const dropdownRef = useRef();
	const {workingTime} = useUserInfos();

	useOnClickOutside(dropdownRef, () => {
		setEditAssignee(false);
	});

	useEffect(() => {
		if (editAssignee) {
			const pos = containerRef.current.getBoundingClientRect();

			setDropdownStyle({
				position: 'absolute',
				top: `${pos.bottom + window.scrollY}px`,
				left: `${pos.left}px`
			});
		}
	}, [editAssignee]);

	const finishItemCallback = useCallback(() => {
		finishItem({
			variables: {
				itemId: item.id
			},
			optimisticResponse: {
				finishItem: {
					...item,
					status: 'FINISHED'
				}
			}
		});
		setJustUpdated(true);
	}, [finishItem, item]);

	const taskUrlPrefix = '/app';
	const isFinishable = item.status !== 'FINISHED';
	const isUnfinishable = item.status === 'FINISHED';

	return (
		<div ref={forwardedRef} id={`task-${item.type}`}>
			<TaskContainer
				noData={noData}
				isDraggable={isDraggable}
				withCreate={projectId}
			>
				{projectId && (
					<CreateButton>
						<HelpAndTooltip icon="add">
							<CreateTask
								popinTask
								currentProjectId={projectId}
								createAfterItem={item}
								createAfterSection={item.section}
							/>
						</HelpAndTooltip>
					</CreateButton>
				)}
				<TaskIcon
					status={item.status}
					type={item.type}
					assigned={item.assignee && item.assignee.id !== userId}
					noData={noData}
					ref={iconRef}
					justUpdated={justUpdated}
					onClick={async () => {
						if (!isFinishable && !isUnfinishable) return;

						if (isFinishable) {
							if (isCustomerTask(item.type)) {
								const confirmed = await askConfirmationNotification();

								if (!confirmed) return;
							}

							finishItemCallback();
						} else if (isUnfinishable) {
							unfinishItem({
								variables: {
									itemId: item.id
								}
							});
						}
					}}
				/>
				<TaskContent>
					<TaskHeader>
						{item.name ? (
							<TaskHeadingLink
								noData={noData}
								small={false}
								status={item.status}
								to={{
									pathname: `${taskUrlPrefix}/${baseUrl}/${item.id}`,
									state: {prevSearch: location.search}
								}}
							>
								{item.assignee && (
									<Tooltip
										label={
											<fbt
												project="inyo"
												desc="this task is assigned to you"
											>
												Cette tâche vous a été assigné
											</fbt>
										}
									>
										<div>
											<MaterialIcon
												icon="reply"
												size="tiny"
												color="inherit"
											/>
										</div>
									</Tooltip>
								)}{' '}
								{item.name}
							</TaskHeadingLink>
						) : (
							<TaskHeadingPlaceholder
								noData={noData}
								small={false}
								to={{
									pathname: `${taskUrlPrefix}/${baseUrl}/${item.id}`,
									state: {prevSearch: location.search}
								}}
							>
								<fbt
									project="inyo"
									desc="task placeholder name"
								>
									Choisir un titre pour cette tâche
								</fbt>
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
									colorText: '#fff'
								}}
							/>
						)}
					</TaskHeader>
					{inProject && (
						<Tooltip
							label={
								<fbt project="inyo" desc="Planned day">
									Jour planifié
								</fbt>
							}
						>
							<IconAndText>
								<MaterialIcon
									style={{
										marginTop: '5px',
										marginRight: '5px'
									}}
									icon="today"
									size="tiny"
								/>
								{item.scheduledFor ? (
									moment(item.scheduledFor).fromNow()
								) : (
									<>&mdash;</>
								)}
							</IconAndText>
						</Tooltip>
					)}
					{!inProject &&
						(item.section && item.section.project ? (
							<Tooltip
								label={
									<fbt project="inyo" desc="open project">
										Ouvrir le projet
									</fbt>
								}
							>
								<ProjectNameWrap>
									<ProjectName
										to={`/app/tasks?projectId=${item.section.project.id}`}
										onClick={e => {
											// needed to avoid another history push to be triggered, should be investigated
											e.stopPropagation();
										}}
									>
										{item.section.project.name}
									</ProjectName>
								</ProjectNameWrap>
							</Tooltip>
						) : (
							<EmptyProjectName>&mdash;</EmptyProjectName>
						))}
					{!noData && (
						<>
							{isCustomerTask(item.type) || !item.section ? (
								<Tooltip
									label={
										<fbt
											project="inyo"
											desc="client assigned to task"
										>
											Client responsable de la tâche
										</fbt>
									}
								>
									<IconAndTextOptional
										ref={containerRef}
										onClick={() =>
											inProject && setEditAssignee(true)
										}
									>
										<MaterialIcon
											style={{
												marginTop: '5px',
												marginRight: '5px'
											}}
											icon="person"
											size="tiny"
										/>
										{item.linkedCustomer ||
										(item.section &&
											item.section.project.customer) ? (
											<InitialIdentifier
												person={
													item.linkedCustomer ||
													(item.section &&
														item.section.project
															.customer)
												}
												size={20}
											/>
										) : (
											<span style={{marginLeft: '5px'}}>
												&mdash;
											</span>
										)}
										{inProject && editAssignee && (
											<Portal>
												<div
													ref={dropdownRef}
													style={dropdownStyle}
												>
													<CustomerDropdown
														assignee={
															item.linkedCustomer
														}
														taskId={item.id}
													/>
												</div>
											</Portal>
										)}
									</IconAndTextOptional>
								</Tooltip>
							) : item.type !== 'PERSONAL' ? (
								<Tooltip
									label={
										<fbt
											project="inyo"
											desc="Collaborator assigned to task"
										>
											Collaborateur responsable de la
											tâche
										</fbt>
									}
								>
									<IconAndTextOptional
										ref={containerRef}
										onClick={() =>
											inProject && setEditAssignee(true)
										}
									>
										<MaterialIcon
											style={{
												marginTop: '5px',
												marginRight: '5px'
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
										{inProject && editAssignee && (
											<Portal>
												<div
													ref={dropdownRef}
													style={dropdownStyle}
												>
													<CollaboratorDropdown
														assignee={item.assignee}
														taskId={item.id}
														collaborators={
															item.section.project
																.linkedCollaborators
														}
													/>
												</div>
											</Portal>
										)}
									</IconAndTextOptional>
								</Tooltip>
							) : (
								<div></div>
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
								{item.unit <= 0.1 / workingTime &&
								item.timeItTook <= 0.1 / workingTime ? (
									<div />
								) : (
									<Tooltip
										label={
											<UnitDisplay
												unit={
													item.timeItTook
														? item.timeItTook
														: item.unit
												}
											/>
										}
									>
										<TaskIconText
											inactive={false}
											icon={
												<MaterialIcon
													icon="timer"
													size="tiny"
												/>
											}
										/>
									</Tooltip>
								)}
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
									<Tooltip
										label={
											<fbt
												project="inyo"
												desc="attached files"
											>
												Fichiers joints
											</fbt>
										}
									>
										<TaskIconText
											inactive={false}
											icon={
												<MaterialIcon
													icon="attach_file"
													size="tiny"
												/>
											}
											style={{
												fontWeight: '600'
											}}
											content={
												<>{item.attachments.length}</>
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
			</TaskContainer>
			{confirmModal && (
				<ConfirmFinishCustomerTaskModal
					onConfirm={confirmModal}
					onDismiss={() => confirmModal(false)}
				/>
			)}
		</div>
	);
}

const RouterTask = withRouter(
	memo(
		TaskRow,
		(prevProps, nextProps) =>
			prevProps.item === nextProps.item &&
			prevProps.location.search === nextProps.location.search &&
			prevProps.isDraggable === nextProps.isDraggable &&
			prevProps.noData === nextProps.noData &&
			prevProps.noProject === nextProps.noProject &&
			prevProps.baseUrl === nextProps.baseUrl &&
			prevProps.forwardedRef === nextProps.forwardedRef &&
			prevProps.userId === nextProps.userId
	)
);

export default forwardRef((props, ref) => (
	<RouterTask forwardedRef={ref} {...props} />
));
