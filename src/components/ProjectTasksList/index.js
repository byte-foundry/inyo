import React, {useState} from 'react';
import styled from '@emotion/styled';
import {DragDropContext, Droppable, Draggable} from 'react-beautiful-dnd';
import {useMutation, useQuery} from 'react-apollo-hooks';
import {css} from '@emotion/core';

import Task from '../TasksList/task';
import TemplateAndProjectFiller from '../TemplateAndProjectFiller';

import {GET_ALL_TASKS, GET_PROJECT_DATA} from '../../utils/queries';
import {
	LayoutMainElem,
	primaryBlack,
	primaryPurple,
	primaryWhite,
	lightGrey,
	accentGrey,
	mediumGrey,
	primaryRed,
	Button,
	SubHeading,
	P,
} from '../../utils/new/design-system';
import {ModalContainer, ModalElem, ModalActions} from '../../utils/content';
import {
	UPDATE_SECTION,
	UPDATE_ITEM,
	ADD_SECTION,
	REMOVE_SECTION,
} from '../../utils/mutations';
import InlineEditable from '../InlineEditable';
import Pencil from '../../utils/icons/pencil.svg';
import DragIconSvg from '../../utils/icons/drag.svg';
import {ReactComponent as TrashIcon} from '../../utils/icons/trash-icon.svg';

const TasksListContainer = styled(LayoutMainElem)`
	margin-top: 3rem;
`;

const SectionDraggable = styled('div')`
	position: relative;
	padding-left: 2rem;
	margin-left: -2rem;

	&:before {
		content: '';
		display: block;
		width: 0.8rem;
		height: 1.2rem;
		background: url(${DragIconSvg});
		background-repeat: no-repeat;
		position: absolute;
		left: -3rem;
		top: 0.75rem;

		opacity: 0;
		transition: all 300ms ease;
	}

	&:hover {
		&:before {
			opacity: 1;
			left: 0.2rem;
		}
	}

	.task {
		position: ${props => (props.isDragging ? 'absolute' : 'relative')};
		top: ${props => (props.isDragging ? '6rem' : 'auto')};
		background-color: ${props => (props.isDragging ? primaryWhite : 'auto')};
		width: ${props => (props.isDragging ? '100%' : 'flex')};
		padding-left: ${props => (props.isDragging ? '1rem' : 0)};
		border: ${props => (props.isDragging ? `1px solid ${mediumGrey}` : 'none')};
		border-radius: 4px;

		&:not(:first-child) {
			z-index: ${props => (props.isDragging ? '-1' : 'auto')};
		}
		& + .task {
			margin: ${props => (props.isDragging ? '8px' : 0)};
			& + .task {
				margin: ${props => (props.isDragging ? '4px' : 0)};
			}
		}
	}
`;

const SectionInput = styled(InlineEditable)`
	font-weight: 500;
	color: ${primaryBlack};
	border: 1px solid transparent;
	cursor: text;
	position: relative;
	padding: 0.5rem 0;
	margin: 0 14px 0;
	flex: 1;

	:hover {
		cursor: text;

		&:before {
			content: '';
			display: block;
			background: ${lightGrey};
			position: absolute;
			left: -1rem;
			top: 0;
			right: -0.5rem;
			bottom: 0;
			border-radius: 8px;
			z-index: -1;
		}
		&:after {
			content: '';
			display: block;
			background-color: ${accentGrey};
			mask-size: 35%;
			mask-position: center;
			mask-repeat: no-repeat;
			mask-image: url(${Pencil});
			position: absolute;
			top: 0;
			right: 0;
			bottom: 0;
			width: 50px;
		}
	}
`;

const SectionTitleContainer = styled('div')`
	margin: 3rem 0 2rem;
	display: flex;
	justify-content: center;
	align-items: center;

	&:hover {
		button {
			opacity: 1;
			margin: 0;
			transition: all 600ms ease;
		}
	}
`;

const TrashIconContainer = styled('div')`
	cursor: pointer;
	padding: 1rem;

	&:hover {
		svg {
			fill: ${primaryRed};
		}

		&:before {
			content: '';
			display: block;
			background: ${lightGrey};
			position: absolute;
			left: -0.5rem;
			top: -0.5rem;
			right: -1rem;
			bottom: -1rem;
			border-radius: 8px;
			z-index: -1;
		}
	}
`;

const TrashButton = styled(Button)`
	padding: 0;
	border: none;
	border-radius: 50%;

	opacity: 0;
	margin-right: -2rem;
	transition: all 300ms ease;

	svg {
		fill: ${accentGrey};
	}

	&:hover {
		background: none;
	}
`;

function SectionTitle({onClickTrash, ...props}) {
	return (
		<SectionTitleContainer>
			<SectionInput {...props} />
			<TrashIconContainer
				onClick={onClickTrash}
				data-tip="Supprimer cette section"
			>
				<TrashButton>
					<TrashIcon />
				</TrashButton>
			</TrashIconContainer>
		</SectionTitleContainer>
	);
}

const placeholderCss = css`
	font-style: italic;
	padding: 0;
	display: block;
	line-height: 1.5;
`;

const nameCss = css`
	padding: 0;
	display: block;
	line-height: 1.5;
`;

const editableCss = css`
	padding: 0;
	line-height: 1.5;
	display: block;
`;

const DisableTask = styled('div')`
	pointer-events: none;
	margin: 2rem 0;

	*::before,
	*::after,
	[class*='-TaskInfos'] {
		display: none;
	}
	[class*='-TaskIcon'] {
		margin: 0 1rem 0 0;
		*::before,
		*::after {
			display: none;
		}
	}
	[class*='-TaskContent'] {
		margin-top: -0.5rem;
	}
`;

const Heading = styled(SubHeading)`
	margin-bottom: 3rem;
`;

const DraggableTask = ({task, index, ...rest}) => (
	<Draggable key={task.id} draggableId={task.id} index={index} type="ITEM">
		{provided => (
			<div
				className="task"
				ref={provided.innerRef}
				{...provided.draggableProps}
				{...provided.dragHandleProps}
				onMouseDown={e => provided.dragHandleProps
					&& provided.dragHandleProps.onMouseDown(e)
				}
				style={{
					// some basic styles to make the tasks look a bit nicer
					userSelect: 'none',

					// styles we need to apply on draggables
					...provided.draggableProps.style,
				}}
			>
				<Task item={task} key={task.id} {...rest} isDraggable />
			</div>
		)}
	</Draggable>
);

const DroppableTaskArea = ({children, section}) => (
	<Droppable droppableId={section.id} type="ITEM" direction="vertical">
		{(provided, snapshot) => (
			<div
				style={{minHeight: '50px'}}
				ref={provided.innerRef}
				{...provided.droppableProps}
			>
				{children}
				{snapshot.draggingFromThisWith && provided.placeholder}
			</div>
		)}
	</Droppable>
);

const DroppableSectionArea = ({children}) => (
	<Droppable droppableId="sections" type="SECTION" direction="vertical">
		{provided => (
			<div
				style={{minHeight: '50px'}}
				ref={provided.innerRef}
				{...provided.droppableProps}
			>
				{children}
				{provided.placeholder}
			</div>
		)}
	</Droppable>
);

const DraggableSection = ({children, section, index}) => (
	<Draggable
		key={section.id}
		draggableId={section.id}
		index={index}
		type="SECTION"
	>
		{(provided, snapshot) => (
			<SectionDraggable
				ref={provided.innerRef}
				isDragging={snapshot.isDragging}
				{...provided.draggableProps}
				{...provided.dragHandleProps}
				style={{
					// some basic styles to make the items look a bit nicer
					userSelect: 'none',

					// styles we need to apply on draggables
					...provided.draggableProps.style,
				}}
			>
				{children}
			</SectionDraggable>
		)}
	</Draggable>
);

function ProjectTasksList({items, projectId, sectionId}) {
	const {data: projectData, error} = useQuery(GET_PROJECT_DATA, {
		variables: {projectId},
	});
	const [removeSectionModalOpen, setRemoveSectionModalOpen] = useState(false);
	const updateTask = useMutation(UPDATE_ITEM);
	const removeSection = useMutation(REMOVE_SECTION, {
		refetchQueries: ['getProjectData'],
	});
	const addSection = useMutation(ADD_SECTION, {
		update: (cache, {data: {addSection: addedSection}}) => {
			const data = cache.readQuery({
				query: GET_ALL_TASKS,
				variables: {},
			});

			const {me} = data;

			me.tasks.push(...addedSection.items);

			cache.writeQuery({
				query: GET_ALL_TASKS,
				variables: {},
				data,
			});

			const cachedProject = cache.readQuery({
				query: GET_PROJECT_DATA,
				variables: {projectId},
			});

			const {project} = cachedProject;

			project.sections.push(addedSection);

			cache.writeQuery({
				query: GET_PROJECT_DATA,
				variables: {projectId},
				data: cachedProject,
			});
		},
	});
	const updateSection = useMutation(UPDATE_SECTION);

	if (error) throw error;

	const {sections: sectionsInfos} = projectData.project;

	if (!items.length && !sectionsInfos.length) {
		return (
			<>
				<TemplateAndProjectFiller
					projectId={projectId}
					onChoose={(template) => {
						template.sections.forEach((section) => {
							addSection({
								variables: {
									projectId,
									...section,
								},
							});
						});
					}}
				/>
			</>
		);
	}

	const sections = sectionsInfos.map((section) => {
		const itemsInSection = items.filter(i => i.section.id === section.id);

		itemsInSection.sort((a, b) => a.position - b.position);

		return {
			...section,
			items: itemsInSection,
		};
	});

	return (
		<TasksListContainer>
			<DragDropContext
				onDragEnd={async (result) => {
					// dropped outside the list
					if (!result.destination) {
						return;
					}

					const {type, source, destination} = result;

					if (
						source.droppableId === destination.droppableId
						&& source.index === destination.index
					) {
						return;
					}

					if (type === 'SECTION') {
						await updateSection({
							variables: {
								sectionId: sections[source.index].id,
								position: destination.index,
							},
							refetchQueries: ['getProjectData'],
						});
					}
					else if (type === 'ITEM') {
						await updateTask({
							variables: {
								itemId: result.draggableId,
								sectionId: destination.droppableId,
								position: destination.index,
							},
							optimisticResponse: {
								updateItem: {
									...sections.find(
										section => section.id === source.droppableId,
									).items[source.index],
									position: destination.index,
									section: sections.find(
										section => section.id
											=== destination.droppableId,
									),
								},
							},
							update: (cache, {data: {updateItem}}) => {
								const dataToUpdate = cache.readQuery({
									query: GET_ALL_TASKS,
								});
								const itemsToUpdate = [updateItem];
								const oldItemsToUpdate = [];
								const section = sections.find(
									section => section.id === destination.droppableId,
								);
								const oldSection = sections.find(
									section => section.id === source.droppableId,
								);

								if (
									source.droppableId
									=== destination.droppableId
								) {
									// task is drag and drop in the same section
									if (
										section.items.find(
											item => updateItem.id === item.id,
										).position !== destination.index
									) {
										section.items.forEach((item) => {
											if (
												item.position > source.index
												&& item.position
													<= destination.index
											) {
												itemsToUpdate.push({
													...item,
													position: item.position - 1,
												});
											}
											else if (
												item.position < source.index
												&& item.position
													>= destination.index
											) {
												itemsToUpdate.push({
													...item,
													position: item.position + 1,
												});
											}
										});

										itemsToUpdate.forEach((itemUpdated) => {
											const indexTaskToUpdate = dataToUpdate.me.tasks.findIndex(
												task => itemUpdated.id === task.id,
											);

											dataToUpdate.me.tasks[
												indexTaskToUpdate
											].position = itemUpdated.position;
										});

										cache.writeQuery({
											query: GET_ALL_TASKS,
											data: dataToUpdate,
										});
									}
								}
								else {
									section.items.forEach((item) => {
										if (
											item.position >= destination.index
										) {
											itemsToUpdate.push({
												...item,
												position: item.position + 1,
											});
										}
									});

									oldSection.items.forEach((item) => {
										if (item.position >= source.index) {
											oldItemsToUpdate.push({
												...item,
												position: item.position - 1,
											});
										}
									});

									oldSection.items.splice(source.index, 1);

									const sectionForItem = {
										...section,
										items: undefined,
									};

									const oldSectionForItem = {
										...oldSection,
										items: undefined,
									};

									oldItemsToUpdate.forEach((itemUpdated) => {
										const indexTaskToUpdate = dataToUpdate.me.tasks.findIndex(
											task => itemUpdated.id === task.id,
										);

										dataToUpdate.me.tasks[
											indexTaskToUpdate
										].position = itemUpdated.position;
										dataToUpdate.me.tasks[
											indexTaskToUpdate
										].section = oldSectionForItem;
									});

									itemsToUpdate.forEach((itemUpdated) => {
										const indexTaskToUpdate = dataToUpdate.me.tasks.findIndex(
											task => itemUpdated.id === task.id,
										);

										dataToUpdate.me.tasks[
											indexTaskToUpdate
										].position = itemUpdated.position;
										dataToUpdate.me.tasks[
											indexTaskToUpdate
										].section = sectionForItem;
									});

									cache.writeQuery({
										query: GET_ALL_TASKS,
										data: dataToUpdate,
									});
								}
							},
						});
					}
				}}
			>
				<DroppableSectionArea>
					{sections.map((section, sectionIndex) => (
						<DraggableSection
							section={section}
							key={section.id}
							index={sectionIndex}
						>
							<SectionTitle
								onClickTrash={() => setRemoveSectionModalOpen(section)
								}
								placeholder="Nom de la section"
								value={section.name}
								placeholderCss={placeholderCss}
								nameCss={nameCss}
								editableCss={editableCss}
								onFocusOut={(value) => {
									if (value) {
										updateSection({
											variables: {
												sectionId: section.id,
												name: value,
											},
										});
									}
								}}
							/>
							<DroppableTaskArea section={section}>
								{section.items.map((task, itemIndex) => (
									<DraggableTask
										index={itemIndex}
										task={task}
										key={task.id}
										projectId={projectId}
										sectionId={sectionId}
									/>
								))}
							</DroppableTaskArea>
						</DraggableSection>
					))}
				</DroppableSectionArea>
			</DragDropContext>
			{removeSectionModalOpen && (
				<ModalContainer
					onDismiss={() => setRemoveSectionModalOpen(false)}
				>
					<ModalElem>
						<Heading>
							Êtes-vous sûr de vouloir supprimer cette section ?
						</Heading>
						<P>
							Vous allez supprimer la section "
							{removeSectionModalOpen.name}", en supprimant cette
							section vous allez supprimer les tâches suivantes:
						</P>
						<DisableTask>
							{removeSectionModalOpen.items.map(task => (
								<Task
									item={task}
									key={task.id}
									customerToken="preview"
								/>
							))}
						</DisableTask>
						<P>
							Vous pouvez glisser/déposer ses tâches dans une
							autre section pour ne pas qu'elles soient
							supprimées.
						</P>
						<ModalActions>
							<Button
								link
								grey
								onClick={() => setRemoveSectionModalOpen(false)}
							>
								Annuler
							</Button>
							<Button
								big
								red
								onClick={async () => {
									await removeSection({
										variables: {
											sectionId:
												removeSectionModalOpen.id,
										},
									});
									setRemoveSectionModalOpen(false);
								}}
							>
								Supprimer
							</Button>
						</ModalActions>
					</ModalElem>
				</ModalContainer>
			)}
		</TasksListContainer>
	);
}

export default ProjectTasksList;
