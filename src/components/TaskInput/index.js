import styled from '@emotion/styled';
import PropTypes from 'prop-types';
import React, {useEffect, useRef, useState} from 'react';
import {useMutation} from 'react-apollo-hooks';
import useOnClickOutside from 'use-onclickoutside';

import {BREAKPOINTS, ITEM_TYPES} from '../../utils/constants';
import {CREATE_TAG} from '../../utils/mutations';
import {
	Button,
	lightGrey,
	mediumGrey,
	primaryBlack,
	primaryGrey,
	primaryPurple,
	TaskInputDropdown,
	TaskInputDropdownHeader,
} from '../../utils/new/design-system';
import CheckList from '../CheckList';
import CustomerModalAndMail from '../CustomerModalAndMail';
import TagDropdown from '../TagDropdown';
import TaskCustomerInput from '../TaskCustomerInput';
import TaskInfosInputs from '../TaskInfosInputs';
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
		top: 2.2rem;
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
	const [itemUnit, setItemUnit] = useState(0);
	const [itemTags, setItemTags] = useState([]);
	const [itemDueDate, setItemDueDate] = useState();
	const [files, setFiles] = useState([]);
	const [itemCustomer, setItemCustomer] = useState();
	const ref = useRef();
	const inputRef = useRef();

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
			<InputContainer>
				<Tooltip label="Définir le type de tâche">
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
							Presser `Tab` pour changer de paramètre.
							<br />
							`Entrée` pour valider
						</p>
					}
				>
					<Input
						data-multiline
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
											unit: parseFloat(itemUnit || 0),
											linkedCustomerId:
												itemCustomer && itemCustomer.id,
											tags: itemTags.map(({id}) => id),
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
							focus
								? `Titre de la tâche ou ${
									currentProjectId
										? 'de la section'
										: 'du projet'
								  }. Commencez par "/" pour changer le type de tâche`
								: `Ajouter une tâche ou créer ${
									currentProjectId
										? 'une section'
										: 'un projet'
								  }`
						}
					/>
				</Tooltip>
				{(focus || value) && (
					<InputButtonWrapper>
						<InputButtonContainer>
							<Tooltip label="Touche entrée pour créer la tâche">
								<Button
									icon="↵"
									id="create-task-button"
									onClick={() => {
										if (!value.startsWith('/')) {
											if (
												type === 'CONTENT_ACQUISITION'
											) {
												if (
													showContentAcquisitionInfos
												) {
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
														tags: itemTags.map(
															({id}) => id,
														),
													});
													setValue('');
													closeMoreInfos();
													closeContentAcquisitionInfos();
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
													unit: parseFloat(
														itemUnit || 0,
													),
													linkedCustomerId:
														itemCustomer
														&& itemCustomer.id,
													tags: itemTags.map(
														({id}) => id,
													),
												});
												setValue('');
												closeMoreInfos();
												closeContentAcquisitionInfos();
											}
										}
									}}
								>
									créer la{' '}
									{type === 'SECTION' ? 'section' : 'tâche'}
								</Button>
							</Tooltip>
							{type !== 'SECTION' && onSubmitSection && (
								<Tooltip label="Flèche du bas pour créer un ensemble de tâches">
									<Button
										icon="↓"
										onClick={() => onSubmitSection({name: value})
										}
									>
										Créer une section
									</Button>
								</Tooltip>
							)}
						</InputButtonContainer>
					</InputButtonWrapper>
				)}
			</InputContainer>
			<TaskInfosInputsContainer>
				<UnitWithSuggestionsForm
					small
					onChange={unit => setItemUnit(unit)}
				/>
				<TagDropdown
					id="tags"
					long
					placeholder="Ajouter ou créer un tag"
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
							tags.map(tag => ({
								id: tag.value,
								name: tag.label,
								colorBg: tag.colorBg,
								colorText: tag.colorText,
							})),
						);
					}}
				/>
			</TaskInfosInputsContainer>
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
};

TaskInput.propTypes = {
	defaultValue: PropTypes.string,
	onSubmitTask: PropTypes.func,
	onSubmitProject: PropTypes.func,
	onSubmitSection: PropTypes.func,
};

export default TaskInput;
