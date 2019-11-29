import styled from '@emotion/styled';
import PropTypes from 'prop-types';
import React, {useEffect, useRef, useState} from 'react';

import fbt from '../../fbt/fbt.macro';
import {useMutation} from '../../utils/apollo-hooks';
import {BREAKPOINTS, ITEM_TYPES} from '../../utils/constants';
import SectionIconUrl, {
	ReactComponent as SectionIcon,
} from '../../utils/icons/section-icon.svg';
import TaskCustomerIconValidatedUrl, {
	ReactComponent as TaskCustomerIconValidated,
} from '../../utils/icons/taskicon-customer-validated.svg';
import {CREATE_TAG} from '../../utils/mutations';
import {
	Button,
	lightGrey,
	mediumGrey,
	primaryBlack,
	primaryPurple,
} from '../../utils/new/design-system';
import useOnClickOutside from '../../utils/useOnClickOutside';
import useUserInfos from '../../utils/useUserInfos';
import MaterialIcon from '../MaterialIcon';
import ProjectsDropdown from '../ProjectsDropdown';
import TagDropdown from '../TagDropdown';
import Tooltip from '../Tooltip';
import UnitWithSuggestionsForm from '../UnitWithSuggestionsForm';

const Container = styled('div')`
	font-size: 14px;
	position: relative;
`;

const UnitWithSuggestionsFormCondensed = styled(UnitWithSuggestionsForm)`
	display: grid;
	margin-bottom: 10px;
	grid-template-columns: 20% 20% 20% 40%;
`;

const InputContainer = styled('div')`
	display: flex;
	align-items: center;

	position: relative;
`;

const InputButtonContainer = styled('div')``;

const Input = styled('input')`
	color: ${primaryPurple};
	font-size: 1.1rem;
	transition: all 400ms ease;

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

	@media (max-width: ${BREAKPOINTS.mobile}px) {
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

	@media (max-width: ${BREAKPOINTS.mobile}px) {
		width: 1rem;
		height: 1rem;
		font-size: 1rem;
	}
`;

const PopinItem = styled('div')`
	display: grid;
	grid-template-columns: 50px 1fr;
	align-items: center;
	margin-bottom: 10px;
`;

const types = [
	...ITEM_TYPES,
	{
		icon: <SectionIcon />,
		iconValidated: <TaskCustomerIconValidated />,
		iconUrl: SectionIconUrl,
		iconUrlValidated: TaskCustomerIconValidatedUrl,
		type: 'SECTION',
		get name() {
			return fbt('Section de projet', 'section name');
		},
		get description() {
			return fbt(
				"Créer une section pour classer les tâches d'un projet",
				'section description',
			);
		},
	},
];

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

const PopinTask = ({
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
			<PopinItem>
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
				<InputContainer id="task-input-container">
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
									if (
										e.key === 'ArrowUp'
										&& onSubmitProject
									) {
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
											setItemUnit(0);
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
												setItemCustomer(
													defaultCustomer,
												);
												setShowContentAcquisitionInfos(
													true,
												);
											}
										}
										else if (type === 'SECTION') {
											setItemUnit(0);
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
												unit: parseFloat(itemUnit),
												linkedCustomerId:
													itemCustomer
													&& itemCustomer.id,
												tags: itemTags.map(
													({id}) => id,
												),
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
									setItemUnit(0);
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
											Commencez par "/" pour changer le
											type de tâche
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
			</PopinItem>
			{type !== 'SECTION' && (
				<PopinItem>
					<MaterialIcon icon="timer" size="tiny" />
					<UnitWithSuggestionsFormCondensed
						small
						value={itemUnit}
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
				</PopinItem>
			)}
			{type !== 'SECTION' && (
				<PopinItem>
					<MaterialIcon icon="label" size="tiny" />
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
				</PopinItem>
			)}
			{withProject && (
				<PopinItem>
					<MaterialIcon icon="folder_open" size="tiny" />
					<ProjectsDropdown
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
				</PopinItem>
			)}
			<PopinItem>
				<MaterialIcon icon="person_outline" size="tiny" />
				<div>…</div>
			</PopinItem>
			<PopinItem>
				<MaterialIcon icon="event" size="tiny" />
				<div>…</div>
			</PopinItem>
			<PopinItem>
				<MaterialIcon icon="event_available" size="tiny" />
				<div>…</div>
			</PopinItem>
			<InputButtonContainer>
				{type !== 'SECTION' && onSubmitSection && (
					<Tooltip
						label={
							<fbt project="inyo" desc="notification message">
								Flèche du bas pour créer un ensemble de tâches
							</fbt>
						}
					>
						<Button
							disabled={!value}
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
						disabled={!value}
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
									setItemUnit(0);
									closeContentAcquisitionInfos();
								}
								else {
									onSubmitTask({
										name: value,
										type: type || 'DEFAULT',
										dueDate:
											itemDueDate
											&& itemDueDate.toISOString(),
										unit: parseFloat(itemUnit),
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
		</Container>
	);
};

PopinTask.defaultProps = {
	defaultValue: '',
	onSubmitTask: () => {},
	withProject: false,
};

PopinTask.propTypes = {
	defaultValue: PropTypes.string,
	withProject: PropTypes.bool,
	onSubmitTask: PropTypes.func,
	onSubmitProject: PropTypes.func,
	onSubmitSection: PropTypes.func,
};

export default PopinTask;
