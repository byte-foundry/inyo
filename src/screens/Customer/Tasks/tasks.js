import React from 'react';
import {useQuery} from 'react-apollo-hooks';
import ReactTooltip from 'react-tooltip';

import {GET_CUSTOMER_TASKS} from '../../../utils/queries';
import {TOOLTIP_DELAY} from '../../../utils/constants';
import ProjectList from '../../../components/ProjectTasksList';
import TasksListComponent from '../../../components/TasksList';

const CustomerTasks = ({customerToken, projectId}) => {
	const {data, error} = useQuery(GET_CUSTOMER_TASKS, {
		variables: {
			token: customerToken,
		},
	});

	if (error) throw error;

	const {tasks} = data;

	// order by creation date
	tasks.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

	if (projectId) {
		return (
			<>
				<ProjectList
					projectId={projectId}
					items={tasks.filter(
						item => item.section
							&& item.section.project.id === projectId,
					)}
				/>
				<ReactTooltip effect="solid" delayShow={TOOLTIP_DELAY} />
			</>
		);
	}

	return (
		<>
			<TasksListComponent items={tasks} customerToken={customerToken} />
			<ReactTooltip effect="solid" delayShow={TOOLTIP_DELAY} />
		</>
	);
};

export default CustomerTasks;
