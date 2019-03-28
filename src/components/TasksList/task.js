import React, {useState, useRef} from 'react';
import {withRouter, Link} from 'react-router-dom';
import styled from '@emotion/styled/macro';
import moment from 'moment';
import {useMutation, useQuery} from 'react-apollo-hooks';
import useOnClickOutside from 'use-onclickoutside';

import ClockIconSvg from '../../utils/icons/clock.svg';
import FilesIconSvg from '../../utils/icons/file.svg';
import DateIconSvg from '../../utils/icons/date.svg';
import ClientIconSvg from '../../utils/icons/clienticon.svg';
import DragIconSvg from '../../utils/icons/drag.svg';
import {ITEM_TYPES, itemStatuses, BREAKPOINTS} from '../../utils/constants';
import {FINISH_ITEM, UPDATE_ITEM} from '../../utils/mutations';

import {
	Button,
	ButtonLink,
	TaskHeading,
	CommentIcon,
	TaskIconText,
	TaskInfosItem,
	TaskInfosItemLink,
	primaryPurple,
	primaryGrey,
	lightGrey,
	mediumGrey,
	primaryBlack,
	DueDateInputElem,
	DateInputContainer,
} from '../../utils/new/design-system';

import CustomerDropdown from '../CustomersDropdown';
import DateInput from '../DateInput';
import UnitInput from '../UnitInput';
import Plural from '../Plural';
import CustomerModal from '../CustomerModal';

export const TaskContainer = styled('div')`
	display: flex;
	margin-bottom: 0.6rem;
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
		margin-bottom: 0.85rem;

		&:after {
			display: none;
		}
	}
`;

const TaskAdd = styled('div')``;

const TaskIcon = styled('div')`
	width: 1.75rem;
	height: 1.75rem;
	margin-right: ${props => (props.noData ? '.5rem' : '2rem')};
	background: center no-repeat
		url(${(props) => {
		const typeInfos
				= ITEM_TYPES.find(t => t.type === props.type) || ITEM_TYPES[0];

		let icon = typeInfos.iconUrl;

		if (props.status === itemStatuses.FINISHED) {
			icon = typeInfos.iconUrlValidated || typeInfos.iconUrl;
		}
		return icon;
	}});
	margin-top: ${props => (props.noData ? '0.1rem' : '1.55rem')};
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

	@media (max-width: ${BREAKPOINTS}px) {
		transform: scale(0.6);
		margin: 0 0.5rem 0 0;

		&:after,
		&:before {
			display: none;
		}
	}
`;

const TaskInfosIcon = styled('div')`
	width: 0.8rem;
	height: 0.8rem;
	background-repeat: no-repeat;
	background-size: contain;
	background-image: url(${props => props.icon});
	margin-right: 0.4rem;
`;

const TaskContent = styled('div')`
	flex: 1;
	margin-top: ${props => (props.noData ? '0' : '1rem')};

	@media (max-width: ${BREAKPOINTS}px) {
		margin: 0.2rem 0 0 0;
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
	text-decoration: none;
	margin: 0.5rem 0;
	margin: ${props => (props.noData ? '0.1rem 0' : '0.5rem 0')};
	color: ${primaryBlack};

	@media (max-width: ${BREAKPOINTS}px) {
		font-size: 1rem;
		display: block;
	}
`;

const TaskActions = styled('div')`
	opacity: ${props => (props.stayActive ? 1 : 0)};
	margin-right: ${props => (props.stayActive ? 0 : -100)}px;
	pointer-events: none;
	transition: opacity 200ms ease-out, margin-right 200ms ease-out;
	display: flex;

	form {
		input {
			padding-left: 1rem;
		}
		label {
			margin-top: -0.35rem;
		}
	}

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

const SetTimeContainer = styled('div')`
	display: flex;
`;

const SetTimeInfos = styled('div')`
	display: flex;
	flex-flow: column nowrap;
	margin-right: 10px;
	text-align: right;
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
`;

const isCustomerTask = task => ['CUSTOMER', 'CONTENT_ACQUISITION', 'VALIDATION'].includes(task.type);

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
			icon={<TaskInfosIcon icon={ClientIconSvg} />}
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
}) {
	const [editCustomer, setEditCustomer] = useState(false);
	const [editDueDate, setEditDueDate] = useState(false);
	const [editUnit, setEditUnit] = useState(startOpen);
	const dateRef = useRef();

	useOnClickOutside(dateRef, () => {
		setEditDueDate(false);
	});

	let unreadCommentLength = item.comments.length;

	if (!noComment && item.comments.length > 0) {
		unreadCommentLength = item.comments.filter(
			comment => !comment.views.find(
				e => e.viewer.__typename
						=== (customerToken ? 'Customer' : 'User'),
			),
		).length;
	}

	return (
		<TaskInfos>
			{!noComment && (
				<TaskInfosItemLink
					to={{
						pathname: `${taskUrlPrefix}/tasks/${item.id}`,
						state: {prevSearch: location.search},
					}}
				>
					<CommentIcon
						new={unreadCommentLength > 0}
						data-tip="Ouvrir les commentaires"
					>
						{item.comments.length > 0 ? item.comments.length : '+'}
					</CommentIcon>
				</TaskInfosItemLink>
			)}
			<TaskIconText
				inactive={editUnit}
				icon={<TaskInfosIcon icon={ClockIconSvg} />}
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
							{item.timeItTook ? item.timeItTook : item.unit}{' '}
							<Plural
								value={item.unit}
								singular="jour"
								plural="jours"
							/>
							<span data-tip="Temps dépassé">
								{item.timeItTook !== undefined
									&& item.timeItTook > item.unit
									&& item.timeItTook !== item.unit
									&& item.status === 'FINISHED'
									&& ` (+${item.timeItTook - item.unit}) `}
							</span>
							{/* It is bad, should be a component */}
							<span data-tip="Temps surestimé">
								{!customerToken
									&& item.timeItTook !== undefined
									&& item.timeItTook < item.unit
									&& item.status === 'FINISHED'
									&& ` (${item.timeItTook - item.unit}) `}
							</span>
						</div>
					)
				}
			/>
			<TaskIconText
				data-tip="Marge restante pour commencer la tâche"
				inactive={editDueDate}
				icon={<TaskInfosIcon icon={DateIconSvg} />}
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
									value={moment(
										item.dueDate || new Date(),
									).format('DD/MM/YYYY')}
								/>
								<DateInput
									innerRef={dateRef}
									date={moment(item.dueDate || new Date())}
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
								{(item.dueDate && (
									<>
										{moment(item.dueDate).diff(
											moment(),
											'days',
										) - item.unit}{' '}
										<Plural
											value={item.unit}
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
					icon={<TaskInfosIcon icon={FilesIconSvg} />}
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
		</TaskInfos>
	);
}

function Task({
	item, customerToken, location, isDraggable, noData,
}) {
	const finishItem = useMutation(FINISH_ITEM);
	const updateItem = useMutation(UPDATE_ITEM);

	const [setTimeItTook, setSetTimeItTook] = useState(false);
	const [isEditingCustomer, setEditCustomer] = useState(false);

	const setTimeItTookRef = useRef();

	useOnClickOutside(setTimeItTookRef, () => {
		setSetTimeItTook(false);
	});

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
		setSetTimeItTook(false);
	}

	const taskUrlPrefix = customerToken ? `/app/${customerToken}` : '/app';
	const isFinishable
		= (item.status !== 'FINISHED'
			&& (!customerToken && !isCustomerTask(item)))
		|| (customerToken && isCustomerTask(item));

	return (
		<TaskContainer isDraggable={isDraggable}>
			<TaskAdd />
			<TaskIcon status={item.status} type={item.type} noData={noData} />
			<TaskContent noData={noData}>
				<TaskHeader data-tip="Cliquer pour voir le contenu de la tâche">
					{item.name ? (
						<TaskHeadingLink
							noData={noData}
							small={setTimeItTook}
							to={{
								pathname: `${taskUrlPrefix}/tasks/${item.id}`,
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
								pathname: `${taskUrlPrefix}/tasks/${item.id}`,
								state: {prevSearch: location.search},
							}}
						>
							Choisir un titre pour cette tâche
						</TaskHeadingPlaceholder>
					)}
					<TaskActions stayActive={setTimeItTook}>
						{setTimeItTook ? (
							<SetTimeContainer ref={setTimeItTookRef}>
								<SetTimeInfos>
									<SetTimeHeadline>
										Temps réellement passé
									</SetTimeHeadline>
									<SetTimeCaption>
										Uniquement visible par vous
									</SetTimeCaption>
								</SetTimeInfos>
								<UnitInput
									unit={item.unit}
									onBlur={() => {}}
									onSubmit={finishItemCallback}
									withButton
									cancel={() => setSetTimeItTook(false)}
								/>
							</SetTimeContainer>
						) : (
							<>
								<OpenBtn
									data-tip="Description, détails, commentaires, etc."
									to={{
										pathname: `${taskUrlPrefix}/tasks/${
											item.id
										}`,
										state: {prevSearch: location.search},
									}}
								>
									Ouvrir
								</OpenBtn>
								{isFinishable && (
									<Button
										data-tip="Marquer la tâche comme faite"
										icon="✓"
										onClick={() => {
											if (customerToken) {
												finishItemCallback(item.unit);
											}
											else {
												setSetTimeItTook(true);
											}
										}}
									>
										Fait
									</Button>
								)}
							</>
						)}
					</TaskActions>
				</TaskHeader>
				{!noData && (
					<TaskInfosInputs
						taskUrlPrefix={taskUrlPrefix}
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
				<CustomerModal
					onValidate={(selected) => {
						updateItem({
							variables: {
								itemId: item.id,
								linkedCustomer: selected.customer,
							},
						});
						setEditCustomer(false);
					}}
					noSelect
					onDismiss={() => setEditCustomer(false)}
				/>
			)}
		</TaskContainer>
	);
}

export default withRouter(Task);
