import css from '@emotion/css';
import styled from '@emotion/styled/macro';
import moment from 'moment';
import PropTypes from 'prop-types';
import React, {useEffect, useRef, useState} from 'react';
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
	padding: 1rem 0.5rem 1.5rem 0;

	color: ${primaryBlack};
`;

const UnitWithSuggestionsFormCondensed = styled(UnitWithSuggestionsForm)`
	flex-wrap: wrap;

	button {
		margin: 0 6px 6px 0;
	}
	form {
		align-items: baseline;
	}

	input {
		width: 100px;
	}
`;

const InputContainer = styled('div')`
	margin-bottom: 1rem;
`;

const InputButtonContainer = styled('div')`
	display: flex;
	justify-content: flex-end;
`;

const Input = styled('input')`
	padding: 5px 0;
	margin-bottom: 5px;
	border-bottom: 2px solid
		${props => (props.value ? primaryGrey : primaryPurple)};
	font-size: 20px;
	width: 100%;
	color: ${primaryBlack};

	:hover {
		border-bottom-color: ${primaryPurple};
	}

	&::placeholder {
		color: ${primaryGrey};
		font-size: 20px;
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

	${props => props.center
		&& css`
			display: grid;
			align-items: center;
			justify-content: center;
			transform: scale(0.8) translate(0, 10px);
		`}
`;

const Options = styled('div')`
	margin: 15px 0;
`;

const Row = styled('div')`
	display: grid;
	grid-template-columns: 50px 1fr;
	align-items: ${props => (props.multipleRows ? 'baseline' : 'center')};
	row-gap: 10px;
	min-height: 2rem;
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

	// since autoFocus doesn't work, focus on mount
	// but we need to disable tooltip temporarily
	useEffect(() => {
		setTimeout(() => {
			if (inputRef) {
				window.__REACH_DISABLE_TOOLTIPS = true; // eslint-disable-line no-underscore-dangle
				inputRef.current.focus();
				window.__REACH_DISABLE_TOOLTIPS = false; // eslint-disable-line no-underscore-dangle
			}
		});
	}, [inputRef]);

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

	let inputPlaceholder = fbt(
		'Ajouter une tâche.',
		'unfocused task input placeholder',
	);

	if (focus && type === 'SECTION') {
		inputPlaceholder = fbt(
			'Titre de la section.',
			'focused task input type section placeholder',
		);
	}
	else if (type === 'SECTION') {
		inputPlaceholder = fbt(
			'Ajouter une section.',
			'unfocused task input type section placeholder',
		);
	}
	else if (focus) {
		inputPlaceholder = fbt(
			'Titre de la tâche.',
			'focused task input placeholder',
		);
	}

	return (
		<Container ref={ref}>
			<Options>
				<Row multipleRows>
					<Tooltip label={selectedType.name}>
						<Icon center>{selectedType.icon}</Icon>
					</Tooltip>
					<InputContainer id="task-input-container">
						<Tooltip
							label={
								<p>
									<fbt
										project="inyo"
										desc="Enter to create task"
									>
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
								ref={inputRef}
								type="text"
								onChange={e => setValue(e.target.value)}
								value={value}
								onFocus={() => setFocus(true)}
								onBlur={() => setFocus(false)}
								onKeyDown={async (e) => {
									if (
										e.key === 'ArrowUp'
										&& onSubmitProject
									) {
										await onSubmitProject({name: value});
										resetForm();
									}
									else if (
										e.key === 'ArrowDown'
										&& onSubmitSection
									) {
										await onSubmitSection({name: value});
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
											common.description = `\n# content-acquisition-list\n${files
												.map(
													({checked, name}) => `- [${
														checked ? 'x' : ' '
													}] ${name}`,
												)
												.join('\n')}`;
										}

										await onSubmitTask(common);

										resetForm();
									}
								}}
								placeholder={inputPlaceholder}
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
								<Tooltip
									label={fbt('Projet', 'project name type')}
								>
									<Icon
										right
										onClick={() => history.push({
											pathname:
													'/app/projects/create',
											state: {name: value},
										})
										}
									>
										<MaterialIcon
											icon="folder_open"
											size="medium"
										/>
									</Icon>
								</Tooltip>
							)}
						</Types>
					</InputContainer>
				</Row>

				{type === 'CONTENT_ACQUISITION' && (
					<Row multipleRows>
						<MaterialIcon icon="folder" size="tiny" />
						<CheckList
							editable
							items={files}
							onChange={({items}) => setFiles(items)}
							style={{marginBottom: '1rem'}}
						/>
					</Row>
				)}

				{type !== 'SECTION' && (
					<Row multipleRows>
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
					</Row>
				)}
				{type !== 'SECTION' && (
					<Row>
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
					</Row>
				)}

				{!currentProjectId && (
					<Row>
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
					</Row>
				)}

				{isCustomerTask(type) && (
					<Row>
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
					</Row>
				)}

				{type === 'DEFAULT' && selectedProject && (
					<Row>
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
					</Row>
				)}

				{type !== 'SECTION' && (
					<Row>
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
									link
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
					</Row>
				)}

				{!isCustomerTask(type) && type !== 'SECTION' && (
					<Row>
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
									link
									onClick={() => setEditDate('scheduledFor')}
								>
									<fbt desc="popin task add to day">
										Ajouter au programme
									</fbt>
								</Button>
							)}
							{editDate === 'scheduledFor' && (
								<DateInput
									date={moment(scheduledFor || new Date())}
									onDateChange={(date) => {
										setScheduledFor(
											date.toISOString().split('T')[0],
										);
										setEditDate(false);
									}}
								/>
							)}
						</DateContainer>
					</Row>
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
						onClick={async () => {
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
								linkedCustomerId: customer && customer.id,
								dueDate,
								unit: parseFloat(unit),
								scheduledFor: isCustomerTask(type)
									? undefined
									: scheduledFor,
							};

							if (type === 'CONTENT_ACQUISITION') {
								common.description = `\n# content-acquisition-list\n${files
									.map(
										({checked, name}) => `- [${
											checked ? 'x' : ' '
										}] ${name}`,
									)
									.join('\n')}`;
							}

							await onSubmitTask(common);

							resetForm();
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
