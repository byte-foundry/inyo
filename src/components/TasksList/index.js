import React, {memo} from 'react';
import styled from '@emotion/styled/macro';

import Task from './task';

const TasksListContainer = styled('div')`
	margin-top: 3rem;
`;

function TasksList({items, projectId, customerId}) {
	return (
		<TasksListContainer>
			{items.map(item => (
				<Task item={item} key={item.id} />
			))}
		</TasksListContainer>
	);
}

export default memo(TasksList, (prevProps, nextProps) => (
	prevProps
		&& prevProps.items.length === nextProps.items.length
		&& prevProps.projectId === nextProps.projectId
		&& prevProps.customerId === nextProps.customerId
));
