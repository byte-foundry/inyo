import React, {memo} from 'react';
import styled from '@emotion/styled/macro';

import Task from './task';

const TasksListContainer = styled('div')`
	margin-top: 3rem;
`;

function TasksList({
	items, projectId, customerId, customerToken,
}) {
	return (
		<TasksListContainer>
			{items.map(item => (
				<Task item={item} key={item.id} customerToken={customerToken} />
			))}
		</TasksListContainer>
	);
}

export default memo(
	TasksList,
	(prevProps, nextProps) => prevProps
		&& prevProps.items.length === nextProps.items.length
		&& prevProps.items.every(
			(item, i) => item.name === nextProps.items[i].name
				&& item.dueDate === nextProps.items[i].dueDate
				&& item.unit === nextProps.items[i].unit
				&& ((item.linkedCustomer === undefined
					&& nextProps.items[i].linkedCustomer === undefined)
					|| (item.linkedCustomer
						&& nextProps.items[i].linkedCustomer
						&& item.linkedCustomer.id
							=== nextProps.items[i].linkedCustomer.id))
				&& item.status === nextProps.items[i].status,
		)
		&& prevProps.projectId === nextProps.projectId
		&& prevProps.customerId === nextProps.customerId,
);
