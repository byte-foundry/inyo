import React, {Component} from 'react';
import {Redirect} from 'react-router-dom';
import styled from 'react-emotion';

import ProjectCard from '../ProjectCard';
import {
	P,
	primaryNavyBlue,
	primaryBlue,
	primaryWhite,
	gray20,
} from '../../utils/content';

const ProjectStateListMain = styled('div')`
	display: flex;
	flex-direction: column;
	flex: 1;
`;

const ProjectStateTitle = styled('div')`
	display: flex;
	flex-flow: row nowrap;
	justify-content: space-between;
	margin: 10px 10px 10px 0;
	padding: 14px 16px 15px 16px;
	border: 1px solid ${gray20};
	border-radius: 3px;
	background-color: ${primaryWhite};
	border-bottom: 3px solid ${primaryBlue};
`;
const ProjectStateQuantity = styled('label')`
	font-size: 13px;
	color: ${primaryNavyBlue};
	margin: 0;
`;
const ProjectStateAmount = styled(P)`
	font-size: 13px;
	color: ${primaryNavyBlue};
	margin: 0;
`;
const ProjectStateName = styled(P)`
	font-size: 13px;
	color: ${primaryNavyBlue};
	font-weight: bold;
	margin: 0;
`;
const ProjectStateTotal = styled(P)`
	font-size: 13px;
	color: ${primaryBlue};
	margin: 0;
`;

const projectStateName = {
	DRAFT: 'Brouillons',
	ONGOIND: 'En cours',
	FINISHED: 'Finis',
};

class ProjectStateList extends Component {
	constructor(props) {
		super(props);
		this.state = {
			shouldRedirect: false,
		};
	}

	render() {
		const {projects, projectState} = this.props;

		const projectColumn = projects.map(project => (
			<ProjectCard project={project} />
		));

		const projectTotal = projects.reduce((sum, e) => sum + e.total, 0);

		return (
			<ProjectStateListMain>
				<ProjectStateTitle>
					<ProjectStateName>
						{projectStateName[projectState]}
					</ProjectStateName>
					<ProjectStateAmount>{projects.length}</ProjectStateAmount>
					<ProjectStateTotal>
						{projectTotal.toLocaleString('fr-FR')}
					</ProjectStateTotal>
				</ProjectStateTitle>
				{projectColumn}
			</ProjectStateListMain>
		);
	}
}

export default ProjectStateList;
