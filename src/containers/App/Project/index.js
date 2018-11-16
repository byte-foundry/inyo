import React, {Component} from 'react';
import styled from 'react-emotion';
import {Switch, Route} from 'react-router-dom';

import ProjectSee from './project-see';
import ProjectEdit from './project-edit';
import ProjectCreate from './project-create';
import ProjectList from './project-list';

const ProjectMain = styled('div')`
	min-height: 100vh;
`;

class Project extends Component {
	render() {
		return (
			<ProjectMain>
				<Switch>
					<Route exact path="/app/projects" component={ProjectList} />
					<Route
						path="/app/projects/:projectId/see"
						component={ProjectSee}
					/>
					<Route
						path="/app/projects/:projectId/edit/"
						component={ProjectEdit}
					/>
					<Route
						path="/app/projects/create"
						component={ProjectCreate}
					/>
				</Switch>
			</ProjectMain>
		);
	}
}

export default Project;
