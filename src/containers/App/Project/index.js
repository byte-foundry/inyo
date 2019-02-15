import React, {Component} from 'react';
import styled from '@emotion/styled';
import {Switch, Route, Redirect} from 'react-router-dom';

const ProjectMain = styled('div')`
	min-height: 100vh;
`;

class Project extends Component {
	render() {
		return (
			<ProjectMain>
				<Switch>
					<Route
						exact
						path="/app/projects"
						render={() => <Redirect to="/app/tasks" />}
					/>
					<Route
						path="/app/projects/:projectId/see"
						render={({match: {projectId}}) => (
							<Redirect to={`/app/tasks?project=${projectId}`} />
						)}
					/>
					<Route
						path="/app/projects/:projectId/edit/"
						render={({match: {projectId}}) => (
							<Redirect to={`/app/tasks?project=${projectId}`} />
						)}
					/>
					<Route
						path="/app/projects/create/from/:projectId"
						render={() => <Redirect to="/app/tasks" />}
					/>
					<Route
						path="/app/projects/create"
						render={() => <Redirect to="/app/tasks" />}
					/>
				</Switch>
			</ProjectMain>
		);
	}
}

export default Project;
