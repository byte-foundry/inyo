import React from 'react';
import styled from '@emotion/styled/macro';

import Plural from '../Plural';
import TaskIconSvg from '../../utils/icons/taskicon.svg';
import TaskCustomerIconSvg from '../../utils/icons/taskicon.svg';
import TaskIconUserFinishedSvg from '../../utils/icons/taskicon-user-validated.svg';
import TaskIconCustomerFinishedSvg from '../../utils/icons/taskicon-customer-validated.svg';

import {LayoutMainElem} from '../../utils/new/design-system';
import {itemStatuses} from '../../utils/constants';

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
