import styled from '@emotion/styled/macro';
import React, {forwardRef} from 'react';
import {useMutation} from 'react-apollo-hooks';
import {withRouter} from 'react-router-dom';

import {isCustomerTask} from '../../utils/functions';
import {FINISH_ITEM, UNFINISH_ITEM} from '../../utils/mutations';
import {
	accentGrey,
	DragSeparator,
	lightGrey,
	mediumGrey,
	primaryBlack,
	primaryGrey,
	primaryWhite,
} from '../../utils/new/design-system';
import IconButton from '../IconButton';
import MaterialIcon from '../MaterialIcon';
import Tooltip from '../Tooltip';

const Button = styled(IconButton)``;

const CardTitle = styled('span')`
	display: block;
	color: ${primaryBlack};
	text-overflow: ellipsis;
	overflow: hidden;

	${props => props.hasCheckbox && 'grid-column: 1 / 3;'}
`;

const CardSubTitle = styled('span')`
	color: ${accentGrey};
	margin-top: 2px;
`;

const TaskCardElem = styled('div')`
	background: ${primaryWhite};
	border: 1px solid ${mediumGrey};
	box-shadow: 3px 3px 6px ${mediumGrey};
	${props => props.customerTask && 'border-bottom: 2px solid #ff3366;'}
	border-radius: 3px;
	padding: 8px;
	margin-bottom: 5px;
	font-size: 0.8rem;
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
		box-shadow: 0 0 5px ${primaryGrey};
		transition: all 300ms ease;

		${Button} {
			opacity: 1;

			pointer-events: all;
		}
	}

	${props => props.done
		&& `
		opacity: 0.5;

		&:hover {
			opacity: 1;
		}

		${Button} {
			margin-right: 0;
			opacity: 1;

			pointer-events: all;
		}
	`}
`;

const TagContainer = styled('div')`
	margin-bottom: 5px;
	display: flex;
`;

const Tag = styled('span')`
	background-color: ${props => props.bg};
	width: 10px;
	height: 10px;
	border-radius: 50%;
	margin-right: 3px;
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
				isAssigned={task.assignee}
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
				{!!task.tags.length && (
					<TagContainer>
						{task.tags.map(tag => (
							<Tooltip label={tag.name}>
								<Tag bg={tag.colorBg} />
							</Tooltip>
						))}
					</TagContainer>
				)}
				<CardTitle hasCheckbox={isCustomerTask(task.type)}>
					{task.assignee && (
						<MaterialIcon
							icon="reply"
							size="micro"
							color="inherit"
						/>
					)}{' '}
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
