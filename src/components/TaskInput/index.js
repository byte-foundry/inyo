import PropTypes from 'prop-types';
import styled from '@emotion/styled';
import React, {useState, useRef} from 'react';
import useOnClickOutside from 'use-onclickoutside';

import TaskTypeDropdown from '../TaskTypeDropdown';
import {TaskInfosInputs, TaskCustomerInput} from '../TasksList/task';
import CheckList from '../CheckList';
import CustomerModal from '../CustomerModal';

import {ITEM_TYPES} from '../../utils/constants';
import {
	Button,
	TaskInputDropdown,
	TaskInputDropdownHeader,
} from '../../utils/new/design-system';

const Container = styled('div')`
	font-size: 14px;
	position: relative;
`;

const InputContainer = styled('div')`
	display: flex;
	align-items: center;
	padding-left: 0.3rem;
	margin-left: -7px;
`;

const TaskInfosContainer = styled('div')``;

const InputButtonWrapper = styled('div')`
	position: relative;
`;

const InputButtonContainer = styled('div')`
	position: absolute;
	display: flex;
	flex-flow: column nowrap;
	right: calc(-100% + 10px);
	top: -13px;
	width: 155px;

	button {
		background: rgba(255, 255, 255, 0.5);
	}

	& ${Button}:first-of-type {
		margin-bottom: 0.75rem;
	}
`;

const Input = styled('input')`
	flex: 1;
	background-color: #f5f2fe;
	border: none;
	border-radius: 20px;
	padding: 0.5rem 1.2rem 0.5rem 4rem;
	margin-left: -2.2rem;
	color: #5020ee;
	font-size: 18px;
	border: 1px solid transparent;
	transition: all 400ms ease;

	&::placeholder {
		color: #888;
		font-size: 14px;
		font-style: italic;
		font-family: 'Work Sans', sans-serif;
	}

	&:focus {
		outline: none;
		outline: 0;
		box-shadow: none;
		background: #fff;
		border: 1px solid #f5f2fe;
		transition: all 400ms ease;
	}
`;

const Icon = styled('div')`
	display: flex;
	justify-content: center;
	align-items: center;
	background-color: ${props => (props.active ? 'transparent' : '#5020ee')};
	color: #fff;
	border: 2px solid transparent;
	border-radius: 50%;
	width: 26px;
	height: 26px;
	font-size: 24px;
	z-index: 0;
	transition: all 400ms ease;
	cursor: pointer;

	&:hover {
		border: 2px solid ${props => (props.active ? 'transparent' : '#5020ee')};
		color: #5020ee;
		background-color: #fff;
		transition: all 400ms ease;
	}
`;

const TaskInfosInputsContainer = styled('div')`
	position: absolute;
	top: 54px;
	left: 94px;
`;

const TaskInputCheckListContainer = styled('div')`
	margin-left: 2em;
`;

const types = ITEM_TYPES;

const TaskInput = ({onSubmitProject, onSubmitTask, defaultValue}) => {
	const [value, setValue] = useState(defaultValue);
	const [type, setType] = useState('');
	const [focus, setFocus] = useState(false);
	const [isEditingCustomer, setEditCustomer] = useState(false);
	const [focusByClick, setFocusByClick] = useState(false);
	const [moreInfosMode, setMoreInfosMode] = useState(false);
	const [
		showContentAcquisitionInfos,
		setShowContentAcquisitionInfos,
	] = useState(false);
	const [itemUnit, setItemUnit] = useState(0);
	const [itemDueDate, setItemDueDate] = useState();
	const [files, setFiles] = useState([]);
	const [itemCustomer, setItemCustomer] = useState();
	const ref = useRef();
	const inputRef = useRef();

	useOnClickOutside(ref, () => {
		setFocus(false);
		setFocusByClick(false);
	});

	let icon = '+';

	if (type) {
		({icon} = types.find(t => t.type === type));
	}
	else if (!value.startsWith('/') && value.length > 0) {
		({icon} = types.find(t => t.type === 'DEFAULT'));
	}

	return (
		<Container ref={ref}>
			<InputContainer>
				<Icon onClick={() => setFocusByClick(true)} active={type}>
					{icon}
				</Icon>
				<Input
					ref={inputRef}
					type="text"
					onChange={e => setValue(e.target.value)}
					value={value}
					onFocus={() => setFocus(true)}
					onKeyDown={(e) => {
						if (!value.startsWith('/')) {
							if (e.key === 'ArrowUp') {
								onSubmitProject({
									name: value,
								});
								setValue('');
								setMoreInfosMode(false);
								setShowContentAcquisitionInfos(false);
							}
							else if (e.key === 'Enter') {
								if (!type || type === 'DEFAULT') {
									onSubmitTask({
										name: value,
										type: type || 'DEFAULT',
										dueDate:
											itemDueDate
											&& itemDueDate.toISOString(),
										unit: parseFloat(itemUnit || 0),
										linkedCustomerId:
											itemCustomer && itemCustomer.id,
									});
									setValue('');
									setMoreInfosMode(false);
								}
								else if (type === 'CONTENT_ACQUISITION') {
									if (showContentAcquisitionInfos) {
										onSubmitTask({
											name: value,
											type: type || 'DEFAULT',
											linkedCustomerId:
												itemCustomer && itemCustomer.id,
											description: `\n# content-acquisition-list\n${files
												.map(
													({checked, name}) => `- [${
														checked ? 'x' : ' '
													}] ${name}`,
												)
												.join('\n')}`,
										});
										setValue('');
										setMoreInfosMode(false);
										setShowContentAcquisitionInfos(false);
									}
									else {
										setShowContentAcquisitionInfos(true);
									}
								}
							}
							else if (e.key === 'Tab' && value.length > 0) {
								if (!type || type === 'DEFAULT') {
									setMoreInfosMode(true);
								}
								else if (type === 'CONTENT_ACQUISITION') {
									setShowContentAcquisitionInfos(true);
								}
							}
						}
						if (e.key === 'Escape') {
							setValue('');
							setFocusByClick(false);
							setMoreInfosMode(false);
							setShowContentAcquisitionInfos(false);
						}
					}}
					placeholder={
						focus
							? 'Taper / pour choisir un type de tâche'
							: 'Ajouter une tâche ou créer un projet'
					}
				/>
				{value && (
					<InputButtonWrapper>
						<InputButtonContainer>
							<Button
								icon="↵"
								grey
								onClick={() => {
									if (!value.startsWith('/')) {
										if (!type || type === 'DEFAULT') {
											onSubmitTask({
												name: value,
												type: type || 'DEFAULT',
												dueDate:
													itemDueDate
													&& itemDueDate.toISOString(),
												unit: parseFloat(itemUnit || 0),
												linkedCustomerId:
													itemCustomer
													&& itemCustomer.id,
											});
											setValue('');
											setMoreInfosMode(false);
										}
										else if (
											type === 'CONTENT_ACQUISITION'
										) {
											if (showContentAcquisitionInfos) {
												onSubmitTask({
													name: value,
													type: type || 'DEFAULT',
													linkedCustomerId:
														itemCustomer
														&& itemCustomer.id,
													description:
														files.length > 0
															? `\n# content-acquisition-list\n${files
																.map(
																	({
																		checked,
																		name,
																	}) => `- [${
																		checked
																			? 'x'
																			: ' '
																	}] ${name}`,
																)
																.join(
																	'\n',
																)}`
															: '',
												});
												setValue('');
												setMoreInfosMode(false);
												setShowContentAcquisitionInfos(
													false,
												);
											}
											else {
												setShowContentAcquisitionInfos(
													true,
												);
											}
										}
									}
								}}
							>
								Creér la tâche
							</Button>
							<Button
								icon="↑"
								onClick={() => onSubmitProject({name: value})}
							>
								Creér un projet
							</Button>
						</InputButtonContainer>
					</InputButtonWrapper>
				)}
			</InputContainer>
			{moreInfosMode && (
				<TaskInfosInputsContainer>
					<TaskInfosInputs
						startOpen
						switchOnSelect
						item={{
							dueDate: itemDueDate,
							unit: itemUnit,
							linkedCustomer: itemCustomer,
						}}
						noComment
						onDueDateSubmit={date => setItemDueDate(date)}
						onCustomerSubmit={(customer) => {
							if (customer.value === 'CREATE') {
								setEditCustomer(true);
							}
							else {
								setItemCustomer({
									id: customer.value,
									name: customer.label,
								});
							}
						}}
						onUnitSubmit={unit => setItemUnit(unit)}
					/>
				</TaskInfosInputsContainer>
			)}
			{showContentAcquisitionInfos && (
				<TaskInputDropdown>
					<TaskInputDropdownHeader>
						Récupération de contenu
					</TaskInputDropdownHeader>
					<TaskInputCheckListContainer>
						<TaskCustomerInput
							item={{
								linkedCustomer: itemCustomer,
							}}
							noComment
							onCustomerSubmit={customer => setItemCustomer({
								id: customer.value,
								name: customer.label,
							})
							}
						/>
					</TaskInputCheckListContainer>
					<TaskInputDropdownHeader>
						Liste des documents a récuperer
					</TaskInputDropdownHeader>
					<TaskInputCheckListContainer>
						<CheckList
							editable={true} // editable by user only, but checkable
							items={files}
							onChange={({items}) => {
								setFiles(items);
							}}
						/>
					</TaskInputCheckListContainer>
				</TaskInputDropdown>
			)}
			{((value.startsWith('/') && focus) || focusByClick) && (
				<TaskTypeDropdown
					types={types}
					filter={value.substr(1)}
					onSelectCommand={({type: selectedType}) => {
						setType(selectedType);

						setValue('');
						inputRef.current.focus();
						setFocusByClick(false);
						setMoreInfosMode(false);
						setItemDueDate();
						setItemCustomer();
						setItemUnit();
					}}
				/>
			)}
			{isEditingCustomer && (
				<CustomerModal
					onValidate={(selected) => {
						setItemCustomer(selected.customer);
						setEditCustomer(false);
					}}
					selectedCustomerId={''}
					onDismiss={() => setEditCustomer(false)}
				/>
			)}
		</Container>
	);
};

TaskInput.defaultProps = {
	defaultValue: '',
	onSubmitTask: () => {},
	onSubmitProject: () => {},
};

TaskInput.propTypes = {
	defaultValue: PropTypes.string,
	onSubmitTask: PropTypes.func,
	onSubmitProject: PropTypes.func,
};

export default TaskInput;
