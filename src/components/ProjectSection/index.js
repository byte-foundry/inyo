import React, {Component} from 'react';
import styled from '@emotion/styled';
import {Mutation} from 'react-apollo';
import {withRouter} from 'react-router-dom';
import {Droppable, Draggable} from 'react-beautiful-dnd';

import css from '@emotion/css';
import InlineEditable from '../InlineEditable';
import Item from './see-item';
import AddItem from './add-item';
import TasksList from '../TasksList';
import {
	H5,
	FlexRow,
	Button,
	primaryNavyBlue,
	primaryBlue,
	signalRed,
} from '../../utils/content';
import {REMOVE_SECTION, ADD_ITEM, UPDATE_ITEM} from '../../utils/mutations';

const ProjectSectionMain = styled('div')``;
const ProjectAction = styled(Button)`
	text-decoration: none;
	padding: 0;
	color: ${props => (props.type === 'delete' ? signalRed : primaryBlue)};
	font-size: 11px;
	margin: ${props => (props.type === 'delete' ? '50px 0 25px;' : '18px 0 10px 0;')};
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

	render() {
		const {
			data,
			editTitle,
			editItem,
			removeItem,
			finishItem,
			unfinishItem,
			mode,
			customerToken,
			projectStatus,
			projectId,
			history,
		} = this.props;

		const projectUrl = `/app/projects/${projectId}`;

		return (
			<ProjectSectionMain>
				<FlexRow justifyContent="space-between">
					<SectionTitle>
						<InlineEditable
							value={data.name}
							type="text"
							placeholder="Nom de la section"
							disabled={customerToken}
							onFocusOut={editTitle}
						/>
					</SectionTitle>
					<div>
						{!customerToken && (
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
				<TasksList
					items={data.items}
					projectId={projectId}
					sectionId={data.id}
				/>
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

				{!customerToken && (
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
