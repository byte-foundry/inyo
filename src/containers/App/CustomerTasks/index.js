import React from 'react';
import styled from '@emotion/styled';
import {Route} from 'react-router-dom';

import {ModalContainer as Modal, ModalElem} from '../../../utils/content';
import TaskView from '../../../components/ItemView';
import CustomerTasks from './tasks';

const Container = styled('div')`
	min-height: 100vh;
	padding: 3rem;
`;

const Tasks = ({location, match}) => {
	const {customerToken} = match.params;
	const {prevSearch} = location.state || {};
	const query = new URLSearchParams(prevSearch || location.search);
	const projectId = query.get('projectId');

	// const setProjectSelected = (selected, removeCustomer) => {
	// 	const newQuery = new URLSearchParams(query);

	// 	if (selected) {
	// 		const {value: selectedProjectId} = selected;

	// 		newQuery.set('projectId', selectedProjectId);
	// 	}
	// 	else if (newQuery.has('projectId')) {
	// 		newQuery.delete('projectId');
	// 	}

	// 	if (removeCustomer) {
	// 		newQuery.delete('customerId');
	// 	}

	// 	history.push(`/app/tasks?${newQuery.toString()}`);
	// };

	return (
		<Container>
			<CustomerTasks
				customerToken={customerToken}
				projectId={projectId}
			/>

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
