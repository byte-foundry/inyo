import styled from '@emotion/styled/macro';
import moment from 'moment';
import React, {forwardRef} from 'react';
import {withRouter} from 'react-router-dom';

import fbt from '../../fbt/fbt.macro';
import {useMutation} from '../../utils/apollo-hooks';
import {WEEKDAYS} from '../../utils/constants';
import {formatName, isCustomerTask} from '../../utils/functions';
import {
	FINISH_ITEM,
	FOCUS_TASK,
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
	primaryWhite,
	TaskCardElem,
} from '../../utils/new/design-system';
import useUserInfos from '../../utils/useUserInfos';
import MaterialIcon from '../MaterialIcon';
import Tooltip from '../Tooltip';

const Button = styled(MaterialIcon)``;

const CardTitle = styled('span')`
	color: ${primaryBlack};
	text-overflow: ellipsis;
	overflow: hidden;
	display: flex;
	align-items: baseline;
	grid-column-start: 1;

	i {
		margin-right: 5px;
	}
`;

const Actions = styled('div')`
	position: absolute;
	background: ${primaryWhite};
	display: flex;
	overflow: hidden;
	height: 0;
	opacity: 0.97;
`;

export const TaskCardElemWithBtn = styled(TaskCardElem)`
	${Button} {
		transition: all 300ms ease;
		opacity: 0;

		pointer-events: none;
		transform: scale(0.6);

		&:hover {
			transition: all 150ms ease;
			transform: scale(1);
		}

		padding-top: 12px;
	}

	&:hover {
		box-shadow: 0 0 5px ${primaryGrey};
		transition: all 300ms ease;

		${Button} {
			opacity: 1;

			pointer-events: all;
			margin-top: 0 !important;
		}

		${Actions} {
			right: 0;
			left: 0;
			bottom: 0;
			top: 0;
			height: 100%;
		}
	}

	${props => props.done
		&& `
		opacity: 0.5;

		&:hover {
			opacity: 1;
		}
	`}
`;

const ActionsWrap = styled('div')`
	max-width: 200px;
	margin: 0 auto;
	display: flex;
	flex-direction: row;
	justify-content: space-around;
	align-items: center;

	${Button} {
		margin: 1rem 0.25rem 0;

		:nth-child(2) {
			margin-top: 2rem;
		}
		:nth-child(3) {
			margin-top: 3rem;
		}
		:nth-child(4) {
			margin-top: 4rem;
		}
	}
`;

const CardSubTitle = styled('span')`
	color: ${accentGrey};
	margin-top: 2px;
	white-space: nowrap;
	text-overflow: ellipsis;
	overflow: hidden;
	grid-column-start: 1;
`;

const CardIndex = styled('div')`
	white-space: nowrap;
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
		task, index, history, location, cardRef, isOver, date, ...rest
	}) => {
		const [finishItem] = useMutation(FINISH_ITEM);
		const [unfinishItem] = useMutation(UNFINISH_ITEM);
		const [startTaskTimer] = useMutation(START_TASK_TIMER);
		const [stopCurrentTaskTimer] = useMutation(STOP_CURRENT_TASK_TIMER);
		const [focusTask] = useMutation(FOCUS_TASK);
		const {workingDays} = useUserInfos();

		const lastWorkedTime
			= task.workedTimes.length > 0
				? task.workedTimes[task.workedTimes.length - 1]
				: null;
		const isTimerRunning = lastWorkedTime && lastWorkedTime.end === null;

		const scheduledDayIndex = task.scheduledForDays.findIndex(
			d => d.date === date,
		);
		const day = task.scheduledForDays[scheduledDayIndex];
		const status = day ? day.status : task.status;

		return (
			<TaskCardElemWithBtn
				{...rest}
				isAssigned={task.assignee}
				ref={cardRef}
				done={status === 'FINISHED'}
				hasTimerRunning={isTimerRunning}
				customerTask={isCustomerTask(task.type)}
				onClick={() => history.push({
					pathname: `/app/dashboard/${task.id}`,
					state: {prevSearch: location.search},
				})
				}
			>
				{isOver && <DragSeparator />}
				{!!task.tags.length && (
					<>
						<TagContainer>
							{task.tags.map(tag => (
								<Tooltip label={tag.name}>
									<Tag bg={tag.colorBg} />
								</Tooltip>
							))}
						</TagContainer>
						<div>
							{status === 'FINISHED' && (
								<MaterialIcon
									icon="check_circle"
									size="tiny"
									color={primaryPurple}
								/>
							)}
						</div>
					</>
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
				<CardIndex>
					{task.scheduledForDays.length > 1
						? `${scheduledDayIndex + 1}/${
							task.scheduledForDays.length
						  }`
						: ''}
				</CardIndex>
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
				<Actions>
					<ActionsWrap>
						{!isCustomerTask(task.type) && (
							<Tooltip
								label={
									<fbt
										project="inyo"
										desc="Actions card open"
									>
										Ouvrir la tâche
									</fbt>
								}
							>
								<Button
									noBg
									current={status === 'FINISHED'}
									invert={status === 'FINISHED'}
									icon="zoom_out_map"
									size="medium"
									color={primaryBlack}
									onClick={(e) => {}}
								/>
							</Tooltip>
						)}
						{!isCustomerTask(task.type) && (
							<Tooltip
								label={
									<fbt
										project="inyo"
										desc="Actions card divide"
									>
										Planifier cette tâche sur plusieurs
										jours
									</fbt>
								}
							>
								<Button
									noBg
									current={status === 'FINISHED'}
									invert={status === 'FINISHED'}
									icon="control_point_duplicate"
									size="medium"
									color={primaryBlack}
									onClick={(e) => {
										e.stopPropagation();

										const nextWorkingDay = moment(date);

										if (workingDays.length > 0) {
											do {
												nextWorkingDay.add(1, 'day');
											} while (
												!workingDays.includes(
													WEEKDAYS[
														nextWorkingDay.day()
													],
												)
											);
										}
										else {
											nextWorkingDay.add(1, 'days');
										}

										focusTask({
											refetchQueries: ['getPlannedTimes'],
											awaitRefetchQueries: true,
											variables: {
												itemId: task.id,
												for: nextWorkingDay.format(
													moment.HTML5_FMT.DATE,
												),
												action: 'SPLIT',
											},
										});
									}}
								/>
							</Tooltip>
						)}
						{!isCustomerTask(task.type) && status !== 'FINISHED' && (
							<Tooltip
								label={
									isTimerRunning ? (
										<fbt
											project="inyo"
											desc="Actions card pause"
										>
											Stopper le chronomètre
										</fbt>
									) : (
										<fbt
											project="inyo"
											desc="Actions card play"
										>
											Lancer le chronomètre
										</fbt>
									)
								}
							>
								<Button
									noBg
									current={isTimerRunning}
									invert={false}
									icon={
										isTimerRunning
											? 'pause_circle_outline'
											: 'play_circle_outline'
									}
									size="medium"
									color={
										isTimerRunning
											? primaryPurple
											: primaryBlack
									}
									onClick={(e) => {
										e.stopPropagation();

										if (isTimerRunning) {
											stopCurrentTaskTimer();
										}
										else {
											focusTask({
												refetchQueries: [
													'getPlannedTimes',
												],
												awaitRefetchQueries: true,
												variables: {
													itemId: task.id,
													action: 'SPLIT',
												},
												optimisticResponse: {
													focusTask: {
														...task,
														scheduledFor: moment().format(
															moment.HTML5_FMT
																.DATE,
														),
														schedulePosition: -1,
														isFocused: true,
													},
												},
											});

											startTaskTimer({
												variables: {id: task.id},
											});
										}
									}}
								/>
							</Tooltip>
						)}
						{!isCustomerTask(task.type) && (
							<Tooltip
								label={
									<fbt
										project="inyo"
										desc="Actions card done"
									>
										Marquer la tâche comme faite
									</fbt>
								}
							>
								<Button
									noBg
									current={status === 'FINISHED'}
									invert={status === 'FINISHED'}
									icon={
										status === 'FINISHED'
											? 'check_circle'
											: 'check_circle_outline'
									}
									size="medium"
									color={
										status === 'FINISHED'
											? primaryPurple
											: primaryBlack
									}
									onClick={(e) => {
										e.stopPropagation();

										if (status === 'FINISHED') {
											unfinishItem({
												variables: {
													itemId: task.id,
													for: date,
												},
											});
										}
										else {
											finishItem({
												variables: {
													itemId: task.id,
													for: date,
												},
											});
										}
									}}
								/>
							</Tooltip>
						)}
					</ActionsWrap>
				</Actions>
			</TaskCardElemWithBtn>
		);
	},
);

export default forwardRef((props, ref) => (
	<TaskCard {...props} cardRef={ref} />
));
