import React, {Component} from 'react';
import styled from '@emotion/styled';
import {Switch, Route} from 'react-router-dom';

import TasksList from './tasks-lists.js';

const ProjectMain = styled('div')`
	min-height: 100vh;
`;

class Tasks extends Component {
	render() {
		return (
			<ProjectMain>
				<Switch>
					<Route exact path="/app/tasks" component={TasksList} />
				</Switch>
			</ProjectMain>
		);
	}
}

export default Tasks;
