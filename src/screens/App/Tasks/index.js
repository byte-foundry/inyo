import styled from '@emotion/styled';
import React, {Component} from 'react';
import {Route} from 'react-router-dom';

import TaskView from '../../../components/ItemView';
import {ModalContainer as Modal, ModalElem} from '../../../utils/content';
import TasksList from './tasks-lists';

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
					render={({location: {state = {}}, match, history}) => (
						<Modal
							onDismiss={() => history.push(
								`/app/tasks${state.prevSearch || ''}`,
							)
							}
						>
							<ModalElem>
								<TaskView
									id={match.params.taskId}
									close={() => history.push(
										`/app/tasks${state.prevSearch
												|| ''}`,
									)
									}
									isActivating={state.isActivating}
									scheduledFor={state.scheduledFor}
								/>
							</ModalElem>
						</Modal>
					)}
				/>
			</ProjectMain>
		);
	}
}

export default Tasks;
