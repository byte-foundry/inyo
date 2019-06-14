import React, {useState} from 'react';
import gql from 'graphql-tag';
import styled from '@emotion/styled/macro';
import {DragDropContext, Droppable, Draggable} from 'react-beautiful-dnd';
import {useMutation, useQuery} from 'react-apollo-hooks';
import {css} from '@emotion/core';
import {__EXPERIMENTAL_DND_HOOKS_THAT_MAY_CHANGE_AND_BREAK_MY_BUILD__ as dnd} from 'react-dnd';

import Task from '../TasksList/task';
import TemplateAndProjectFiller from '../TemplateAndProjectFiller';

import {BREAKPOINTS, DRAG_TYPES} from '../../utils/constants';

import {GET_ALL_TASKS, GET_PROJECT_DATA} from '../../utils/queries';
import {
	LayoutMainElem,
	primaryBlack,
	primaryWhite,
	lightGrey,
	lightRed,
	accentGrey,
	mediumGrey,
	primaryRed,
	Button,
	SubHeading,
	P,
	DragSeparator,
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
import IconButton from '../../utils/new/components/IconButton';

const {useDrop, useDrag} = dnd;

const TasksListContainer = styled(LayoutMainElem)``;

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
		top: 1.1rem;

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

	${props => props.missingTitle
		&& `
		&:before {
			content: '';
			display: block;
			background: ${lightRed};
			position: absolute;
			left: -1rem;
			top: 0;
			right: -0.5rem;
			bottom: 0;
			border-radius: 8px;
			z-index: -1;
		}
	`}

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

	@media (max-width: ${BREAKPOINTS}px) {
		margin: 0;
		padding: 0;
	}
`;

const TrashIconContainer = styled('div')`
	cursor: pointer;
	padding: 1rem;

	pointer-events: none;

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

const SectionTitleContainer = styled('div')`
	margin: 3rem 0 2rem;
	display: flex;
	justify-content: center;
	align-items: center;

	&:hover {
		${TrashIconContainer} {
			pointer-events: all;
		}

		button {
			opacity: 1;
			margin: 0;
			transition: all 600ms ease;
		}
	}

	@media (max-width: ${BREAKPOINTS}px) {
		margin: 1rem 0 0 0;
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
		svg {
			fill: ${primaryRed};
		}
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
				<TrashButton link>
					<IconButton icon="delete_forever" size="small" danger />
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
	margin: 1rem 0;
	transform: scale(0.8);
	transform-origin: left top;
`;

const Heading = styled(SubHeading)`
	margin-bottom: 3rem;
`;

const DraggableTask = ({
	task, position, sections, ...rest
}) => {
	const updateTask = useMutation(UPDATE_ITEM);
	const [_, drag] = useDrag({
		item: {
			id: task.id,
			position,
			type: DRAG_TYPES.TASK,
			sectionId: task.section.id,
		},
		begin() {
			return {
				id: task.id,
				position,
				sectionId: task.section.id,
			};
		},
	});

	const [{isOver}, drop] = useDrop({
		accept: DRAG_TYPES.TASK,
		collect(monitor) {
			return {
				isOver: monitor.isOver(),
			};
		},
		drop({position: startPosition, id: draggedId, sectionId}) {
			const endPosition
				= position > startPosition ? position - 1 : position;
			const endSectionId = task.section.id;

			updateTask({
				variables: {
					itemId: draggedId,
					sectionId: endSectionId,
					position: endPosition,
				},
				optimisticResponse: {
					updateItem: {
						...sections.find(section => section.id === sectionId)
							.items[startPosition],
						position: endPosition,
						section: sections.find(
							section => section.id === endSectionId,
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
						sectionItem => sectionItem.id === endSectionId,
					);
					const oldSection = sections.find(
						sectionItem => sectionItem.id === sectionId,
					);

					if (sectionId === endSectionId) {
						// task is drag and drop in the same section
						if (
							section.items.find(
								item => updateItem.id === item.id,
							).position !== endPosition
						) {
							section.items.forEach((item) => {
								if (
									item.position > startPosition
									&& item.position <= endPosition
								) {
									itemsToUpdate.push({
										...item,
										position: item.position - 1,
									});
								}
								else if (
									item.position < startPosition
									&& item.position >= endPosition
								) {
									itemsToUpdate.push({
										...item,
										position: item.position + 1,
									});
								}
							});

							itemsToUpdate.forEach((itemUpdated) => {
								const indexTaskToUpdate = dataToUpdate.me.tasks.findIndex(
									t => itemUpdated.id === t.id,
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
							if (item.position >= endPosition) {
								itemsToUpdate.push({
									...item,
									position: item.position + 1,
								});
							}
						});

						oldSection.items.forEach((item) => {
							if (item.position >= startPosition) {
								oldItemsToUpdate.push({
									...item,
									position: item.position - 1,
								});
							}
						});

						oldSection.items.splice(position, 1);

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
								t => itemUpdated.id === t.id,
							);

							dataToUpdate.me.tasks[indexTaskToUpdate].position
								= itemUpdated.position;
							dataToUpdate.me.tasks[
								indexTaskToUpdate
							].section = oldSectionForItem;
						});

						itemsToUpdate.forEach((itemUpdated) => {
							const indexTaskToUpdate = dataToUpdate.me.tasks.findIndex(
								t => itemUpdated.id === t.id,
							);

							dataToUpdate.me.tasks[indexTaskToUpdate].position
								= itemUpdated.position;
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
		},
	});

	return (
		<div
			className="task"
			ref={(node) => {
				drag(node);
				drop(node);
			}}
			style={{
				// some basic styles to make the tasks look a bit nicer
				userSelect: 'none',
				position: 'relative',
			}}
		>
			{isOver && <DragSeparator />}
			<Task item={task} key={task.id} {...rest} isDraggable />
		</div>
	);
};

const DraggableSection = ({children, section, position}) => {
	const [_, drag] = useDrag({
		item: {id: section.id, position, type: DRAG_TYPES.SECTION},
		begin() {
			return {
				id: section.id,
				position,
			};
		},
		end(item, monitor) {
			const {position: endPosition} = monitor.getDropResult();

			console.log('Start pos: ', position);
			console.log('End pos: ', endPosition);
		},
	});

	const [{isOver}, drop] = useDrop({
		accept: DRAG_TYPES.SECTION,
		collect(monitor) {
			return {
				isOver: monitor.isOver(),
			};
		},
		drop() {
			return {position};
		},
	});

	return (
		<SectionDraggable
			ref={(node) => {
				drag(node);
				drop(node);
			}}
			style={{
				// some basic styles to make the items look a bit nicer
				userSelect: 'none',
			}}
		>
			{isOver && <DragSeparator />}
			{children}
		</SectionDraggable>
	);
};

function ProjectTasksList({items, projectId, sectionId}) {
	const {data: projectData, error} = useQuery(GET_PROJECT_DATA, {
		variables: {projectId},
		suspend: true,
	});
	const [removeSectionModalOpen, setRemoveSectionModalOpen] = useState(false);
	const removeSection = useMutation(REMOVE_SECTION, {
		optimisticResponse: {
			removeSection: {
				id: removeSectionModalOpen.id,
			},
		},
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

	sections.sort((a, b) => a.position - b.position);

	return (
		<TasksListContainer>
			{sections.map(section => (
				<DraggableSection
					section={section}
					key={`${section.id}-${section.position}`}
					position={section.position}
				>
					<SectionTitle
						onClickTrash={() => setRemoveSectionModalOpen(section)}
						placeholder="Nom de la section"
						value={section.name}
						missingTitle={section.name === ''}
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
					{section.items.map(task => (
						<DraggableTask
							position={task.position}
							task={task}
							key={`${task.id}-${task.position}`}
							projectId={projectId}
							sectionId={sectionId}
							sections={sections}
						/>
					))}
				</DraggableSection>
			))}
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
								<Task item={task} key={task.id} noData />
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
/*
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
							optimisticResponse: {
								updateSection: {
									...sections[source.index],
									position: destination.index,
								},
							},
							update: (
								cache,
								{data: {updateSection: updatedSection}},
							) => {
								const dataToUpdate = cache.readFragment({
									fragment: gql`
										fragment myProject on Project {
											sections {
												id
												name
												position
											}
										}
									`,
									id: projectId,
								});

								const sectionsInProject = dataToUpdate.sections;
								const cachedUpdatedSection = sectionsInProject.find(
									sec => sec.id === updatedSection.id,
								);

								if (destination.index < source.index) {
									const sectionsToUpdate = sectionsInProject.filter(
										sec => sec.position < source.index
											&& sec.position >= destination.index,
									);

									sectionsToUpdate.forEach(
										sec => (sec.position += 1),
									);
								}
								else if (destination.index > source.index) {
									const sectionsToUpdate = sectionsInProject.filter(
										sec => sec.position > source.index
											&& sec.position <= destination.index,
									);

									sectionsToUpdate.forEach(
										sec => (sec.position -= 1),
									);
								}

								cachedUpdatedSection.position
									= destination.index;

								cache.writeFragment({
									fragment: gql`
										fragment myProject on Project {
											sections {
												id
												name
												position
											}
										}
									`,
									id: projectId,
									data: {
										...dataToUpdate,
										sections: sectionsInProject,
									},
								});
							},
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
									sectionItem => sectionItem.id
										=== destination.droppableId,
								);
								const oldSection = sections.find(
									sectionItem => sectionItem.id === source.droppableId,
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
			*/
