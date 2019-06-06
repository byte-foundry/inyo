import React, {forwardRef} from 'react';
import styled from '@emotion/styled';

import {isCustomerTask} from '../../utils/functions';
import IconButton from '../../utils/new/components/IconButton';
import {
	mediumGrey,
	primaryBlack,
	primaryGrey,
} from '../../utils/new/design-system';

const TaskCardElem = styled('div')`
	background: #fff;
	border: 2px solid ${mediumGrey};
	border-radius: 3px;
	padding: 5px;
	margin-bottom: 5px;
	font-size: 0.75rem;
	display: grid;
	grid-template-columns: 1fr auto;
`;

const CardTitle = styled('span')`
	display: block;
	color: ${primaryBlack};
	text-overflow: ellipsis;
	overflow: hidden;
`;

const CardSubTitle = styled('span')`
	color: ${primaryGrey};
`;

const TaskCard = forwardRef(({task, index, ...rest}, ref) => (
	<TaskCardElem {...rest} ref={ref}>
		{!isCustomerTask(task.type) && (
			<IconButton
				current={task.status === 'FINISHED'}
				invert={task.status === 'FINISHED'}
				style={{
					gridColumnStart: '2',
					gridRow: '1 / 3',
				}}
				icon="done"
				size="tiny"
			/>
		)}
		<CardTitle
			style={{
				gridColumn: isCustomerTask(task.type) ? '1 / 3' : '',
			}}
		>
			{task.name}
		</CardTitle>
		{task.linkedCustomer && (
			<CardSubTitle>{task.linkedCustomer.name}</CardSubTitle>
		)}
	</TaskCardElem>
));

export default TaskCard;
