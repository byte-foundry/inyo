import React from 'react';
import styled from '@emotion/styled';
import {DragDropContext, Droppable, Draggable} from 'react-beautiful-dnd';
import {useMutation} from 'react-apollo-hooks';

import Task from '../TasksList/task';
import TemplateFiller from '../TemplateFiller';

import {LayoutMainElem, P} from '../../utils/new/design-system';
import {UPDATE_SECTION, UPDATE_ITEM, ADD_SECTION} from '../../utils/mutations';

const TasksListContainer = styled(LayoutMainElem)`
	margin-top: 3rem;
`;

const SectionTitle = styled(P)`
	margin: 2rem 14px;
`;

const DraggableTask = ({task, index, ...rest}) => (
	<Draggable key={task.id} draggableId={task.id} index={index} type="ITEM">
		{provided => (
			<div
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
				<Task item={task} key={task.id} {...rest} />
			</div>
		)}
	</Draggable>
);

const DroppableTaskArea = ({children, section}) => (
	<Droppable droppableId={section.id} type="ITEM" direction="vertical">
		{provided => (
			<div style={{minHeight: '50px'}} ref={provided.innerRef}>
				{children}
			</div>
		)}
	</Droppable>
);

const DroppableSectionArea = ({children}) => (
	<Droppable droppableId="sections" type="SECTION" direction="vertical">
		{provided => <div ref={provided.innerRef}>{children}</div>}
	</Droppable>
);

const DraggableSection = ({children, section, index}) => (
	<Draggable
		key={section.id}
		draggableId={section.id}
		index={index}
		type="SECTION"
	>
		{provided => (
			<div
				ref={provided.innerRef}
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
			</div>
		)}
	</Draggable>
);

function ProjectTasksList({items, projectId, sectionId}) {
	const updateTask = useMutation(UPDATE_ITEM);
	const addSection = useMutation(ADD_SECTION);
	const updateSection = useMutation(UPDATE_SECTION);

	if (!items.length) {
		return (
			<TemplateFiller
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
		);
	}

	const sections = Object.values(
		items.reduce((acc, item) => {
			if (!acc[item.section.id]) {
				acc[item.section.id] = {
					...item.section,
					items: [],
				};
			}

			acc[item.section.id].items.push(item);

			return acc;
		}, {}),
	);

	sections.forEach(section => section.items.sort((a, b) => a.position - b.position));
	sections.sort((a, b) => a.position - b.position);

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
								sectionId: sections[result.source.index].id,
								position: result.destination.index,
							},
						});
					}
					else if (type === 'ITEM') {
						await updateTask({
							variables: {
								itemId: result.draggableId,
								sectionId: result.destination.droppableId,
								position: result.destination.index,
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
							<SectionTitle>{section.name}</SectionTitle>
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
		</TasksListContainer>
	);
}

export default ProjectTasksList;
