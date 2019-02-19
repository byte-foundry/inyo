import React from 'react';
import styled from '@emotion/styled/macro';

import Task from './task';

const TasksListContainer = styled('div')`
	margin-top: 3rem;
`;

function TasksList({items, projectId, sectionId}) {
	return (
		<TasksListContainer>
			{items.map(item => (
				<Task
					item={item}
					key={item.id}
					projectId={projectId}
					sectionId={sectionId}
				/>
			))}
		</TasksListContainer>
	);
}

export default TasksList;
