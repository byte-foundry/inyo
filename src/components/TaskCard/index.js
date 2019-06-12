import React, {forwardRef} from 'react';
import {withRouter} from 'react-router-dom';
import styled from '@emotion/styled';
import {useMutation} from 'react-apollo-hooks';

import {isCustomerTask} from '../../utils/functions';
import IconButton from '../../utils/new/components/IconButton';
import {
	accentGrey,
	primaryBlack,
	primaryGrey,
	primaryPurple,
	primaryRed,
	DragSeparator,
} from '../../utils/new/design-system';
import {FINISH_ITEM, UNFINISH_ITEM} from '../../utils/mutations';

const TaskCardElem = styled('div')`
	background: #fff;
	border: 1px solid ${props => (props.customerTask ? primaryRed : accentGrey)};
	border-radius: 3px;
	padding: 5px;
	margin-bottom: 5px;
	font-size: 0.75rem;
	display: grid;
	grid-template-columns: 1fr auto;
	cursor: pointer;
	position: relative;
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

const TaskCard = withRouter(
	({
		task,
		index,
		connectDragSource,
		connectDropTarget,
		history,
		location,
		cardRef,
		isOver,
		...rest
	}) => {
		const finishItem = useMutation(FINISH_ITEM);
		const unfinishItem = useMutation(UNFINISH_ITEM);

		return (
			<TaskCardElem
				{...rest}
				ref={cardRef}
				customerTask={isCustomerTask(task.type)}
				onClick={() => history.push({
					pathname: `/app/dashboard/${task.id}`,
					state: {prevSearch: location.search},
				})
				}
			>
				{isOver && <DragSeparator />}
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
						onClick={(e) => {
							e.stopPropagation();

							if (task.status === 'FINISHED') {
								unfinishItem({variables: {itemId: task.id}});
							}
							else {
								finishItem({variables: {itemId: task.id}});
							}
						}}
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
		);
	},
);

export default forwardRef((props, ref) => (
	<TaskCard {...props} cardRef={ref} />
));
