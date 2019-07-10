import styled from '@emotion/styled/macro';
import React, {forwardRef} from 'react';
import {useMutation} from 'react-apollo-hooks';
import {withRouter} from 'react-router-dom';

import {isCustomerTask} from '../../utils/functions';
import {FINISH_ITEM, UNFINISH_ITEM} from '../../utils/mutations';
import {
	accentGrey,
	DragSeparator,
	primaryBlack,
	primaryGrey,
	primaryRed,
	primaryWhite,
} from '../../utils/new/design-system';
import IconButton from '../IconButton';

const Button = styled(IconButton)``;

const CardTitle = styled('span')`
	display: block;
	color: ${primaryBlack};
	text-overflow: ellipsis;
	overflow: hidden;

	${props => props.hasCheckbox && 'grid-column: 1 / 3;'}
`;

const CardSubTitle = styled('span')`
	color: ${primaryGrey};
`;

const TaskCardElem = styled('div')`
	background: ${primaryWhite};
	border: 1px solid ${accentGrey};
	${props => props.customerTask && 'border-bottom: 2px solid #ff3366;'}
	border-radius: 3px;
	padding: 5px;
	margin-bottom: 5px;
	font-size: 0.75rem;
	line-height: 1.4;
	display: grid;
	grid-template-columns: 1fr 1.2rem;
	cursor: pointer;
	position: relative;

	transition: all 300ms ease;

	${Button} {
		transition: all 300ms ease;
		opacity: 0;

		pointer-events: none;
	}

	&:hover {
		box-shadow: 0 0 5px ${accentGrey};
		transition: all 300ms ease;

		${Button} {
			opacity: 1;

			pointer-events: all;
		}
	}

	${props => props.done
		&& `
		${Button} {
			margin-right: 0;
			opacity: 1;

			pointer-events: all;
		}
	`}
`;

const TaskCard = withRouter(
	({
		task, index, history, location, cardRef, isOver, ...rest
	}) => {
		const [finishItem] = useMutation(FINISH_ITEM);
		const [unfinishItem] = useMutation(UNFINISH_ITEM);

		return (
			<TaskCardElem
				{...rest}
				ref={cardRef}
				done={task.status === 'FINISHED'}
				customerTask={isCustomerTask(task.type)}
				onClick={() => history.push({
					pathname: `/app/dashboard/${task.id}`,
					state: {prevSearch: location.search},
				})
				}
			>
				{isOver && <DragSeparator />}
				{!isCustomerTask(task.type) && (
					<Button
						current={task.status === 'FINISHED'}
						invert={task.status === 'FINISHED'}
						style={{
							gridColumnStart: '2',
							gridRow: '1 / 3',
						}}
						icon="done"
						size="micro"
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
				<CardTitle hasCheckbox={isCustomerTask(task.type)}>
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
