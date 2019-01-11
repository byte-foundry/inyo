import React, {Component} from 'react';
import styled from '@emotion/styled';
import {Mutation} from 'react-apollo';
import {withRouter} from 'react-router-dom';
import {DragDropContext, Droppable, Draggable} from 'react-beautiful-dnd';

import InlineEditable from '../InlineEditable';
import Item from './see-item';
import AddItem from './add-item';
import {
	H5,
	FlexRow,
	Button,
	primaryNavyBlue,
	primaryBlue,
	signalRed,
} from '../../utils/content';
import {
	REMOVE_SECTION,
	ADD_ITEM,
	UPDATE_SECTION,
	UPDATE_ITEM,
} from '../../utils/mutations';

const ProjectSectionMain = styled('div')``;
const ProjectAction = styled(Button)`
	text-decoration: none;
	padding: 0;
	color: ${props => (props.type === 'delete' ? signalRed : primaryBlue)};
	font-size: 11px;
	transform: translateY(18px);
	margin: ${props => (props.type === 'delete' ? '50px 0 25px;' : '0 0 10px 0;')};
`;
const SectionTitle = styled(H5)`
	color: ${primaryNavyBlue};
	margin: 50px 0 25px;
`;

class ProjectSection extends Component {
	constructor(props) {
		super(props);
		this.state = {
			shouldDisplayAddItem: false,
		};
	}

	onDragEnd = async ([result], updateItem) => {
		// dropped outside the list
		if (!result.destination) {
			return;
		}

		await this.props.editItem(
			this.props.data.items[result.source.index].id,
			this.props.data.id,
			{position: result.destination.index},
			updateItem,
		);
	};

	render() {
		const {
			data,
			editSectionTitle,
			editItem,
			removeItem,
			finishItem,
			mode,
			customerViewMode,
			projectStatus,
			projectId,
			history,
		} = this.props;

		const projectUrl = `/app/projects/${projectId}`;

		return (
			<ProjectSectionMain>
				<FlexRow justifyContent="space-between">
					<SectionTitle>
						<Mutation mutation={UPDATE_SECTION}>
							{updateSection => (
								<InlineEditable
									value={data.name}
									type="text"
									placeholder="Nom de la section"
									onFocusOut={(value) => {
										editSectionTitle(
											data.id,
											value,
											updateSection,
										);
									}}
								/>
							)}
						</Mutation>
					</SectionTitle>
					<div>
						{!customerViewMode && (
							<Mutation mutation={REMOVE_SECTION}>
								{(removeSection) => {
									const display = data.items.every(
										item => item.status !== 'FINISHED',
									);

									return (
										display && (
											<ProjectAction
												theme="Link"
												size="XSmall"
												type="delete"
												onClick={() => {
													this.props.removeSection(
														data.id,
														removeSection,
													);
												}}
											>
												Supprimer la section
											</ProjectAction>
										)
									);
								}}
							</Mutation>
						)}
					</div>
				</FlexRow>
				<Mutation mutation={UPDATE_ITEM}>
					{updateItem => (
						<DragDropContext
							onDragEnd={(...args) => this.onDragEnd(args, updateItem)
							}
						>
							<Droppable droppableId="droppable">
								{(provided, snapshot) => (
									<div ref={provided.innerRef}>
										{data.items.map((item, index) => (
											<Draggable
												key={item.id}
												draggableId={item.id}
												index={index}
											>
												{(provided, snapshot) => (
													<div
														ref={provided.innerRef}
														{...provided.draggableProps}
														{...provided.dragHandleProps}
														style={{
															// some basic styles to make the items look a bit nicer
															userSelect: 'none',

															// change background colour if dragging
															background: snapshot.isDragging
																? 'lightgreen'
																: 'grey',

															// styles we need to apply on draggables
															...provided
																.draggableProps
																.style,
														}}
													>
														<Item
															key={item.id}
															item={item}
															sectionId={data.id}
															editItem={editItem}
															removeItem={
																removeItem
															}
															finishItem={
																finishItem
															}
															mode={mode}
															onClickCommentIcon={() => {
																const uri = customerViewMode
																	? `/view/${customerViewMode}/items/${
																		item.id
																	  }`
																	: `/${mode}/items/${
																		item.id
																	  }`;

																history.push(
																	`${projectUrl}${uri}#comments`,
																);
															}}
															projectStatus={
																projectStatus
															}
														/>
													</div>
												)}
											</Draggable>
										))}
										{provided.placeholder}
									</div>
								)}
							</Droppable>
						</DragDropContext>
					)}
				</Mutation>
				{this.state.shouldDisplayAddItem && (
					<Mutation mutation={ADD_ITEM}>
						{addItem => (
							<AddItem
								item={{
									name: 'Nouvelle tâche',
									unit: 0,
									description: '',
									reviewer: 'USER',
								}}
								remove={() => {
									this.setState({
										shouldDisplayAddItem: false,
									});
								}}
								done={(values) => {
									this.props.addItem(
										data.id,
										values,
										addItem,
									);
									this.setState({
										shouldDisplayAddItem: false,
									});
								}}
							/>
						)}
					</Mutation>
				)}

				{!customerViewMode && (
					<ProjectAction
						theme="Link"
						size="XSmall"
						onClick={() => {
							this.setState({
								shouldDisplayAddItem: true,
							});
						}}
					>
						Ajouter une tâche
					</ProjectAction>
				)}
			</ProjectSectionMain>
		);
	}
}

export default withRouter(ProjectSection);
