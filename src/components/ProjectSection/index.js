import React, {Component} from 'react';
import styled from 'react-emotion';
import {Mutation} from 'react-apollo';
import {withRouter} from 'react-router-dom';

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
import {REMOVE_SECTION, ADD_ITEM, UPDATE_SECTION} from '../../utils/mutations';

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

		const projectUrl = `/app/projects/${projectId}/${mode}`;

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
						<Mutation mutation={REMOVE_SECTION}>
							{removeSection => (
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
							)}
						</Mutation>
					</div>
				</FlexRow>
				{data.items.map(item => (
					<Item
						key={item.id}
						item={item}
						sectionId={data.id}
						editItem={editItem}
						removeItem={removeItem}
						finishItem={finishItem}
						mode={mode}
						onClickCommentIcon={() => {
							history.push(
								`${projectUrl}/items/${
									item.id
								}#comments`,
							);
						}}
						projectStatus={projectStatus}
					/>
				))}
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
