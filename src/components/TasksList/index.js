import React from 'react';
import styled from '@emotion/styled/macro';

import {LayoutMainElem} from '../../utils/new/design-system';

import Task from './task';

const TasksListContainer = styled(LayoutMainElem)`
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
