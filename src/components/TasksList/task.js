import React, {useState, useRef} from 'react';
import {withRouter} from 'react-router-dom';
import styled from '@emotion/styled/macro';
import moment from 'moment';
import {useMutation, useQuery} from 'react-apollo-hooks';
import useOnClickOutside from 'use-onclickoutside';

import ClockIconSvg from '../../utils/icons/clock.svg';
import HourglassIconSvg from '../../utils/icons/hourglass.svg';
import ClientIconSvg from '../../utils/icons/clienticon.svg';
import DragIconSvg from '../../utils/icons/drag.svg';
import {ITEM_TYPES, itemStatuses} from '../../utils/constants';
import {FINISH_ITEM, UPDATE_ITEM} from '../../utils/mutations';
import {GET_ALL_CUSTOMERS} from '../../utils/queries';

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
	DueDateInputElem,
	DateInputContainer,
} from '../../utils/new/design-system';

import {ArianneElem} from '../ArianneThread';
import DateInput from '../DateInput';
import UnitInput from '../UnitInput';
import Plural from '../Plural';
import CustomerModal from '../CustomerModal';

export const TaskContainer = styled('div')`
	display: flex;
	position: relative;
	margin-bottom: 0.6rem;
	cursor: grab;

	&:after {
		content: '';
		display: block;
		width: 12px;
		height: 18px;
		background: url(${DragIconSvg});
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
			left: -1.8rem;
		}
	}
`;

const TaskAdd = styled('div')``;

const TaskIcon = styled('div')`
	width: 26px;
	height: 26px;
	margin-right: 30px;
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
	margin-top: 1.65rem;
	margin-bottom: 30px;

	&:after,
	&:before {
		content: '';
		display: block;
		border-left: 1px dotted ${mediumGrey};
		position: absolute;
		left: 13px;
	}

	&:before {
		height: 22px;
		top: -3px;
	}

	&:after {
		top: 62px;
		bottom: -13px;
	}
`;

const TaskInfosIcon = styled('div')`
	width: 12px;
	height: 12px;
	background-repeat: no-repeat;
	background-size: contain;
	background-image: url(${props => props.icon});
	margin-right: 0.4rem;
`;

const TaskContent = styled('div')`
	flex: 1;
	margin-top: 16px;
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
`;

const TaskHeader = styled('div')`
	display: flex;
	justify-content: space-between;
	align-items: center;
	position: relative;
	cursor: pointer;

	h2 {
		margin: 0.5rem 0;
	}

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

export function TaskCustomerInput({
	editCustomer: editCustomerProp,
	onCustomerSubmit,
	item,
}) {
	const {
		data: {me},
		errors: errorsCustomers,
	} = useQuery(GET_ALL_CUSTOMERS);
	const clientName = item.linkedCustomer && item.linkedCustomer.name;
	const [editCustomer, setEditCustomer] = useState(editCustomer);

	return (
		<TaskIconText
			inactive={editCustomer}
			icon={<TaskInfosIcon icon={ClientIconSvg} />}
			content={
				editCustomer ? (
					<ArianneElem
						id="projects"
						list={[
							{id: 'CREATE', name: 'Créer un nouveau client'},
							...me.customers,
						]}
						defaultMenuIsOpen={true}
						defaultValue={
							item.linkedCustomer && {
								value: item.linkedCustomer.id,
								label: item.linkedCustomer.name,
							}
						}
						autoFocus={true}
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
						onClick={() => {
							setEditCustomer(true);
						}}
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
	onDueDateSubmit,
	onUnitSubmit,
	onCustomerSubmit,
	startOpen,
	switchOnSelect,
	location,
}) {
	const [editCustomer, setEditCustomer] = useState(false);
	const [editDueDate, setEditDueDate] = useState(false);
	const [editUnit, setEditUnit] = useState(startOpen);
	const dateRef = useRef();

	useOnClickOutside(dateRef, () => {
		setEditDueDate(false);
	});

	return (
		<TaskInfos>
			{!noComment && (
				<TaskInfosItemLink
					to={{
						pathname: `/app/tasks/${item.id}`,
						state: {prevSearch: location.search},
					}}
				>
					<CommentIcon>
						{item.comments.length > 0 ? item.comments.length : '+'}
					</CommentIcon>
				</TaskInfosItemLink>
			)}
			<TaskIconText
				inactive={editUnit}
				icon={<TaskInfosIcon icon={ClockIconSvg} />}
				content={
					editUnit ? (
						<UnitInput
							unit={item.unit}
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
						<div onClick={() => setEditUnit(true)}>
							{item.unit}{' '}
							<Plural
								value={item.unit}
								singular="jour"
								plural="jours"
							/>
							{item.timeItTook !== undefined
								&& item.status === 'FINISHED'
								&& ` (${item.timeItTook - item.unit}) `}
						</div>
					)
				}
			/>
			<TaskIconText
				inactive={editDueDate}
				icon={<TaskInfosIcon icon={HourglassIconSvg} />}
				content={
					<DateInputContainer
						onClick={() => !editDueDate && setEditDueDate(true)}
					>
						{editDueDate ? (
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
			/>
		</TaskInfos>
	);
}

function Task({item, token, location}) {
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
				token,
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

	return (
		<TaskContainer>
			<TaskAdd />
			<TaskIcon status={item.status} type={item.type} />
			<TaskContent>
				<TaskHeader>
					<TaskHeading small={setTimeItTook}>{item.name}</TaskHeading>
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
									to={{
										pathname: `/app/tasks/${item.id}`,
										state: {prevSearch: location.search},
									}}
								>
									Modifier
								</OpenBtn>
								{item.status !== 'FINISHED' && (
									<Button
										icon="✓"
										onClick={() => setSetTimeItTook(true)}
									>
										Fait
									</Button>
								)}
							</>
						)}
					</TaskActions>
				</TaskHeader>
				<TaskInfosInputs
					location={location}
					item={item}
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
					onCustomerSubmit={({value}) => {
						if (value === 'CREATE') {
							setEditCustomer(true);
						}
						else {
							updateItem({
								variables: {
									itemId: item.id,
									linkedCustomerId: value,
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
