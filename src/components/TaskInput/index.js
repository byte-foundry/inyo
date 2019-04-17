import PropTypes from 'prop-types';
import styled from '@emotion/styled';
import React, {useState, useRef} from 'react';
import useOnClickOutside from 'use-onclickoutside';
import ReactTooltip from 'react-tooltip';

import TaskTypeDropdown from '../TaskTypeDropdown';
import {TaskInfosInputs, TaskCustomerInput} from '../TasksList/task';
import CheckList from '../CheckList';
import CustomerModalAndMail from '../CustomerModalAndMail';

import {ITEM_TYPES, TOOLTIP_DELAY, BREAKPOINTS} from '../../utils/constants';
import {
	Button,
	TaskInputDropdown,
	TaskInputDropdownHeader,
	primaryPurple,
	mediumPurple,
	lightPurple,
	primaryGrey,
	lightGrey,
	accentGrey,
} from '../../utils/new/design-system';

const Container = styled('div')`
	font-size: 14px;
	position: relative;
`;

const InputContainer = styled('div')`
	display: flex;
	align-items: center;
	padding-left: 0.3rem;
	margin-left: -10px;
	position: relative;

	@media (max-width: ${BREAKPOINTS}px) {
		margin-left: 0;
		width: calc(100% + 3px);
	}
`;

const InputButtonWrapper = styled('div')`
	position: relative;
`;

const InputButtonContainer = styled('div')`
	position: absolute;
	display: flex;
	flex-flow: column nowrap;
	right: calc(-100% + 1rem);
	top: -13px;
	width: 166px;

	@media (max-width: ${BREAKPOINTS}px) {
		flex-direction: row;
		width: calc(50vh - 3rem);
		top: 1.5rem;
		right: 0;
		display: flex;
		flex-direction: row-reverse;
		justify-content: space-between;

		button + button {
			margin: 0 0.25rem 0 0;
		}
	}

	button {
		background: rgba(255, 255, 255, 0.5);

		&:after {
			content: 'ou';
			color: ${primaryGrey};
			position: absolute;
			left: -1.2rem;
		}

		@media (max-width: ${BREAKPOINTS}px) {
			flex: 1;
			color: ${primaryPurple};
			border-color: ${primaryPurple};

			&:after {
				display: none;
			}
		}
	}

	& ${Button}:first-of-type {
		margin-bottom: 2rem;

		&:after {
			display: none;
		}

		@media (max-width: ${BREAKPOINTS}px) {
			margin: 0;
		}
	}
`;

const Input = styled('input')`
	display: flex;
	flex: 1;
	background-color: ${lightGrey};
	border-radius: 2rem;
	padding: 1rem 1.2rem 1rem 5rem;
	margin-left: -3rem;
	color: ${primaryPurple};
	font-size: 1.2rem;
	border: 1px solid ${accentGrey};
	transition: all 400ms ease;

	&:hover {
		background-color: ${lightPurple};
		animation: all 400ms ease;
	}

	&::placeholder {
		color: ${mediumPurple};
		font-size: 14px;
		align-items: center;
		font-style: italic;
		font-family: 'Work Sans', sans-serif;
	}

	&:focus {
		appearance: none;
		outline: none;
		outline: 0;
		box-shadow: none;
		background: #fff;
		border: 1px solid ${mediumPurple};
		transition: all 400ms ease;
	}

	@media (max-width: ${BREAKPOINTS}px) {
		font-size: 1rem;
		margin-left: -2rem;
		padding: 0.5rem 1.2rem 0.5rem 5rem;
		padding-left: 3rem;
	}
`;

const Icon = styled('div')`
	display: flex;
	justify-content: center;
	align-items: center;
	background-color: ${props => (props.active ? 'transparent' : primaryPurple)};
	color: #fff;
	border: 2px solid transparent;
	border-radius: 50%;
	width: 2rem;
	height: 2rem;
	font-size: 1.2rem;
	z-index: 0;
	transition: all 400ms ease;
	cursor: pointer;

	&:hover {
		border: 2px dashed
			${props => (props.active ? 'transparent' : primaryPurple)};
		color: ${primaryPurple};
		background-color: #fff;
		transition: all 400ms ease;
	}

	@media (max-width: ${BREAKPOINTS}px) {
		width: 1rem;
		height: 1rem;
		font-size: 1rem;
	}
`;

const TaskInfosInputsContainer = styled('div')`
	position: absolute;
	top: 61px;
	left: 57px;
`;

const TaskInputCheckListContainer = styled('div')`
	margin-left: 2em;
`;

const types = ITEM_TYPES;

const TaskInput = ({
	onSubmitProject,
	onSubmitSection,
	onSubmitTask,
	defaultValue,
	currentProjectId,
}) => {
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

	let icon = '▾';

	if (type) {
		({icon} = types.find(t => t.type === type));
	}
	else if (!value.startsWith('/') && value.length > 0) {
		({icon} = types.find(t => t.type === 'DEFAULT'));
	}

	return (
		<Container ref={ref}>
			<ReactTooltip effect="solid" delayShow={TOOLTIP_DELAY} />
			<InputContainer>
				<Icon
					data-tip="Définir le type de tâche"
					onClick={() => setFocusByClick(true)}
					active={type}
				>
					{icon}
				</Icon>
				<Input
					data-multiline
					data-tip="Presser `Tab` pour changer de paramètre<br/>`Entrée` pour valider"
					ref={inputRef}
					type="text"
					onChange={e => setValue(e.target.value)}
					value={value}
					onFocus={() => setFocus(true)}
					onKeyDown={(e) => {
						if (!value.startsWith('/')) {
							if (e.key === 'ArrowUp' && onSubmitProject) {
								onSubmitProject({
									name: value,
								});
								setValue('');
								setMoreInfosMode(false);
								setShowContentAcquisitionInfos(false);
							}
							else if (
								e.key === 'ArrowDown'
								&& onSubmitSection
							) {
								onSubmitSection({
									name: value,
								});
								setValue('');
								setMoreInfosMode(false);
								setShowContentAcquisitionInfos(false);
							}
							else if (e.key === 'Enter') {
								e.preventDefault();
								if (type === 'CONTENT_ACQUISITION') {
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
								else {
									onSubmitTask({
										name: value,
										type: type || 'DEFAULT',
										dueDate:
											itemDueDate
											&& itemDueDate.toISOString(),
										unit: parseFloat(itemUnit || 0),
										linkedCustomer:
											itemCustomer && !itemCustomer.id
												? itemCustomer
												: undefined,
										linkedCustomerId:
											itemCustomer && itemCustomer.id,
									});
									setValue('');
									setMoreInfosMode(false);
								}
							}
							else if (e.key === 'Tab') {
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
							? `Entrer le titre de la tâche ou ${
								currentProjectId
									? 'de la section'
									: 'du projet'
							  }. Taper un slash "/" pour changer le type de tâche`
							: `Ajouter une tâche ou créer ${
								currentProjectId
									? 'une section'
									: 'un projet'
							  }`
					}
				/>
				{(focus || value) && (
					<InputButtonWrapper>
						<ReactTooltip
							effect="solid"
							delayShow={TOOLTIP_DELAY}
						/>
						<InputButtonContainer>
							<Button
								data-tip="Touche entrée pour créer la tâche"
								icon="↵"
								onClick={() => {
									if (!value.startsWith('/')) {
										if (type === 'CONTENT_ACQUISITION') {
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
										else {
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
									}
								}}
							>
								créer la tâche
							</Button>
							{onSubmitProject && (
								<Button
									data-tip="Flèche du haut pour créer un projet"
									icon="↑"
									onClick={() => onSubmitProject({name: value})
									}
								>
									créer un projet
								</Button>
							)}
							{onSubmitSection && (
								<Button
									data-tip="Flèche du bas pour créer un ensemble de tâches"
									icon="↓"
									onClick={() => onSubmitSection({name: value})
									}
								>
									Créer une section
								</Button>
							)}
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
						noAttachment
						onDueDateSubmit={date => setItemDueDate(date)}
						onCustomerSubmit={(customer) => {
							if (customer === null) {
								setItemCustomer();
							}
							else if (customer.value === 'CREATE') {
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
						Choisir un client
					</TaskInputDropdownHeader>
					<TaskInputCheckListContainer>
						<TaskCustomerInput
							item={{
								linkedCustomer: itemCustomer,
							}}
							noComment
							onCustomerSubmit={(customer) => {
								if (customer === null) {
									setItemCustomer();
								}
								else if (customer.value === 'CREATE') {
									setEditCustomer(true);
								}
								else {
									setItemCustomer({
										id: customer.value,
										name: customer.label,
									});
								}
							}}
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
					filter={value.startsWith('/') ? value.substr(1) : ''}
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
				<CustomerModalAndMail
					onValidate={(customer) => {
						setItemCustomer(customer);
					}}
					noSelect
					onDismiss={() => setEditCustomer(false)}
				/>
			)}
		</Container>
	);
};

TaskInput.defaultProps = {
	defaultValue: '',
	onSubmitTask: () => {},
};

TaskInput.propTypes = {
	defaultValue: PropTypes.string,
	onSubmitTask: PropTypes.func,
	onSubmitProject: PropTypes.func,
	onSubmitSection: PropTypes.func,
};

export default TaskInput;
