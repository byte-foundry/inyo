import css from '@emotion/css';
import styled from '@emotion/styled/macro';
import moment from 'moment';
import PropTypes from 'prop-types';
import React, {useRef, useState} from 'react';
import {useHistory} from 'react-router-dom';

import fbt from '../../fbt/fbt.macro';
import {useMutation} from '../../utils/apollo-hooks';
import {ITEM_TYPES} from '../../utils/constants';
import {isCustomerTask} from '../../utils/functions';
import {ReactComponent as SectionIcon} from '../../utils/icons/section-icon.svg';
import {CREATE_TAG} from '../../utils/mutations';
import {
	Button,
	primaryBlack,
	primaryGrey,
	primaryPurple,
} from '../../utils/new/design-system';
import useOnClickOutside from '../../utils/useOnClickOutside';
import CheckList from '../CheckList';
import CustomersDropdown from '../CustomersDropdown';
import DateInput from '../DateInput';
import IconButton from '../IconButton';
import MaterialIcon from '../MaterialIcon';
import ProjectCollaboratorsDropdown from '../ProjectCollaboratorsDropdown';
import ProjectsDropdown from '../ProjectsDropdown';
import TagDropdown from '../TagDropdown';
import Tooltip from '../Tooltip';
import UnitWithSuggestionsForm from '../UnitWithSuggestionsForm';

const Container = styled('div')`
	font-size: 14px;
`;

const UnitWithSuggestionsFormCondensed = styled(UnitWithSuggestionsForm)`
	flex-wrap: wrap;
	gap: 8px;

	input {
		width: 100px;
	}
`;

const InputContainer = styled('div')``;

const InputButtonContainer = styled('div')`
	display: flex;
	justify-content: flex-end;
`;

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
	margin: 15px 0;
`;

const Types = styled('div')`
	display: flex;
`;

const DateContainer = styled('div')`
	display: flex;
`;

const DueDate = styled('div')`
	width: 100%;
	text-transform: capitalize;
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

const PopinTask = ({
	onSubmitProject,
	onSubmitSection,
	onSubmitTask,
	defaultValue,
	currentProjectId,
	defaultScheduledFor,
}) => {
	const history = useHistory();
	const [createTag] = useMutation(CREATE_TAG);
	const [value, setValue] = useState(defaultValue);
	const [type, setType] = useState('DEFAULT');
	const [focus, setFocus] = useState(false);
	const [editDate, setEditDate] = useState(false);
	const [selectedProject, setSelectedProject] = useState(currentProjectId);
	const [unit, setUnit] = useState(0);
	const [tags, setTags] = useState([]);
	const [dueDate, setDueDate] = useState();
	const [scheduledFor, setScheduledFor] = useState(defaultScheduledFor);
	const [files, setFiles] = useState([]);
	const [customer, setCustomer] = useState();
	const [assignedCollaborator, setAssignedCollaborator] = useState();
	const ref = useRef();
	const inputRef = useRef();
	const dueDateRef = useRef();
	const scheduledForRef = useRef();

	useOnClickOutside(ref, () => {
		setFocus(false);
	});

	useOnClickOutside(dueDateRef, () => {
		if (editDate === 'dueDate') setEditDate(false);
	});

	useOnClickOutside(scheduledForRef, () => {
		if (editDate === 'scheduledFor') setEditDate(false);
	});

	const types = currentProjectId
		? TYPES
		: TYPES.filter(t => t.type !== 'SECTION');
	const selectedType = types.find(t => t.type === (type || 'DEFAULT'));

	const resetForm = () => {
		setValue('');
		setUnit(0);
		setType('DEFAULT');
		setTags([]);
		setCustomer();
		setFiles();
		setSelectedProject();
		setAssignedCollaborator();
		setDueDate();
	};

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
							autoFocus
							data-multiline
							ref={inputRef}
							type="text"
							onChange={e => setValue(e.target.value)}
							value={value}
							onFocus={() => setFocus(true)}
							onBlur={() => setFocus(false)}
							onKeyDown={async (e) => {
								if (e.key === 'ArrowUp' && onSubmitProject) {
									onSubmitProject({
										name: value,
									});
									resetForm();
								}
								else if (
									e.key === 'ArrowDown'
									&& onSubmitSection
								) {
									onSubmitSection({
										name: value,
										// TODO : after current section
									});
									resetForm();
								}
								else if (e.key === 'Enter') {
									e.preventDefault();

									if (type === 'SECTION') {
										await onSubmitSection({
											name: value,
										});
										resetForm();

										return;
									}

									const common = {
										name: value,
										type: type || 'DEFAULT',
										projectId: selectedProject,
										tags: tags.map(({id}) => id),
										linkedCustomerId:
											customer && customer.id,
										dueDate,
										unit: parseFloat(unit),
										scheduledFor: isCustomerTask(type)
											? undefined
											: scheduledFor,
									};

									if (type === 'CONTENT_ACQUISITION') {
										await onSubmitTask({
											...common,
											description: `\n# content-acquisition-list\n${files
												.map(
													({checked, name}) => `- [${
														checked ? 'x' : ' '
													}] ${name}`,
												)
												.join('\n')}`,
										});
									}
									else {
										await onSubmitTask(common);
									}

									resetForm();
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
							<Tooltip key={type.type} label={type.name}>
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

				{type === 'CONTENT_ACQUISITION' && (
					<>
						<MaterialIcon icon="folder" size="tiny" />
						<CheckList
							editable
							items={files}
							onChange={({items}) => setFiles(items)}
						/>
					</>
				)}

				{type !== 'SECTION' && (
					<>
						<MaterialIcon icon="timer" size="tiny" />
						<UnitWithSuggestionsFormCondensed
							small
							value={unit}
							onChange={(newUnit) => {
								setUnit(newUnit);
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
							value={tags.map(tag => ({
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

								setTags([...tags, tag]);
							}}
							onChange={(newTags) => {
								setTags(
									(newTags || []).map(tag => ({
										id: tag.value,
										name: tag.label,
										colorBg: tag.colorBg,
										colorText: tag.colorText,
									})),
								);
							}}
							style={{margin: '0'}}
						/>
					</>
				)}

				{!currentProjectId && (
					<>
						<MaterialIcon icon="folder_open" size="tiny" />
						<ProjectsDropdown
							selectedId={selectedProject}
							onChange={(param) => {
								const {value: id} = param || {};

								setSelectedProject(id);
							}}
							isClearable
							style={{margin: '0'}}
						>
							<fbt project="inyo" desc="link to a project">
								Lier à un projet
							</fbt>
						</ProjectsDropdown>
					</>
				)}

				{isCustomerTask(type) && (
					<>
						<MaterialIcon icon="person_outline" size="tiny" />
						<CustomersDropdown
							selectedId={customer}
							onChange={(param) => {
								const {value: id} = param || {};

								setCustomer(id);
							}}
							isClearable
							style={{margin: '0'}}
						>
							<fbt project="inyo" desc="Client">
								Lier à un client
							</fbt>
						</CustomersDropdown>
					</>
				)}

				{type === 'DEFAULT' && selectedProject && (
					<>
						<MaterialIcon icon="face" size="tiny" />
						<ProjectCollaboratorsDropdown
							projectId={selectedProject}
							selectedId={assignedCollaborator}
							onChange={(param) => {
								const {value: id} = param || {};

								setAssignedCollaborator(id);
							}}
							isClearable
							style={{margin: '0'}}
						>
							<fbt
								project="inyo"
								desc="Link to collaborator dropdown popin"
							>
								Lier à un collaborateur
							</fbt>
						</ProjectCollaboratorsDropdown>
					</>
				)}

				{type !== 'SECTION' && (
					<>
						<MaterialIcon icon="event" size="tiny" />
						<DateContainer ref={dueDateRef}>
							{dueDate ? (
								<>
									<DueDate
										onClick={() => setEditDate('dueDate')}
									>
										{moment(dueDate).format('dddd Do MMMM')}
									</DueDate>
									<IconButton
										style={{margin: '0 10px'}}
										icon="clear"
										size="micro"
										onClick={() => setDueDate(false)}
									/>
								</>
							) : (
								<Button
									icon="+"
									onClick={() => setEditDate('dueDate')}
								>
									<fbt desc="popin task add deadline">
										Ajouter une deadline
									</fbt>
								</Button>
							)}
							{editDate === 'dueDate' && (
								<DateInput
									date={moment(dueDate || new Date())}
									onDateChange={(date) => {
										setDueDate(date.toISOString());
										setEditDate(false);
									}}
									duration={unit}
								/>
							)}
						</DateContainer>
					</>
				)}

				{!isCustomerTask(type) && type !== 'SECTION' && (
					<>
						<MaterialIcon icon="event_available" size="tiny" />
						<DateContainer ref={scheduledForRef}>
							{scheduledFor ? (
								<>
									<DueDate
										onClick={() => setEditDate('scheduledFor')
										}
									>
										{moment(scheduledFor).format(
											'dddd Do MMMM',
										)}
									</DueDate>
									<IconButton
										style={{margin: '0 10px'}}
										icon="clear"
										size="micro"
										onClick={() => setScheduledFor(false)}
									/>
								</>
							) : (
								<Button
									icon="+"
									onClick={() => setEditDate('scheduledFor')}
								>
									<fbt desc="popin task add to day">
										Ajouter cette tâche à une journée
									</fbt>
								</Button>
							)}
							{editDate === 'scheduledFor' && (
								<DateInput
									date={moment(scheduledFor || new Date())}
									onDateChange={(date) => {
										setScheduledFor(date.toISOString());
										setEditDate(false);
									}}
								/>
							)}
						</DateContainer>
					</>
				)}
			</Options>

			<InputButtonContainer>
				<Tooltip
					label={
						<fbt project="inyo" desc="notification message">
							Touche entrée pour créer la{' '}
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
					}
				>
					<Button
						disabled={!value}
						icon="↵"
						id="create-task-button"
						onClick={() => {
							if (!value.startsWith('/')) {
								if (type === 'CONTENT_ACQUISITION') {
									// check reauired infos here
								}
								else if (type === 'SECTION') {
									onSubmitSection({
										name: value,
									});
									setValue('');
									setUnit(0);
								}
								else {
									onSubmitTask({
										name: value,
										type: type || 'DEFAULT',
										dueDate,
										unit: parseFloat(unit),
										linkedCustomerId:
											customer && customer.id,
										tags: tags.map(({id}) => id),
										projectId: selectedProject,
									});
									setValue('');
								}
							}
						}}
					>
						<fbt
							project="inyo"
							desc="popin create task or section button"
						>
							Créer la{' '}
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
