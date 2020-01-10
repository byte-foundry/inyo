import styled from '@emotion/styled/macro';
import React, {forwardRef} from 'react';
import {withRouter} from 'react-router-dom';

import {useMutation} from '../../utils/apollo-hooks';
import {formatName, isCustomerTask} from '../../utils/functions';
import {
	FINISH_ITEM,
	START_TASK_TIMER,
	STOP_CURRENT_TASK_TIMER,
	UNFINISH_ITEM,
} from '../../utils/mutations';
import {
	accentGrey,
	DragSeparator,
	primaryBlack,
	primaryGrey,
	primaryPurple,
	TaskCardElem,
} from '../../utils/new/design-system';
import IconButton from '../IconButton';
import MaterialIcon from '../MaterialIcon';
import Tooltip from '../Tooltip';

const Button = styled(IconButton)``;
const TimerButton = styled(IconButton)``;

const CardTitle = styled('span')`
	display: block;
	color: ${primaryBlack};
	text-overflow: ellipsis;
	overflow: hidden;
	display: flex;
	align-items: baseline;
	grid-column-start: 1;

	${props => props.hasCheckbox && 'grid-column: 1 / 3;'}

	i {
		margin-right: 5px;
	}
`;

export const TaskCardElemWithBtn = styled(TaskCardElem)`
	${props => !props.hasTimerRunning
		&& `
		${Button}, ${TimerButton} {
			transition: all 300ms ease;
			opacity: 0;

			pointer-events: none;
		}
	`}

	&:hover {
		box-shadow: 0 0 5px ${primaryGrey};
		transition: all 300ms ease;

		${Button}, ${TimerButton} {
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

			&::after {
				background: transparent;
			}
		}
	`}
`;

const CardSubTitle = styled('span')`
	color: ${accentGrey};
	margin-top: 2px;
	white-space: nowrap;
	text-overflow: ellipsis;
	overflow: hidden;
	grid-column-start: 1;
`;

const TagContainer = styled('div')`
	margin-bottom: 5px;
	display: flex;
`;

const Tag = styled('span')`
	background-color: ${props => props.bg};
	width: 50px;
	height: 10px;
	border-radius: 5px;
	margin-right: 4px;
`;

const TaskCard = withRouter(
	({
		task, index, history, location, cardRef, isOver, ...rest
	}) => {
		const [finishItem] = useMutation(FINISH_ITEM);
		const [unfinishItem] = useMutation(UNFINISH_ITEM);
		const [startTaskTimer] = useMutation(START_TASK_TIMER);
		const [stopCurrentTaskTimer] = useMutation(STOP_CURRENT_TASK_TIMER);

		const lastWorkedTime
			= task.workedTimes.length > 0
				? task.workedTimes[task.workedTimes.length - 1]
				: null;
		const isTimerRunning = lastWorkedTime && lastWorkedTime.end === null;

		return (
			<TaskCardElemWithBtn
				{...rest}
				isAssigned={task.assignee}
				ref={cardRef}
				done={task.status === 'FINISHED'}
				hasTimerRunning={isTimerRunning}
				customerTask={isCustomerTask(task.type)}
				onClick={() => history.push({
					pathname: `/app/dashboard/${task.id}`,
					state: {prevSearch: location.search},
				})
				}
			>
				{isOver && <DragSeparator />}
				{!isCustomerTask(task.type) && task.status !== 'FINISHED' && (
					<TimerButton
						noBg
						current={isTimerRunning}
						invert={false}
						style={{
							gridColumnStart: '2',
							gridRow: '1 / 3',
						}}
						icon={
							isTimerRunning
								? 'pause_circle_filled'
								: 'play_circle_filled'
						}
						size="tiny"
						color={isTimerRunning ? primaryPurple : primaryGrey}
						onClick={(e) => {
							e.stopPropagation();

							isTimerRunning
								? stopCurrentTaskTimer()
								: startTaskTimer({variables: {id: task.id}});
						}}
					/>
				)}
				{!isCustomerTask(task.type) && (
					<Button
						noBg
						current={task.status === 'FINISHED'}
						invert={task.status === 'FINISHED'}
						style={{
							gridColumnStart: '3',
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
				{task.section && (
					<CardSubTitle>{task.section.project.name}</CardSubTitle>
				)}
				{task.linkedCustomer && !task.section && (
					<CardSubTitle>
						{task.linkedCustomer.name} (
						{formatName(
							task.linkedCustomer.firstName,
							task.linkedCustomer.lastName,
						)}
						)
					</CardSubTitle>
				)}
			</TaskCardElemWithBtn>
		);
	},
);

export default forwardRef((props, ref) => (
	<TaskCard {...props} cardRef={ref} />
));
