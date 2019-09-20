import styled from '@emotion/styled/macro';
import React, {forwardRef} from 'react';
import {useMutation} from 'react-apollo-hooks';
import {withRouter} from 'react-router-dom';

import {formatName, isCustomerTask} from '../../utils/functions';
import {FINISH_ITEM, UNFINISH_ITEM} from '../../utils/mutations';
import {
	accentGrey,
	DragSeparator,
	mediumGrey,
	primaryBlack,
	primaryGrey,
	primaryPurple,
	primaryWhite,
	TaskCardElem,
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
	display: flex;
	align-items: baseline;

	${props => props.hasCheckbox && 'grid-column: 1 / 3;'}

	i {
		margin-right: 5px;
	}
`;

const CardSubTitle = styled('span')`
	color: ${accentGrey};
	margin-top: 2px;
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
						noBg
						current={task.status === 'FINISHED'}
						invert={task.status === 'FINISHED'}
						style={{
							gridColumnStart: '2',
							gridRow: '1 / 3',
						}}
						icon="check_circle"
						size="tiny"
						color={
							task.status === 'FINISHED'
								? primaryPurple
								: primaryGrey
						}
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
					<CardSubTitle>
						{task.linkedCustomer.name} (
						{formatName(
							task.linkedCustomer.firstName,
							task.linkedCustomer.lastName,
						)}
						)
					</CardSubTitle>
				)}
			</TaskCardElem>
		);
	},
);

export default forwardRef((props, ref) => (
	<TaskCard {...props} cardRef={ref} />
));
