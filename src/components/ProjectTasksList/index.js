import {css} from '@emotion/core';
import styled from '@emotion/styled/macro';
import Portal from '@reach/portal';
import produce from 'immer';
import React, {Suspense, useCallback, useState} from 'react';
import {useDrag, useDrop} from 'react-dnd';
import {withRouter} from 'react-router-dom';

import fbt from '../../fbt/fbt.macro';
import {useMutation, useQuery} from '../../utils/apollo-hooks';
import {BREAKPOINTS, DRAG_TYPES} from '../../utils/constants';
import {
	Loading,
	ModalActions,
	ModalContainer,
	ModalElem
} from '../../utils/content';
import {
	isCustomerTask,
	taskFulfillsActivationCriteria
} from '../../utils/functions';
import DragIconSvg from '../../utils/icons/drag.svg';
import Pencil from '../../utils/icons/pencil.svg';
import {
	ADD_SECTION,
	FOCUS_TASK,
	REMOVE_SECTION,
	UPDATE_ITEM,
	UPDATE_SECTION
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
	ScrollHelper,
	SubHeading
} from '../../utils/new/design-system';
import {GET_PROJECT_DATA} from '../../utils/queries';
import useScheduleData from '../../utils/useScheduleData';
import useUserInfos from '../../utils/useUserInfos';
import CreateTask from '../CreateTask';
import HelpAndTooltip from '../HelpAndTooltip';
import IconButton from '../IconButton';
import InlineEditable from '../InlineEditable';
import LeftBarSchedule from '../LeftBarSchedule';
import MaterialIcon from '../MaterialIcon';
import Task from '../TaskRow';
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
		background-color: ${props =>
			props.isDragging ? primaryWhite : 'auto'};
		width: ${props => (props.isDragging ? '100%' : 'auto')};
		padding-left: ${props => (props.isDragging ? '1rem' : 0)};
		border: ${props =>
			props.isDragging ? `1px solid ${mediumGrey}` : 'none'};
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

	${props =>
		props.missingTitle &&
		`
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

	@media (max-width: ${BREAKPOINTS.mobile}px) {
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

	@media (max-width: ${BREAKPOINTS.mobile}px) {
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
				isOver: monitor.isOver()
			};
		},
		drop() {
			return {
				dropPosition: position
			};
		}
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
				isOver: monitor.isOver()
			};
		},
		drop() {
			return {
				dropPosition: position,
				endSectionId: sectionId
			};
		}
	});

	return (
		<div ref={drop} style={{position: 'relative', minHeight: '30px'}}>
			{isOver && <DragSeparator />}
		</div>
	);
}

const DraggableTask = ({task, position, sections, setIsDragging, ...rest}) => {
	const [updateTask] = useMutation(UPDATE_ITEM);
	const [, drag] = useDrag({
		item: {
			id: task.id,
			position,
			type: DRAG_TYPES.TASK,
			sectionId: task.section.id
		},
		begin() {
			setIsDragging(true);
			return {
				id: task.id,
				position,
				sectionId: task.section.id
			};
		},
		end(item, monitor) {
			setIsDragging(false);
			const result = monitor.getDropResult();

			if (!result) return;

			const {endSectionId, dropPosition} = result;

			if (!endSectionId) return;
			// Dropped in a day not a section

			const startPosition = position;
			const sectionId = task.section.id;
			const draggedId = task.id;
			const endPosition =
				dropPosition > startPosition && sectionId === endSectionId
					? dropPosition - 1
					: dropPosition;

			updateTask({
				variables: {
					itemId: draggedId,
					sectionId: endSectionId,
					position: endPosition
				},
				optimisticResponse: {
					updateItem: {
						...sections.find(section => section.id === sectionId)
							.items[startPosition],
						position: endPosition,
						section: sections.find(
							section => section.id === endSectionId
						)
					}
				},
				update: (cache, {data: {updateItem: updatedItem}}) => {
					const dataToUpdate = cache.readQuery({
						query: GET_PROJECT_DATA,
						variables: {projectId: rest.projectId}
					});

					const newData = produce(dataToUpdate, draft => {
						let projectSections = draft.project.sections;

						const sectionIndex = projectSections.findIndex(
							sectionItem => sectionItem.id === endSectionId
						);
						const section = projectSections[sectionIndex];

						if (sectionId !== endSectionId) {
							const oldSectionIndex = projectSections.findIndex(
								sectionItem => sectionItem.id === sectionId
							);
							const oldSection = projectSections[oldSectionIndex];
							let oldSectionItems = oldSection.items.filter(
								i => i.id !== updatedItem.id
							);

							oldSectionItems = oldSectionItems.map(
								(item, index) => ({
									...item,
									position: index
								})
							);

							projectSections[oldSectionIndex] = {
								...oldSection,
								items: oldSectionItems
							};
						}

						let sectionItems = section.items.filter(
							i => i.id !== updatedItem.id
						);
						sectionItems.splice(
							updatedItem.position,
							0,
							updatedItem
						);

						sectionItems = sectionItems.map((item, index) => ({
							...item,
							position: index
						}));

						projectSections[sectionIndex] = {
							...section,
							items: sectionItems
						};
					});

					cache.writeQuery({
						query: GET_PROJECT_DATA,
						variables: {projectId: rest.projectId},
						data: newData
					});
				}
			});
		}
	});

	const [{isOver}, drop] = useDrop({
		accept: DRAG_TYPES.TASK,
		collect(monitor) {
			return {
				isOver: monitor.isOver()
			};
		},
		drop() {
			return {
				dropPosition: position,
				endSectionId: task.section.id
			};
		}
	});

	return (
		<div
			className="task"
			ref={node => {
				drag(node);
				drop(node);
			}}
			style={{
				// some basic styles to make the tasks look a bit nicer
				userSelect: 'none',
				position: 'relative'
			}}
		>
			{isOver && <DragSeparator />}
			<Task noProject item={task} key={task.id} {...rest} isDraggable />
		</div>
	);
};

const DraggableSection = ({children, section, position, sections}) => {
	const [updateSection] = useMutation(UPDATE_SECTION);
	const [, drag] = useDrag({
		item: {
			id: section.id,
			position,
			type: DRAG_TYPES.SECTION,
			projectId: section.project.id
		},
		begin() {
			return {
				id: section.id,
				position,
				projectId: section.project.id
			};
		},
		end(item, monitor) {
			const dropResult = monitor.getDropResult();

			if (!dropResult) return;

			const {dropPosition} = dropResult;
			const draggedId = section.id;
			const startPosition = position;
			const projectId = section.project.id;
			const endPosition =
				dropPosition > startPosition ? dropPosition - 1 : dropPosition;

			updateSection({
				variables: {
					sectionId: draggedId,
					position: endPosition
				},
				optimisticResponse: {
					updateSection: {
						...sections[startPosition],
						position: endPosition
					}
				},
				update: (cache, {data: {updateSection: updatedSection}}) => {
					const dataToUpdate = cache.readQuery({
						query: GET_PROJECT_DATA,
						variables: {projectId}
					});

					const newData = produce(dataToUpdate, draft => {
						let projectSections = draft.project.sections.filter(
							s => s.id !== updatedSection.id
						);

						projectSections.splice(
							updatedSection.position,
							0,
							updatedSection
						);

						projectSections = projectSections.map(
							(section, index) => ({
								...section,
								position: index
							})
						);

						draft.project.sections = projectSections;
					});

					cache.writeQuery({
						query: GET_PROJECT_DATA,
						variables: {projectId},
						data: newData
					});
				}
			});
		}
	});

	const [{isOver}, drop] = useDrop({
		accept: DRAG_TYPES.SECTION,
		collect(monitor) {
			return {
				isOver: monitor.isOver()
			};
		},
		drop() {
			return {
				dropPosition: position
			};
		}
	});

	return (
		<SectionDraggable
			ref={node => {
				drag(node);
				drop(node);
			}}
			style={{
				// some basic styles to make the items look a bit nicer
				userSelect: 'none'
			}}
		>
			{isOver && <DragSeparator />}
			{children}
		</SectionDraggable>
	);
};

function ProjectTasksList({items, projectId, sectionId, history, location}) {
	const {workingTime, hasFullWeekSchedule} = useUserInfos();
	const [focusTask] = useMutation(FOCUS_TASK);
	const [isDragging, setIsDragging] = useState(false);
	const {data: projectData, error} = useQuery(GET_PROJECT_DATA, {
		variables: {projectId},
		suspend: true
	});
	const [removeSectionModalOpen, setRemoveSectionModalOpen] = useState(false);
	const [removeSection] = useMutation(REMOVE_SECTION, {
		optimisticResponse: {
			removeSection: {
				id: removeSectionModalOpen.id
			}
		}
	});
	const [addSection] = useMutation(ADD_SECTION);
	const [updateSection] = useMutation(UPDATE_SECTION);
	const {loadingSchedule, scheduledTasksPerDay} = useScheduleData();

	const onMoveTask = useCallback(
		({task, scheduledFor, position}) => {
			const cachedSection = projectData.project.sections.find(s =>
				s.items.find(t => task.id === t.id)
			);
			const cachedTask = cachedSection.items.find(t => task.id === t.id);

			if (isCustomerTask(cachedTask.type)) {
				history.push({
					pathname: `/app/tasks/${task.id}`,
					state: {
						prevSearch: location.search,
						isActivating: taskFulfillsActivationCriteria(
							cachedTask
						),
						scheduledFor
					}
				});

				return;
			}

			focusTask({
				variables: {
					itemId: task.id,
					for: scheduledFor,
					schedulePosition: position
				},
				optimisticReponse: {
					focusTask: {
						itemId: task.id,
						for: scheduledFor,
						schedulePosition: position
					}
				}
			});
		},
		[focusTask, projectData, location.search, history]
	);

	if (error) throw error;

	const {sections: sectionsInfos} = projectData.project;

	if (!items.length && !sectionsInfos.length) {
		return (
			<div style={{position: 'relative', minHeight: '200px'}}>
				<Suspense fallback={Loading}>
					<TemplateAndProjectFiller
						projectId={projectId}
						onChoose={template => {
							template.sections.forEach(section => {
								addSection({
									variables: {
										projectId,
										...section
									}
								});
							});
						}}
					/>
				</Suspense>
			</div>
		);
	}

	const sections = sectionsInfos.map(section => {
		const itemsInSection = items.filter(i => i.section.id === section.id);

		itemsInSection.sort((a, b) => a.position - b.position);

		return {
			...section,
			items: itemsInSection
		};
	});

	sections.sort((a, b) => a.position - b.position);

	return (
		<TasksListContainer>
			<ScrollHelper>
				<MaterialIcon icon="unfold_more" size="normal" />
			</ScrollHelper>
			{sections.map(section => (
				<DraggableSection
					section={section}
					key={`${section.id}-${section.position}`}
					position={section.position}
					sections={sections}
				>
					<SectionTitle
						onClickTrash={() => setRemoveSectionModalOpen(section)}
						placeholder={
							<fbt project="inyo" desc="part name">
								Nom de la section
							</fbt>
						}
						value={section.name}
						missingTitle={section.name === ''}
						placeholderCss={placeholderCss}
						nameCss={nameCss}
						editableCss={editableCss}
						onFocusOut={value => {
							if (value) {
								updateSection({
									variables: {
										sectionId: section.id,
										name: value
									}
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
							<fbt desc="remove section title">
								Êtes-vous sûr de vouloir supprimer cette section
								?
							</fbt>
						</Heading>
						{removeSectionModalOpen.items.length > 0 && (
							<>
								<P>
									<fbt desc="remove section notice">
										Vous allez supprimer la section "<fbt:param name="sectionName">
											{removeSectionModalOpen.name}
										</fbt:param>". En supprimant cette
										section, vous allez supprimer les tâches
										suivantes :
									</fbt>
								</P>
								<DisableTask>
									{removeSectionModalOpen.items.map(task => (
										<Task
											item={task}
											key={task.id}
											noData
										/>
									))}
								</DisableTask>
								<P>
									<fbt desc="remove section notice 2">
										Vous pouvez glisser/déposer ces tâches
										dans une autre section afin qu'elles ne
										soient pas supprimées.
									</fbt>
								</P>
							</>
						)}
						<ModalActions>
							<Button
								link
								grey
								onClick={() => setRemoveSectionModalOpen(false)}
							>
								<fbt desc="remove section cancel button">
									Annuler
								</fbt>
							</Button>
							<Button
								big
								red
								onClick={async () => {
									await removeSection({
										variables: {
											sectionId: removeSectionModalOpen.id
										}
									});
									setRemoveSectionModalOpen(false);
								}}
							>
								<fbt desc="remove section confirm button">
									Supprimer
								</fbt>
							</Button>
						</ModalActions>
					</ModalElem>
				</ModalContainer>
			)}
			{!loadingSchedule && (
				<Portal>
					<LeftBarSchedule
						isDragging={isDragging}
						days={scheduledTasksPerDay}
						fullWeek={hasFullWeekSchedule}
						onMoveTask={onMoveTask}
						workingTime={workingTime}
					/>
				</Portal>
			)}
		</TasksListContainer>
	);
}

export default withRouter(ProjectTasksList);
