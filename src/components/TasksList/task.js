import React, {useState, useRef, forwardRef} from 'react';
import {withRouter, Link} from 'react-router-dom';
import styled from '@emotion/styled/macro';
import moment from 'moment';
import {useMutation} from 'react-apollo-hooks';
import useOnClickOutside from 'use-onclickoutside';

import DragIconSvg from '../../utils/icons/drag.svg';
import {ITEM_TYPES, itemStatuses, BREAKPOINTS} from '../../utils/constants';
import {
	FINISH_ITEM,
	UPDATE_ITEM,
	UNFINISH_ITEM,
	FOCUS_TASK,
} from '../../utils/mutations';
import {isCustomerTask} from '../../utils/functions';
import IconButton from '../../utils/new/components/IconButton';

import {
	ButtonLink,
	TaskHeading,
	TaskIconText,
	TaskInfosItemLink,
	primaryPurple,
	primaryGrey,
	lightGrey,
	mediumGrey,
	primaryBlack,
	accentGrey,
	primaryRed,
	primaryWhite,
	DueDateInputElem,
	DateInputContainer,
	Button,
} from '../../utils/new/design-system';

import CustomerDropdown from '../CustomersDropdown';
import DateInput from '../DateInput';
import UnitInput from '../UnitInput';
import Plural from '../Plural';
import CustomerModalAndMail from '../CustomerModalAndMail';
import TimeItTookDisplay from '../TimeItTookDisplay';
import MaterialIcon from '../MaterialIcon';

export const TaskContainer = styled('div')`
	display: flex;
	margin-bottom: ${props => (props.noData ? '-1rem' : '0.6rem')};
	position: relative;
	padding-left: 2rem;
	margin-left: -2rem;

	&:after {
		content: '';
		display: block;
		width: 0.8rem;
		height: 1.2rem;
		background: ${props => (props.isDraggable ? `url(${DragIconSvg})` : 'none')};
		background-repeat: no-repeat;
		position: absolute;
		left: -3rem;
		top: 1.9rem;

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
	margin-right: ${props => (props.noData ? '.5rem' : '2rem')};
	overflow: visible;
	background: center no-repeat
		url(${(props) => {
		const typeInfos
				= ITEM_TYPES.find(t => t.type === props.type) || ITEM_TYPES[0];

		let icon = typeInfos.iconUrl;

		if (props.status === itemStatuses.FINISHED) {
			icon
					= (props.justUpdated
					? typeInfos.iconUrlValidatedAnim
					: typeInfos.iconUrlValidated) || typeInfos.iconUrl;
		}
		return icon;
	}});
	margin-top: ${props => (props.noData ? '0.1rem' : '.6775rem')};
	margin-bottom: ${props => (props.noData ? 0 : '2rem')};

	transform: scale(${props => (props.noData ? 0.75 : '')});

	&:after,
	&:before {
		content: '';
		display: ${props => (props.noData ? 'none' : 'block')};
		display: block;
		border-left: 1px dotted ${mediumGrey};
		position: absolute;
		left: 2.85rem;
	}

	&:before {
		height: 1rem;
		top: 0.15rem;
	}

	&:after {
		top: 4.15rem;
		bottom: -0.85rem;
	}

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

		&:after,
		&:before {
			display: none;
		}
	}
`;

const TaskContent = styled('div')`
	flex: 1;
	margin-top: ${props => (props.noData ? '0.9rem' : '1rem')};

	@media (max-width: ${BREAKPOINTS}px) {
		padding-left: 2rem;
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
	margin: 0.5rem 0;
	margin: ${props => (props.noData ? '0.1rem 0' : '0.5rem 0')};
	color: ${primaryBlack};

	@media (max-width: ${BREAKPOINTS}px) {
		font-size: 0.85rem;
		display: block;
	}
`;

const TaskActions = styled('div')`
	opacity: ${props => (props.stayActive ? 1 : 0)};
	margin-right: ${props => (props.stayActive ? 0 : -100)}px;
	pointer-events: none;
	transition: opacity 200ms ease-out, margin-right 200ms ease-out;
	display: flex;

	@media (max-width: ${BREAKPOINTS}px) {
		display: none;
	}
`;

const TaskHeader = styled('div')`
	display: flex;
	justify-content: space-between;
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

	&:hover ${TaskActions} {
		opacity: 1;
		margin-right: 0;
		pointer-events: all;
	}

	@media (max-width: ${BREAKPOINTS}px) {
		display: block;
	}
`;

const IconButtonLink = styled(Link)`
	text-decoration: none;
`;

const OpenBtn = styled(ButtonLink)`
	color: ${primaryGrey};
	border-color: transparent;
	background: transparent;
`;

const TaskInfos = styled('div')`
	display: flex;
	letter-spacing: 0.05em;
	margin-top: -0.25rem;

	@media (max-width: ${BREAKPOINTS}px) {
		display: none;
	}
`;

const IconsWrap = styled('div')`
	display: flex;
	margin-right: 1rem;

	${TaskInfosItemLink} {
		margin-right: 0;
	}
`;

const CommentWrap = styled('span')`
	position: relative;
`;

const CommentNumber = styled('span')`
	color: ${primaryWhite};
	position: absolute;
	left: 8px;
	top: 5px;
	font-weight: 600;
	font-size: 10px;
	width: 0.75rem;
	text-align: center;
	pointer-events: none;
`;

const SetTimeContainer = styled('div')`
	display: flex;
	margin-right: 1rem;
`;

const SetTimeInfos = styled('div')`
	display: flex;
	flex-flow: column nowrap;
	margin-right: 1rem;
`;

const SetTimeHeadline = styled('div')`
	color: ${primaryPurple};
	font-size: 12px;
	font-weight: 500;
	line-height: 1.3;
`;

const SetTimeCaption = styled('div')`
	color: ${primaryGrey};
	font-size: 12px;
	font-style: italic;
	line-height: 1.3;
	white-space: nowrap;
`;

const Tag = styled(Link)`
	background-color: ${props => props.bg};
	color: ${props => props.color};
	border-radius: 2px;
	padding: 0 3px;
	margin-right: 5px;
	text-decoration: none;

	&:hover {
		text-decoration: none;
	}
`;

export function TaskCustomerInput({
	disabled,
	editCustomer: editCustomerProp,
	onCustomerSubmit,
	item,
}) {
	const clientName = item.linkedCustomer && item.linkedCustomer.name;
	const [editCustomer, setEditCustomer] = useState(editCustomerProp);

	return (
		<TaskIconText
			data-tip="Personne liée à la tâche"
			inactive={editCustomer}
			icon={
				<MaterialIcon
					icon="person_outline"
					size="tiny"
					color={accentGrey}
				/>
			}
			content={
				!disabled && editCustomer ? (
					<CustomerDropdown
						id="projects"
						defaultMenuIsOpen
						defaultValue={
							item.linkedCustomer && {
								value: item.linkedCustomer.id,
								label: item.linkedCustomer.name,
							}
						}
						creatable
						isClearable
						autoFocus
						onChange={(args) => {
							onCustomerSubmit(args);
							setEditCustomer(false);
						}}
						onBlur={() => {
							setEditCustomer(false);
						}}
					/>
				) : (
					<div
						onClick={
							disabled
								? undefined
								: () => {
									setEditCustomer(true);
								  }
						}
					>
						{clientName || <>&mdash;</>}
					</div>
				)
			}
		/>
	);
}

export function TaskInfosInputs({
	item,
	noComment,
	noAttachment,
	onDueDateSubmit,
	onUnitSubmit,
	onCustomerSubmit,
	startOpen,
	switchOnSelect,
	location,
	customerToken,
	taskUrlPrefix,
	baseUrl,
}) {
	const [editCustomer, setEditCustomer] = useState(false);
	const [editDueDate, setEditDueDate] = useState(false);
	const [editUnit, setEditUnit] = useState(startOpen);
	const dateRef = useRef();

	useOnClickOutside(dateRef, () => {
		setEditDueDate(false);
	});

	let unreadCommentLength = (item.comments || []).length;

	if (!noComment && item.comments.length > 0) {
		unreadCommentLength = item.comments.filter(
			comment => !comment.views.find(
				e => e.viewer.__typename
						=== (customerToken ? 'Customer' : 'User'),
			),
		).length;
	}

	let unitToDisplay
		= item.timeItTook === null || item.timeItTook === undefined
			? item.unit
			: item.timeItTook;

	let unitInHours = false;

	if (unitToDisplay < 1) {
		unitToDisplay *= 8;
		unitInHours = true;
	}

	const dueDate
		= item.dueDate
		|| (item.dueDate
			|| (item.section
				&& item.section.project
				&& item.section.project.deadline));

	const activableTask = !customerToken && item.status === 'PENDING';
	const customerTask
		= item.type === 'CUSTOMER' || item.type === 'CONTENT_ACQUISITION';

	return (
		<TaskInfos>
			<IconsWrap>
				{!noComment && (
					<TaskInfosItemLink
						to={{
							pathname: `${taskUrlPrefix}/${baseUrl}/${item.id}`,
							state: {prevSearch: location.search},
						}}
					>
						<CommentWrap>
							<IconButton
								icon={
									item.comments.length > 0
										? 'mode_comment'
										: 'add_comment'
								}
								size="tiny"
								color={
									unreadCommentLength > 0 ? primaryRed : ''
								}
								data-tip="Ouvrir les commentaires"
							/>
							<CommentNumber unread={unreadCommentLength > 0}>
								{item.comments.length > 0
									? item.comments.length
									: ''}
							</CommentNumber>
						</CommentWrap>
						{item.description && (
							<IconButton
								icon="assignment"
								size="tiny"
								data-tip="Lire la description de cette tâche"
							/>
						)}
					</TaskInfosItemLink>
				)}
				{customerTask && (
					<>
						{activableTask
							&& item.linkedCustomer
							&& !item.isFocused && (
							<IconButtonLink
								data-tip="Les rappels clients ne sont pas activés pour cette tâche"
								isFocused={item.isFocused}
								to={{
									pathname: `${taskUrlPrefix}/${baseUrl}/${
										item.id
									}`,
									state: {prevSearch: location.search},
								}}
							>
								<IconButton
									icon="notifications_off"
									size="tiny"
								/>
							</IconButtonLink>
						)}
						{activableTask
							&& item.linkedCustomer
							&& item.isFocused && (
							<IconButtonLink
								data-tip="Les rappels client sont activés pour cette tâche"
								isFocused={item.isFocused}
								to={{
									pathname: `${taskUrlPrefix}/${baseUrl}/${
										item.id
									}`,
									state: {prevSearch: location.search},
								}}
							>
								<IconButton
									icon="notifications_active"
									size="tiny"
									color={primaryPurple}
								/>
							</IconButtonLink>
						)}
						{activableTask && !item.linkedCustomer && (
							<IconButtonLink
								data-tip="Aucun client n’est lié à cette tâche"
								to={{
									pathname: `${taskUrlPrefix}/${baseUrl}/${
										item.id
									}`,
									state: {prevSearch: location.search},
								}}
							>
								<IconButton
									icon="warning"
									size="tiny"
									color={primaryRed}
								/>
							</IconButtonLink>
						)}
					</>
				)}
			</IconsWrap>
			<TaskIconText
				inactive={editUnit}
				icon={
					<MaterialIcon icon="timer" size="tiny" color={accentGrey} />
				}
				content={
					!customerToken && editUnit ? (
						<UnitInput
							unit={item.timeItTook ? item.timeItTook : item.unit}
							onBlur={(args) => {
								onUnitSubmit(args);
								setEditUnit(false);
							}}
							onSubmit={(args) => {
								onUnitSubmit(args);
								setEditUnit(false);
								if (switchOnSelect) {
									setEditDueDate(true);
								}
							}}
							onTab={(args) => {
								onUnitSubmit(args);
								setEditUnit(false);
								setEditDueDate(true);
							}}
						/>
					) : (
						<div
							onClick={
								customerToken
									? undefined
									: () => setEditUnit(true)
							}
						>
							{+unitToDisplay.toFixed(2)}{' '}
							{!unitInHours && (
								<Plural
									value={unitToDisplay}
									singular="jour"
									plural="jours"
								/>
							)}
							{unitInHours && (
								<Plural
									value={unitToDisplay}
									singular="heure"
									plural="heures"
								/>
							)}
							<TimeItTookDisplay
								timeItTook={item.timeItTook}
								unit={item.unit}
								customerToken={customerToken}
								status={item.status}
							/>
						</div>
					)
				}
			/>
			<TaskIconText
				data-tip="Marge restante pour commencer la tâche"
				inactive={editDueDate}
				icon={
					<MaterialIcon icon="event" size="tiny" color={accentGrey} />
				}
				content={
					<DateInputContainer
						onClick={
							customerToken
								? undefined
								: () => !editDueDate && setEditDueDate(true)
						}
					>
						{!customerToken && editDueDate ? (
							<>
								<DueDateInputElem
									value={moment(dueDate || new Date()).format(
										'DD/MM/YYYY',
									)}
								/>
								<DateInput
									innerRef={dateRef}
									date={moment(dueDate || new Date())}
									onDateChange={(args) => {
										onDueDateSubmit(args);
										setEditDueDate(false);
										if (switchOnSelect) {
											setEditCustomer(true);
										}
									}}
									duration={item.unit}
								/>
							</>
						) : (
							<>
								{(dueDate && (
									<>
										{
											+(
												moment(dueDate).diff(
													moment(),
													'days',
												) - item.unit
											).toFixed(2)
										}{' '}
										<Plural
											value={
												moment(dueDate).diff(
													moment(),
													'days',
												) - item.unit
											}
											singular="jour"
											plural="jours"
										/>
									</>
								)) || <>&mdash;</>}
							</>
						)}
					</DateInputContainer>
				}
			/>
			<TaskCustomerInput
				editCustomer={editCustomer}
				setEditCustomer={setEditCustomer}
				onCustomerSubmit={onCustomerSubmit}
				item={item}
				disabled={!!customerToken}
			/>
			{!noAttachment && !!item.attachments.length && (
				<TaskIconText
					data-tip="Fichiers joints"
					inactive={editDueDate}
					icon={
						<MaterialIcon
							icon="attach_file"
							size="tiny"
							color={accentGrey}
						/>
					}
					content={
						<>
							{item.attachments.length}{' '}
							<Plural
								singular="fichier"
								plural="fichiers"
								value={item.attachments.length}
							/>
						</>
					}
				/>
			)}
			{!customerToken && item.tags && item.tags.length > 0 && (
				<TaskIconText
					data-tip="Tags"
					inactive={true}
					icon={
						<MaterialIcon
							icon="label"
							size="tiny"
							color={accentGrey}
						/>
					}
					content={
						<>
							{item.tags.map(tag => (
								<Tag
									to={{search: `?tags=${tag.id}`}}
									bg={tag.colorBg}
									color={tag.colorText}
								>
									{tag.name}
								</Tag>
							))}
						</>
					}
				/>
			)}
		</TaskInfos>
	);
}

function Task({
	item,
	customerToken,
	location,
	isDraggable,
	noData,
	baseUrl = 'tasks',
	forwardedRef,
}) {
	const finishItem = useMutation(FINISH_ITEM);
	const unfinishItem = useMutation(UNFINISH_ITEM);
	const updateItem = useMutation(UPDATE_ITEM);
	const focusTask = useMutation(FOCUS_TASK);

	const [setTimeItTook, setSetTimeItTook] = useState(false);
	const [isEditingCustomer, setEditCustomer] = useState(false);
	const [justUpdated, setJustUpdated] = useState(false);

	const setTimeItTookRef = useRef();
	const setTimeItTookValueRef = useRef();
	const iconRef = useRef();

	function finishItemCallback(unit) {
		finishItem({
			variables: {
				itemId: item.id,
				token: customerToken,
				timeItTook: unit,
			},
			optimisticResponse: {
				finishItem: {
					...item,
					status: 'FINISHED',
					timeItTook: unit,
				},
			},
		});
		setJustUpdated(true);
		setSetTimeItTook(false);
	}

	const taskUrlPrefix = customerToken ? `/app/${customerToken}` : '/app';
	const isFinishable
		= (item.status !== 'FINISHED'
			&& (!customerToken && !isCustomerTask(item.type)))
		|| (customerToken && isCustomerTask(item.type));
	const isUnfinishable
		= (item.status === 'FINISHED'
			&& (!customerToken && !isCustomerTask(item.type)))
		|| (customerToken && isCustomerTask(item.type));

	return (
		<div ref={forwardedRef}>
			<TaskContainer
				noData={noData}
				isDraggable={isDraggable}
				ref={setTimeItTookRef}
			>
				<TaskAdd />
				<TaskIcon
					status={item.status}
					type={item.type}
					noData={noData}
					ref={iconRef}
					justUpdated={justUpdated}
					onClick={() => {
						if (!isFinishable && !isUnfinishable) return;

						if (isFinishable) {
							if (customerToken) {
								finishItemCallback(item.unit);
							}
							else if (setTimeItTook) {
								finishItemCallback(
									parseFloat(setTimeItTookValueRef.current()),
								);
								setSetTimeItTook(false);
							}
							else {
								setSetTimeItTook(true);
							}
						}
						else if (isUnfinishable) {
							unfinishItem({
								variables: {
									itemId: item.id,
									token: customerToken,
								},
							});
						}
					}}
				/>
				<TaskContent noData={noData}>
					<TaskHeader
						data-tip={
							setTimeItTook
								? undefined
								: 'Cliquer pour voir le contenu de la tâche'
						}
					>
						{setTimeItTook && (
							<SetTimeContainer>
								<UnitInput
									getValue={setTimeItTookValueRef}
									unit={item.unit}
									onBlur={(unit) => {
										finishItemCallback(unit);
										setSetTimeItTook(false);
									}}
									onSubmit={finishItemCallback}
								/>
								<SetTimeInfos>
									<SetTimeHeadline>
										Temps réellement passé
									</SetTimeHeadline>
									<SetTimeCaption>
										Uniquement visible par vous
									</SetTimeCaption>
								</SetTimeInfos>
							</SetTimeContainer>
						)}
						{item.name ? (
							<TaskHeadingLink
								noData={noData}
								small={setTimeItTook}
								status={item.status}
								to={{
									pathname: `${taskUrlPrefix}/${baseUrl}/${
										item.id
									}`,
									state: {prevSearch: location.search},
								}}
							>
								{item.name}
							</TaskHeadingLink>
						) : (
							<TaskHeadingPlaceholder
								noData={noData}
								small={setTimeItTook}
								to={{
									pathname: `${taskUrlPrefix}/tasks/${
										item.id
									}`,
									state: {prevSearch: location.search},
								}}
							>
								Choisir un titre pour cette tâche
							</TaskHeadingPlaceholder>
						)}
						<TaskActions stayActive={setTimeItTook}>
							<OpenBtn
								data-tip="Description, détails, commentaires, etc."
								to={{
									pathname: `${taskUrlPrefix}/${baseUrl}/${
										item.id
									}`,
									state: {prevSearch: location.search},
								}}
							>
								Ouvrir
							</OpenBtn>
							{baseUrl === 'dashboard' && !isCustomerTask(item) && (
								<Button
									onClick={() => focusTask({
										variables: {
											itemId: item.id,
											for: new Date()
												.toJSON()
												.split('T')[0],
										},
									})
									}
								>
									Ajouter à ma journée
								</Button>
							)}
						</TaskActions>
					</TaskHeader>
					{!noData && !setTimeItTook && (
						<TaskInfosInputs
							taskUrlPrefix={taskUrlPrefix}
							baseUrl={baseUrl}
							location={location}
							item={item}
							customerToken={customerToken}
							onDueDateSubmit={(date) => {
								updateItem({
									variables: {
										itemId: item.id,
										dueDate: date.toISOString(),
									},
									optimisticResponse: {
										__typename: 'Mutation',
										updateItem: {
											__typename: 'Item',
											...item,
											dueDate: date.toISOString(),
										},
									},
								});
							}}
							onCustomerSubmit={(customer) => {
								if (customer === null) {
									updateItem({
										variables: {
											itemId: item.id,
											linkedCustomerId: null,
										},
									});
								}
								else if (customer.value === 'CREATE') {
									setEditCustomer(true);
								}
								else {
									updateItem({
										variables: {
											itemId: item.id,
											linkedCustomerId: customer.value,
										},
									});
								}
							}}
							onUnitSubmit={(unit) => {
								updateItem({
									variables: {
										itemId: item.id,
										unit,
									},
									optimisticResponse: {
										__typename: 'Mutation',
										updateItem: {
											__typename: 'Item',
											...item,
											unit,
										},
									},
								});
							}}
						/>
					)}
				</TaskContent>
				{isEditingCustomer && (
					<CustomerModalAndMail
						onValidate={(customer) => {
							updateItem({
								variables: {
									itemId: item.id,
									linkedCustomerId: customer.id,
								},
							});
						}}
						noSelect
						onDismiss={() => setEditCustomer(false)}
					/>
				)}
			</TaskContainer>
		</div>
	);
}

const RouterTask = withRouter(Task);

export default forwardRef((props, ref) => (
	<RouterTask forwardedRef={ref} {...props} />
));
