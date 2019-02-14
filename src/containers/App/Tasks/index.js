import React, {Component} from 'react';
import styled from '@emotion/styled';
import {Route} from 'react-router-dom';

import {ModalContainer as Modal, ModalElem} from '../../../utils/content';
import TasksList from './tasks-lists';
import TaskView from '../../../components/ItemView';

const ProjectMain = styled('div')`
	min-height: 100vh;
`;

class Tasks extends Component {
	render() {
		return (
			<ProjectMain>
				<Route path="/app/tasks" component={TasksList} />
				<Route
					path="/app/tasks/:taskId"
					render={({match, history}) => (
						<Modal onDismiss={() => history.push('/app/tasks')}>
							<ModalElem>
								<TaskView id={match.params.taskId} />
							</ModalElem>
						</Modal>
					)}
				/>
			</ProjectMain>
		);
	}
}

export default Tasks;
