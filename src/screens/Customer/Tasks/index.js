import styled from '@emotion/styled';
import React from 'react';
import {Route} from 'react-router-dom';

import TaskView from '../../../components/ItemView';
import {BREAKPOINTS} from '../../../utils/constants';
import {ModalContainer as Modal, ModalElem} from '../../../utils/content';
import CustomerTasks from './tasks';

const Container = styled('div')`
	min-height: 100vh;
	padding: 3rem;

	@media (max-width: ${BREAKPOINTS.mobile}px) {
		padding: 1rem;
	}
`;

const Tasks = ({location, match}) => {
	const {customerToken} = match.params;
	const {prevSearch} = location.state || {prevSearch: location.search};
	const query = new URLSearchParams(prevSearch || location.search);
	const projectId = query.get('projectId');

	return (
		<Container>
			<CustomerTasks projectId={projectId} location={location} />

			<Route
				path="/app/:customerToken/tasks/:taskId"
				render={({
					location: {state = {}},
					history,
					match: {
						params: {taskId}
					}
				}) => (
					<Modal
						onDismiss={() =>
							history.push(
								`/app/${customerToken}/tasks${state.prevSearch ||
									prevSearch ||
									''}`
							)
						}
					>
						<ModalElem>
							<TaskView
								id={taskId}
								customerToken={customerToken}
								close={() =>
									history.push(
										`/app/${customerToken}/tasks${state.prevSearch ||
											''}`
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
