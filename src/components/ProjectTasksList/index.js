import {css} from '@emotion/core';
import styled from '@emotion/styled/macro';
import Portal from '@reach/portal';
import gql from 'graphql-tag';
import React, {Suspense, useCallback, useState} from 'react';
import {useMutation, useQuery} from 'react-apollo-hooks';
import {useDrag, useDrop} from 'react-dnd';
import {withRouter} from 'react-router-dom';

import {BREAKPOINTS, DRAG_TYPES} from '../../utils/constants';
import {
	Loading,
	ModalActions,
	ModalContainer,
	ModalElem,
} from '../../utils/content';
import {isCustomerTask} from '../../utils/functions';
import DragIconSvg from '../../utils/icons/drag.svg';
import Pencil from '../../utils/icons/pencil.svg';
import {
	ADD_SECTION,
	FOCUS_TASK,
	REMOVE_SECTION,
	UPDATE_ITEM,
	UPDATE_SECTION,
} from '../../utils/mutations';
import {
	accentGrey,
	Button,
	DragSeparator,
	LayoutMainElem,
	lightGrey,
	lightRed,
	mediumGrey,
	P,
	primaryBlack,
	primaryRed,
	primaryWhite,
	SubHeading,
} from '../../utils/new/design-system';
import {
	GET_ALL_TASKS,
	GET_PROJECT_DATA,
	GET_USER_INFOS,
} from '../../utils/queries';
import IconButton from '../IconButton';
import InlineEditable from '../InlineEditable';
import LeftBarSchedule from '../LeftBarSchedule';
import Task from '../TasksList/task';
import TemplateAndProjectFiller from '../TemplateAndProjectFiller';
import Tooltip from '../Tooltip';

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
	margin: 1rem 0 0.5rem;
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
			<Tooltip label="Supprimer cette section">
				<TrashIconContainer onClick={onClickTrash}>
					<TrashButton link>
						<IconButton icon="delete_forever" size="small" danger />
					</TrashButton>
				</TrashIconContainer>
			</Tooltip>
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

function PlaceholderDropSection({position}) {
	const [{isOver}, drop] = useDrop({
		accept: DRAG_TYPES.SECTION,
		collect(monitor) {
			return {
				isOver: monitor.isOver(),
			};
		},
		drop() {
			return {
				dropPosition: position,
			};
		},
	});

	return (
		<div ref={drop} style={{position: 'relative', minHeight: '30px'}}>
			{isOver && <DragSeparator />}
		</div>
	);
}

function PlaceholderDropTask({sectionId, position}) {
	const [{isOver}, drop] = useDrop({
		accept: DRAG_TYPES.TASK,
		collect(monitor) {
			return {
				isOver: monitor.isOver(),
			};
		},
		drop() {
			return {
				dropPosition: position,
				endSectionId: sectionId,
			};
		},
	});

	return (
		<div ref={drop} style={{position: 'relative', minHeight: '30px'}}>
			{isOver && <DragSeparator />}
		</div>
	);
}

const DraggableTask = ({
	task, position, sections, setIsDragging, ...rest
}) => {
	const [updateTask] = useMutation(UPDATE_ITEM);
	const [, drag] = useDrag({
		item: {
			id: task.id,
			position,
			type: DRAG_TYPES.TASK,
			sectionId: task.section.id,
		},
		begin() {
			setIsDragging(true);
			return {
				id: task.id,
				position,
				sectionId: task.section.id,
			};
		},
		end(item, monitor) {
			setIsDragging(false);

			const {endSectionId, dropPosition} = monitor.getDropResult();

			if (!endSectionId) return;
			// Dropped in a day not a section

			const startPosition = position;
			const sectionId = task.section.id;
			const draggedId = task.id;
			const endPosition
				= dropPosition > startPosition && sectionId === endSectionId
					? dropPosition - 1
					: dropPosition;

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

							console.table(itemsToUpdate);

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

	const [{isOver}, drop] = useDrop({
		accept: DRAG_TYPES.TASK,
		collect(monitor) {
			return {
				isOver: monitor.isOver(),
			};
		},
		drop() {
			return {
				dropPosition: position,
				endSectionId: task.section.id,
			};
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

const DraggableSection = ({
	children, section, position, sections,
}) => {
	const [updateSection] = useMutation(UPDATE_SECTION);
	const [, drag] = useDrag({
		item: {
			id: section.id,
			position,
			type: DRAG_TYPES.SECTION,
			projectId: section.project.id,
		},
		begin() {
			return {
				id: section.id,
				position,
				projectId: section.project.id,
			};
		},
		end(item, monitor) {
			const {dropPosition} = monitor.getDropResult();
			const draggedId = section.id;
			const startPosition = position;
			const projectId = section.project.id;
			const endPosition
				= dropPosition > startPosition ? dropPosition - 1 : dropPosition;

			updateSection({
				variables: {
					sectionId: draggedId,
					position: endPosition,
				},
				optimisticResponse: {
					updateSection: {
						...sections[startPosition],
						position: endPosition,
					},
				},
				update: (cache, {data: {updateSection: updatedSection}}) => {
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

					if (endPosition < startPosition) {
						const sectionsToUpdate = sectionsInProject.filter(
							sec => sec.position < startPosition
								&& sec.position >= endPosition,
						);

						sectionsToUpdate.forEach((sec) => {
							sec.position += 1;
						});
					}
					else if (endPosition > startPosition) {
						const sectionsToUpdate = sectionsInProject.filter(
							sec => sec.position > startPosition
								&& sec.position <= endPosition,
						);

						sectionsToUpdate.forEach((sec) => {
							sec.position -= 1;
						});
					}

					cachedUpdatedSection.position = endPosition;

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
			return {
				dropPosition: position,
			};
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

function ProjectTasksList({
	items, projectId, sectionId, history, location,
}) {
	const {
		data: userPrefsData,
		loading: loadingUserPrefs,
		error: errorUserPrefs,
	} = useQuery(GET_USER_INFOS, {suspend: true});
	const [focusTask] = useMutation(FOCUS_TASK);
	const [isDragging, setIsDragging] = useState(false);
	const {data: projectData, error} = useQuery(GET_PROJECT_DATA, {
		variables: {projectId},
		suspend: true,
	});
	const [removeSectionModalOpen, setRemoveSectionModalOpen] = useState(false);
	const [removeSection] = useMutation(REMOVE_SECTION, {
		optimisticResponse: {
			removeSection: {
				id: removeSectionModalOpen.id,
			},
		},
	});
	const [addSection] = useMutation(ADD_SECTION, {
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
	const [updateSection] = useMutation(UPDATE_SECTION);

	const onMoveTask = useCallback(
		({task, scheduledFor, position}) => {
			const cachedSection = projectData.project.sections.find(s => s.items.find(t => task.id === t.id));
			const cachedTask = cachedSection.items.find(t => task.id === t.id);

			if (isCustomerTask(cachedTask.type)) {
				history.push({
					pathname: `/app/tasks/${task.id}`,
					state: {
						prevSearch: location.search,
						isActivating: true,
						scheduledFor,
					},
				});

				return;
			}

			focusTask({
				variables: {
					itemId: task.id,
					for: scheduledFor,
					schedulePosition: position,
				},
				optimisticReponse: {
					focusTask: {
						itemId: task.id,
						for: scheduledFor,
						schedulePosition: position,
					},
				},
			});
		},
		[focusTask, projectData, location.search, history],
	);

	if (error) throw error;
	if (errorUserPrefs) throw errorUserPrefs;

	const {sections: sectionsInfos} = projectData.project;

	if (!items.length && !sectionsInfos.length) {
		return (
			<>
				<Suspense fallback={Loading}>
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
				</Suspense>
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

	const scheduledTasks = {};

	items.forEach((task) => {
		if (!task.scheduledFor) {
			return;
		}

		scheduledTasks[task.scheduledFor] = scheduledTasks[
			task.scheduledFor
		] || {
			date: task.scheduledFor,
			tasks: [],
		};

		scheduledTasks[task.scheduledFor].tasks.push(task);
	});

	return (
		<TasksListContainer>
			{sections.map(section => (
				<DraggableSection
					section={section}
					key={`${section.id}-${section.position}`}
					position={section.position}
					sections={sections}
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
							setIsDragging={setIsDragging}
							position={task.position}
							task={task}
							key={`${task.id}-${task.position}`}
							projectId={projectId}
							sectionId={sectionId}
							sections={sections}
						/>
					))}
					<PlaceholderDropTask
						sectionId={section.id}
						position={section.items.length}
						key={`task-placeholder-${section.items.length}`}
					/>
				</DraggableSection>
			))}
			<PlaceholderDropSection
				position={sections.length}
				key={`section-placeholder-${sections.length}`}
			/>
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
			{loadingUserPrefs ? (
				<Loading />
			) : (
				<Portal>
					<LeftBarSchedule
						isDragging={isDragging}
						days={scheduledTasks}
						fullWeek={userPrefsData.me.settings.hasFullWeekSchedule}
						onMoveTask={onMoveTask}
					/>
				</Portal>
			)}
		</TasksListContainer>
	);
}

export default withRouter(ProjectTasksList);
