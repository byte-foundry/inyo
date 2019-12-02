import css from '@emotion/css';
import styled from '@emotion/styled/macro';
import PropTypes from 'prop-types';
import React, {useEffect, useRef, useState} from 'react';
import {useHistory} from 'react-router-dom';

import fbt from '../../fbt/fbt.macro';
import {useMutation} from '../../utils/apollo-hooks';
import {ITEM_TYPES} from '../../utils/constants';
import {ReactComponent as SectionIcon} from '../../utils/icons/section-icon.svg';
import {CREATE_TAG} from '../../utils/mutations';
import {
	Button,
	primaryBlack,
	primaryGrey,
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
	flex-wrap: wrap;
	gap: 8px;

	input {
		width: 100px;
	}
`;

const InputContainer = styled('div')``;

const InputButtonContainer = styled('div')``;

const Input = styled('input')`
	padding: 5px 0;
	margin-bottom: 5px;
	border-bottom: 2px solid
		${props => (props.value ? primaryGrey : primaryPurple)};
	font-size: 18px;
	width: 100%;
	color: ${primaryPurple};

	:hover {
		border-bottom-color: ${primaryPurple};
	}

	&::placeholder {
		color: ${primaryBlack};
		font-size: 15px;
		align-items: center;
		font-family: 'Work Sans', sans-serif;
	}

	&:focus {
		appearance: none;
		outline: 0;
		border-bottom-color: ${primaryPurple};
	}
`;

const Icon = styled('div')`
	cursor: pointer;
	transform: scale(0.6);

	${props => props.right
		&& css`
			margin-left: auto;
		`}
`;

const Options = styled('div')`
	display: grid;
	grid-template-columns: 50px 1fr;
	align-items: baseline;
	row-gap: 10px;
`;

const Types = styled('div')`
	display: flex;
`;

const TYPES = [
	...ITEM_TYPES,
	{
		icon: <SectionIcon />,
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
	const history = useHistory();
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

	const types = TYPES.filter(t => !currentProjectId && t.type !== 'SECTION');
	const selectedType = types.find(t => t.type === (type || 'DEFAULT'));

	useTrackEventInput({focus, openedByClick, value});

	return (
		<Container ref={ref}>
			<Options>
				<Tooltip label={selectedType.name}>
					<Icon>{selectedType.icon}</Icon>
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
					<Types>
						{types.map(type => (
							<Tooltip label={type.name}>
								<Icon
									onClick={() => setType(type.type)}
									right={type.type === 'SECTION'}
								>
									{type.icon}
								</Icon>
							</Tooltip>
						))}
						{!currentProjectId && (
							<Tooltip label={fbt('Projet', 'project name type')}>
								<Icon
									right
									onClick={() => history.push({
										pathname: '/app/projects/create',
										state: {name: value},
									})
									}
								>
									<MaterialIcon
										icon="folder_open"
										size="small"
									/>
								</Icon>
							</Tooltip>
						)}
					</Types>
				</InputContainer>

				{type !== 'SECTION' && (
					<>
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
					</>
				)}
				{type !== 'SECTION' && (
					<>
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
							onCreateOption={async (
								name,
								colorBg,
								colorText,
							) => {
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
					</>
				)}
				{withProject && (
					<>
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
					</>
				)}
				<>
					<MaterialIcon icon="person_outline" size="tiny" />
					<div>…</div>
				</>
				<>
					<MaterialIcon icon="event" size="tiny" />
					<div>…</div>
				</>
				<>
					<MaterialIcon icon="event_available" size="tiny" />
					<div>…</div>
				</>
			</Options>
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
