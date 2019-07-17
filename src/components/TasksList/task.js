import styled from '@emotion/styled/macro';
import React, {forwardRef, useRef, useState} from 'react';
import {useMutation} from 'react-apollo-hooks';
import {Link, withRouter} from 'react-router-dom';

import {BREAKPOINTS, ITEM_TYPES, itemStatuses} from '../../utils/constants';
import {isCustomerTask} from '../../utils/functions';
import DragIconSvg from '../../utils/icons/drag.svg';
import {
	FINISH_ITEM,
	FOCUS_TASK,
	UNFINISH_ITEM,
	UPDATE_ITEM,
} from '../../utils/mutations';
import {
	Button,
	ButtonLink,
	lightGrey,
	mediumGrey,
	primaryBlack,
	primaryGrey,
	primaryPurple,
	TaskHeading,
} from '../../utils/new/design-system';
import CustomerModalAndMail from '../CustomerModalAndMail';
import TaskInfosInputs from '../TaskInfosInputs';
import Tooltip from '../Tooltip';
import UnitInput from '../UnitInput';

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
	margin-top: ${props => (props.noData ? '0.1rem' : '0.6rem')};
	margin-bottom: 0;

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
		top: 0;
	}

	&:after {
		top: 62px;
		bottom: -10px;
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

const OpenBtn = styled(ButtonLink)`
	color: ${primaryGrey};
	border-color: transparent;
	background: transparent;
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

function Task({
	item,
	customerToken,
	location,
	isDraggable,
	noData,
	baseUrl = 'tasks',
	forwardedRef,
}) {
	const [finishItem] = useMutation(FINISH_ITEM);
	const [unfinishItem] = useMutation(UNFINISH_ITEM);
	const [updateItem] = useMutation(UPDATE_ITEM);
	const [focusTask] = useMutation(FOCUS_TASK);

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
					assigned={item.assignee}
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
					<Tooltip
						label={
							!setTimeItTook
							&& 'Cliquer pour voir le contenu de la tâche'
						}
					>
						<TaskHeader>
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
										pathname: `${taskUrlPrefix}/${baseUrl}/${item.id}`,
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
								<OpenBtn
									data-tip="Description, détails, commentaires, etc."
									to={{
										pathname: `${taskUrlPrefix}/${baseUrl}/${item.id}`,
										state: {prevSearch: location.search},
									}}
								>
									Ouvrir
								</OpenBtn>
								{baseUrl === 'dashboard'
									&& !isCustomerTask(item.type) && (
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
					</Tooltip>
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
