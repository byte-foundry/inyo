import React from 'react';
import {useQuery} from 'react-apollo-hooks';
import styled from '@emotion/styled';
import ReactTooltip from 'react-tooltip';

import {GET_CUSTOMER_TASKS} from '../../../utils/queries';
import {TOOLTIP_DELAY} from '../../../utils/constants';
import ProjectList from '../../../components/ProjectTasksList';
import TasksListComponent from '../../../components/TasksList';

const Container = styled('div')`
	display: flex;
	justify-content: center;
	flex: 1;
`;

const TaskAndArianne = styled('div')`
	flex: auto;
	max-width: 980px;
`;

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
		<Container>
			<TaskAndArianne>
				<TasksListComponent
					items={tasks}
					customerToken={customerToken}
				/>
				<ReactTooltip effect="solid" delayShow={TOOLTIP_DELAY} />
			</TaskAndArianne>
		</Container>
	);
};

export default CustomerTasks;
