import React from 'react';
import styled from '@emotion/styled';
import {Route} from 'react-router-dom';

import {ModalContainer as Modal, ModalElem} from '../../../utils/content';
import TaskView from '../../../components/ItemView';
import CustomerTasks from './tasks';

const Container = styled('div')`
	min-height: 100vh;
`;

const Tasks = ({match}) => {
	const {customerToken} = match.params;

	return (
		<Container>
			<CustomerTasks customerToken={customerToken} />

			<Route
				path="/app/:customerToken/tasks/:taskId"
				render={({
					location: {state = {}},
					history,
					match: {
						params: {taskId},
					},
				}) => (
					<Modal
						onDismiss={() => history.push(
							`/app/${customerToken}/tasks${state.prevSearch
									|| ''}`,
						)
						}
					>
						<ModalElem>
							<TaskView
								id={taskId}
								customerToken={customerToken}
								close={() => history.push(
									`/app/${customerToken}/tasks${state.prevSearch
											|| ''}`,
								)
								}
							/>
						</ModalElem>
					</Modal>
				)}
			/>
		</Container>
	);
};

export default Tasks;
