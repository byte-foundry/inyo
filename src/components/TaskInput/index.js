import styled from '@emotion/styled';
import PropTypes from 'prop-types';
import React, {useEffect, useRef, useState} from 'react';
import useOnClickOutside from 'use-onclickoutside';

import fbt from '../../fbt/fbt.macro';
import {useMutation} from '../../utils/apollo-hooks';
import {BREAKPOINTS, ITEM_TYPES} from '../../utils/constants';
import {ModalContainer} from '../../utils/content';
import {CREATE_TAG} from '../../utils/mutations';
import {
	Button,
	lightGrey,
	mediumGrey,
	primaryBlack,
	primaryGrey,
	primaryPurple,
	TaskInputDropdownHeader,
} from '../../utils/new/design-system';
import useUserInfos from '../../utils/useUserInfos';
import CheckList from '../CheckList';
import CustomerModalAndMail from '../CustomerModalAndMail';
import ProjectsDropdown from '../ProjectsDropdown';
import TagDropdown from '../TagDropdown';
import TaskCustomerInput from '../TaskCustomerInput';
import TaskTypeDropdown from '../TaskTypeDropdown';
import Tooltip from '../Tooltip';
import UnitWithSuggestionsForm from '../UnitWithSuggestionsForm';

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

const InputButtonContainer = styled('div')`
	position: absolute;
	display: flex;
	flex-flow: column nowrap;
	right: 1rem;
	bottom: 67px;

	@media (max-width: ${BREAKPOINTS}px) {
		position: static;
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		margin: 0.5rem 0;
	}

	button {
		background: rgba(255, 255, 255, 0.5);

		&:after {
			content: 'ou';
			color: ${primaryGrey};
			position: absolute;
			top: 37%;
			background: white;
			padding: 4px;
			border-radius: 50%;
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

	& ${Button}:last-of-type {
		margin-top: 1.75rem;

		&:after {
			display: none;
		}

		@media (max-width: ${BREAKPOINTS}px) {
			margin: 0;
		}
	}

	@media (max-width: ${BREAKPOINTS}px) {
		${Button} + ${Button} {
			margin-left: 0.25rem;
		}
	}
`;

const Input = styled('input')`
	display: flex;
	flex: 1;
	background-color: ${mediumGrey}; /* #f1f3f4 */
	border-radius: 2rem;
	padding: 0.2rem 1.2rem 0.2rem 5rem;
	margin-left: -2.7rem;
	color: ${primaryPurple};
	font-size: 1.1rem;
	border: 1px solid transparent;
	transition: all 400ms ease;
	height: 2.5rem;

	&:hover {
		background-color: ${lightGrey};
		animation: all 400ms ease;
	}

	&::placeholder {
		color: ${primaryBlack};
		font-size: 15px;
		align-items: center;
		font-family: 'Work Sans', sans-serif;
	}

	&:focus {
		appearance: none;
		outline: none;
		outline: 0;
		box-shadow: none;
		background: #fff;
		border: 1px solid ${mediumGrey};
		box-shadow: 3px 3px 10px ${lightGrey};
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
	display: flex;
	justify-content: space-between;
	align-items: flex-start;
	padding: 10px 0;

	@media (max-width: ${BREAKPOINTS}px) {
		flex-direction: column;
		align-items: stretch;
	}
`;

const TaskInputCheckListContainer = styled('div')`
	margin-left: 2em;
`;

const types = ITEM_TYPES;

const useTrackEventInput = ({focus, openedByClick, value}) => {
	const isTypingCommand = value.startsWith('/');

	useEffect(() => {
		if (focus && isTypingCommand) {
			window.Intercom('trackEvent', 'open-task-dropdown');
			window.Intercom('trackEvent', 'open-task-dropdown-with-slash');
		}
	}, [focus, isTypingCommand]);

	useEffect(() => {
		if (openedByClick) {
			window.Intercom('trackEvent', 'open-task-dropdown');
			window.Intercom('trackEvent', 'open-task-dropdown-with-button');
		}
	}, [openedByClick]);
};

const TaskInput = ({
	onSubmitProject,
	onSubmitSection,
	onSubmitTask,
	defaultValue,
	currentProjectId,
	defaultCustomer,
	withProject,
}) => {
	const [createTag] = useMutation(CREATE_TAG);
	const [value, setValue] = useState(defaultValue);
	const [type, setType] = useState('');
	const [focus, setFocus] = useState(false);
	const [isEditingCustomer, setEditCustomer] = useState(false);
	const [openedByClick, setOpenedByClick] = useState(false);
	const [
		showContentAcquisitionInfos,
		setShowContentAcquisitionInfos,
	] = useState(false);
	const [selectedProject, setSelectedProject] = useState();
	const [itemUnit, setItemUnit] = useState(0);
	const [itemTags, setItemTags] = useState([]);
	const [itemDueDate, setItemDueDate] = useState();
	const [files, setFiles] = useState([]);
	const [itemCustomer, setItemCustomer] = useState();
	const ref = useRef();
	const inputRef = useRef();
	const {workingTime} = useUserInfos();

	function closeMoreInfos() {
		setItemDueDate();
		setItemCustomer();
		setItemUnit(0);
	}

	function closeContentAcquisitionInfos() {
		setShowContentAcquisitionInfos(false);
		setItemCustomer();
		setFiles([]);
	}

	useOnClickOutside(ref, () => {
		setFocus(false);
		setOpenedByClick(false);
	});

	let icon = '▾';

	if (type) {
		({icon} = types.find(t => t.type === type));
	}
	else if (!value.startsWith('/') && value.length > 0) {
		({icon} = types.find(t => t.type === 'DEFAULT'));
	}

	useTrackEventInput({focus, openedByClick, value});

	return (
		<Container ref={ref}>
			{withProject && (
				<ProjectsDropdown
					style={{margin: '0 0 10px auto', width: '250px'}}
					autoFocus
					onChange={(param) => {
						const {value: id} = param || {};

						setSelectedProject(id);
					}}
					children={
						<fbt project="inyo" desc="link to a project">
							Lier à un projet
						</fbt>
					}
					isClearable
				/>
			)}
			<InputContainer id="task-input-container">
				<Tooltip
					label={
						<fbt project="inyo" desc="task input icon tooltip">
							Définir le type de tâche
						</fbt>
					}
				>
					<Icon
						onClick={() => setOpenedByClick(true)}
						active={type}
						id="task-input-type-icon"
					>
						{icon}
					</Icon>
				</Tooltip>
				<Tooltip
					label={
						<p>
							<fbt project="inyo" desc="Enter to create task">
								`Entrée` pour créer une tâche.
							</fbt>
							{currentProjectId && (
								<>
									<br />
									<fbt
										project="inyo"
										desc="notification message"
									>
										↓ pour créer une section
									</fbt>
								</>
							)}
						</p>
					}
				>
					<Input
						data-multiline
						ref={inputRef}
						type="text"
						onChange={e => setValue(e.target.value)}
						value={value}
						onFocus={(e) => {
							// weird, not sure why the onBlur isn't called instead
							setFocus(true);
						}}
						onBlur={() => setFocus(false)}
						onKeyDown={(e) => {
							if (!value.startsWith('/')) {
								if (e.key === 'ArrowUp' && onSubmitProject) {
									onSubmitProject({
										name: value,
									});
									setValue('');
									closeMoreInfos();
									closeContentAcquisitionInfos();
								}
								else if (
									e.key === 'ArrowDown'
									&& onSubmitSection
								) {
									onSubmitSection({
										name: value,
									});
									setValue('');
									closeMoreInfos();
									closeContentAcquisitionInfos();
								}
								else if (e.key === 'Enter') {
									e.preventDefault();
									if (type === 'CONTENT_ACQUISITION') {
										if (showContentAcquisitionInfos) {
											onSubmitTask({
												name: value,
												type: type || 'DEFAULT',
												linkedCustomerId:
													itemCustomer
													&& itemCustomer.id,
												description: `\n# content-acquisition-list\n${files
													.map(
														({checked, name}) => `- [${
															checked
																? 'x'
																: ' '
														}] ${name}`,
													)
													.join('\n')}`,
												tags: itemTags.map(
													({id}) => id,
												),
												projectId: selectedProject,
											});
											setValue('');
											closeMoreInfos();
											closeContentAcquisitionInfos();
										}
										else {
											setItemCustomer(defaultCustomer);
											setShowContentAcquisitionInfos(
												true,
											);
										}
									}
									else if (type === 'SECTION') {
										onSubmitSection({
											name: value,
										});
										setValue('');
										closeMoreInfos();
										closeContentAcquisitionInfos();
									}
									else {
										onSubmitTask({
											name: value,
											type: type || 'DEFAULT',
											dueDate:
												itemDueDate
												&& itemDueDate.toISOString(),
											unit: parseFloat(
												itemUnit || 0.1 / workingTime,
											),
											linkedCustomerId:
												itemCustomer && itemCustomer.id,
											tags: itemTags.map(({id}) => id),
											projectId: selectedProject,
										});
										setValue('');
										closeMoreInfos();
										closeContentAcquisitionInfos();
									}
								}
							}
							if (e.key === 'Escape') {
								setValue('');
								setOpenedByClick(false);
								closeMoreInfos();
								closeContentAcquisitionInfos();
							}
						}}
						placeholder={
							focus ? (
								currentProjectId ? (
									<fbt
										project="inyo"
										desc="focused task input placeholder in project"
									>
										Titre de la tâche ou de la section.
										Commencez par "/" pour changer le type
										de tâche
									</fbt>
								) : (
									<fbt
										project="inyo"
										desc="focused task input placeholder"
									>
										Titre de la tâche. Commencez par "/"
										pour changer le type de tâche
									</fbt>
								)
							) : currentProjectId ? (
								<fbt
									project="inyo"
									desc="unfocused task input placeholder in project"
								>
									Ajouter une tâche ou créer un section.
								</fbt>
							) : (
								<fbt
									project="inyo"
									desc="unfocused task input placeholder"
								>
									Ajouter une tâche.
								</fbt>
							)
						}
					/>
				</Tooltip>
			</InputContainer>
			{(focus || value) && (
				<InputButtonContainer>
					{type !== 'SECTION' && onSubmitSection && (
						<Tooltip
							label={
								<fbt project="inyo" desc="notification message">
									Flèche du bas pour créer un ensemble de
									tâches
								</fbt>
							}
						>
							<Button
								icon="↓"
								onClick={() => onSubmitSection({name: value})}
							>
								<fbt project="inyo" desc="notification message">
									Créer une section
								</fbt>
							</Button>
						</Tooltip>
					)}
					<Tooltip
						label={
							<fbt project="inyo" desc="notification message">
								Touche entrée pour créer la tâche
							</fbt>
						}
					>
						<Button
							icon="↵"
							id="create-task-button"
							onClick={() => {
								if (!value.startsWith('/')) {
									if (type === 'CONTENT_ACQUISITION') {
										setShowContentAcquisitionInfos(true);
									}
									else if (type === 'SECTION') {
										onSubmitSection({
											name: value,
										});
										setValue('');
										closeMoreInfos();
										closeContentAcquisitionInfos();
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
												itemCustomer && itemCustomer.id,
											tags: itemTags.map(({id}) => id),
											projectId: selectedProject,
										});
										setValue('');
										closeMoreInfos();
										closeContentAcquisitionInfos();
									}
								}
							}}
						>
							<fbt project="inyo" desc="notification message">
								créer la{' '}
								<fbt:param name="sectionOrTask">
									{type === 'SECTION' ? (
										<fbt
											project="inyo"
											desc="notification message"
										>
											section
										</fbt>
									) : (
										<fbt
											project="inyo"
											desc="notification message"
										>
											tâche
										</fbt>
									)}
								</fbt:param>
							</fbt>
						</Button>
					</Tooltip>
				</InputButtonContainer>
			)}
			{type !== 'SECTION' && (
				<TaskInfosInputsContainer>
					<UnitWithSuggestionsForm
						small
						onChange={(unit) => {
							setItemUnit(unit);
							window.Intercom(
								'trackEvent',
								'estimated-time-fill-input',
								{
									estimation: unit,
								},
							);
						}}
					/>
					<TagDropdown
						id="tags-dropdown"
						long
						placeholder={
							<fbt project="inyo" desc="add or create a tag">
								Ajouter ou créer un tag
							</fbt>
						}
						value={itemTags.map(tag => ({
							value: tag.id,
							label: tag.name,
							colorBg: tag.colorBg,
							colorText: tag.colorText,
						}))}
						onCreateOption={async (name, colorBg, colorText) => {
							const {
								data: {createTag: tag},
							} = await createTag({
								variables: {
									name,
									colorBg,
									colorText,
								},
							});

							setItemTags([...itemTags, tag]);
						}}
						onChange={(tags) => {
							setItemTags(
								tags
									? tags.map(tag => ({
										id: tag.value,
										name: tag.label,
										colorBg: tag.colorBg,
										colorText: tag.colorText,
									  }))
									: [],
							);
						}}
					/>
				</TaskInfosInputsContainer>
			)}
			{!isEditingCustomer && showContentAcquisitionInfos && (
				<ModalContainer
					onDismiss={() => {
						setShowContentAcquisitionInfos(false);
					}}
				>
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
							editable
							items={files}
							onChange={({items}) => {
								setFiles(items);
							}}
						/>
					</TaskInputCheckListContainer>
					<Button
						disabled={files.length === 0 || !itemCustomer}
						style={{marginLeft: 'auto'}}
						onClick={() => {
							onSubmitTask({
								name: value,
								type: type || 'DEFAULT',
								linkedCustomerId:
									itemCustomer && itemCustomer.id,
								description:
									files.length > 0
										? `\n# content-acquisition-list\n${files
											.map(
												({checked, name}) => `- [${
													checked ? 'x' : ' '
												}] ${name}`,
											)
											.join('\n')}`
										: '',
								tags: itemTags.map(({id}) => id),
								projectId: selectedProject,
							});
							setValue('');
							closeMoreInfos();
							closeContentAcquisitionInfos();
						}}
					>
						Créer la tâche
					</Button>
				</ModalContainer>
			)}
			{((value.startsWith('/') && focus) || openedByClick) && (
				<TaskTypeDropdown
					types={types.filter(
						t => t.type !== 'SECTION' || onSubmitSection,
					)}
					filter={value.startsWith('/') ? value.substr(1) : ''}
					onSelectCommand={({type: selectedType}) => {
						setType(selectedType);

						if (value.startsWith('/')) {
							setValue('');
						}

						inputRef.current.focus();
						setOpenedByClick(false);
						closeMoreInfos();
						closeContentAcquisitionInfos();
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
	withProject: false,
};

TaskInput.propTypes = {
	defaultValue: PropTypes.string,
	withProject: PropTypes.bool,
	onSubmitTask: PropTypes.func,
	onSubmitProject: PropTypes.func,
	onSubmitSection: PropTypes.func,
};

export default TaskInput;
