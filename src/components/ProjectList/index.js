import React, {Component} from 'react';
import styled from '@emotion/styled';

import ProjectStateList from '../ProjectStateList';
import {projectState} from '../../containers/App/Project/project-list';

const ProjectListMain = styled('div')`
	display: flex;
	flex-flow: row nowrap;
	padding-left: 40px;
	padding-right: 40px;
`;

class ProjectList extends Component {
	render() {
		const {projects} = this.props;

		const projectColumn = Object.keys(projectState).map((state) => {
			const filteredProjects = projects.filter(
				project => project.status === state,
			);

			return (
				<ProjectStateList
					projects={filteredProjects}
					projectState={state}
				/>
			);
		});

		return <ProjectListMain>{projectColumn}</ProjectListMain>;
	}
}

export default ProjectList;
