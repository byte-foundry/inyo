import React from 'react';
import {Mutation} from 'react-apollo';
import {DragDropContext, Droppable, Draggable} from 'react-beautiful-dnd';

import ProjectSection from '../ProjectSection';
import {UPDATE_SECTION, UPDATE_ITEM} from '../../utils/mutations';

const SectionList = ({
	addItem,
	editItem,
	removeItem,
	finishItem,
	customerToken,
	editSection,
	removeSection,
	refetch,
	projectStatus,
	sections,
	projectId,
	mode,
}) => (
	<Mutation mutation={UPDATE_SECTION}>
		{updateSection => (
			<Mutation mutation={UPDATE_ITEM}>
				{updateItem => (
					<DragDropContext
						onDragEnd={async (result) => {
							// dropped outside the list
							if (!result.destination) {
								return;
							}

							const {type, source, destination} = result;

							if (
								source.droppableId
									=== destination.droppableId
								&& source.index === destination.index
							) {
								return;
							}

							if (type === 'SECTION') {
								await editSection(
									sections[result.source.index].id,
									{position: result.destination.index},
									updateSection,
								);
							}
							else if (type === 'ITEM') {
								await editItem(
									result.draggableId,
									result.source.droppableId,
									{
										sectionId:
											result.destination.droppableId,
										position: result.destination.index,
									},
									updateItem,
								);
							}
						}}
					>
						<Droppable
							droppableId="sections"
							type="SECTION"
							direction="vertical"
						>
							{(provided, snapshot) => (
								<div ref={provided.innerRef}>
									{sections.map((section, index) => (
										<Draggable
											key={section.id}
											draggableId={section.id}
											index={index}
											isDragDisabled={!!customerToken}
											type="SECTION"
										>
											{(provided, snapshot) => (
												<div
													ref={provided.innerRef}
													{...provided.draggableProps}
													{...provided.dragHandleProps}
													style={{
														// some basic styles to make the items look a bit nicer
														userSelect: 'none',

														// styles we need to apply on draggables
														...provided
															.draggableProps
															.style,
													}}
												>
													<ProjectSection
														key={section.id}
														projectId={projectId}
														data={section}
														addItem={addItem}
														editItem={editItem}
														removeItem={removeItem}
														finishItem={finishItem}
														customerToken={
															customerToken
														}
														mode={mode}
														editTitle={value => editSection(
															section.id,
															{name: value},
															updateSection,
														)
														}
														removeSection={
															removeSection
														}
														sectionIndex={index}
														refetch={refetch}
														projectStatus={
															projectStatus
														}
													/>
												</div>
											)}
										</Draggable>
									))}
								</div>
							)}
						</Droppable>
					</DragDropContext>
				)}
			</Mutation>
		)}
	</Mutation>
);

export default SectionList;
