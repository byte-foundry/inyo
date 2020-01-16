import styled from '@emotion/styled';
import moment from 'moment';
import React, {useEffect, useState} from 'react';

import fbt from '../../fbt/fbt.macro';
import {useMutation} from '../../utils/apollo-hooks';
import {BREAKPOINTS} from '../../utils/constants';
import {formatName} from '../../utils/functions';
import {START_TASK_TIMER, STOP_CURRENT_TASK_TIMER} from '../../utils/mutations';
import {primaryWhite} from '../../utils/new/design-system';
import Button from '../IconButton';
import TaskActivationButton from '../TaskActivationButton';
import TaskCustomerActivationButton from '../TaskCustomerActivationButton';
import Tooltip from '../Tooltip';

const Timer = styled('div')`
	display: flex;
	position: absolute;
	left: 15px;

	@media (max-width: ${BREAKPOINTS.mobile}px) {
		position: static;
		min-width: 100px;
	}
`;

const TimerText = styled('div')`
	padding-left: 0.5em;
`;

const RefreshSeconds = ({children}) => {
	const [, forceUpdate] = useState();
	useEffect(() => {
		const id = setInterval(() => forceUpdate(new Date()), 1000);

		return () => clearInterval(id);
	});
	return children();
};

function TaskActivationHeader({
	item,
	customerTask,
	focusTask,
	activableTask,
	setIsActivating,
}) {
	const [stopCurrentTaskTimer] = useMutation(STOP_CURRENT_TASK_TIMER);
	const [startTaskTimer] = useMutation(START_TASK_TIMER);

	const lastWorkedTime
		= item.workedTimes.length > 0
			? item.workedTimes[item.workedTimes.length - 1]
			: null;
	const previousTimesDiff = item.workedTimes
		.slice(0, -1)
		.reduce(
			(duration, {start, end}) => duration.add(moment(end).diff(start)),
			moment.duration(),
		);

	return (
		<>
			{customerTask
				&& activableTask
				&& item.type !== 'INVOICE'
				&& ((item.linkedCustomer && (
					<TaskCustomerActivationButton
						taskId={item.id}
						isActive={item.scheduledFor}
						customerName={
							item.linkedCustomer
							&& `${item.linkedCustomer.name} (${formatName(
								item.linkedCustomer.firstName,
								item.linkedCustomer.lastName,
							)})`
						}
						onCommit={() => {
							if (item.type === 'CONTENT_ACQUISITION') {
								focusTask({
									variables: {itemId: item.id},
									optimisticResponse: {
										focusTask: {
											...item,
											scheduledFor: moment().format(
												moment.HTML5_FMT.DATE,
											),
											schedulePosition: -1,
											isFocused: true,
										},
									},
								});
							}
							else {
								setIsActivating(true);
							}
						}}
					/>
				)) || (
					<div>
						<fbt
							project="inyo"
							desc="missing customer to activate task"
						>
							Il manque un client à cette tâche pour qu'elle soit
							réalisable.
						</fbt>
					</div>
				))}
			{customerTask
				&& activableTask
				&& item.type === 'INVOICE'
				&& ((item.linkedCustomer && item.attachments.length > 0 && (
					<TaskCustomerActivationButton
						taskId={item.id}
						isActive={item.scheduledFor}
						customerName={
							item.linkedCustomer
							&& `${item.linkedCustomer.name} (${formatName(
								item.linkedCustomer.firstName,
								item.linkedCustomer.lastName,
							)})`
						}
						onCommit={() => {
							if (item.type === 'CONTENT_ACQUISITION') {
								focusTask({
									variables: {itemId: item.id},
									optimisticResponse: {
										focusTask: {
											...item,
											scheduledFor: moment().format(
												moment.HTML5_FMT.DATE,
											),
											schedulePosition: -1,
											isFocused: true,
										},
									},
								});
							}
							else {
								setIsActivating(true);
							}
						}}
					/>
				))
					|| (item.linkedCustomer && item.attachments.length === 0 && (
						<div>
							<fbt
								project="inyo"
								desc="missing invoice to activate task"
							>
								Il manque une facture à cette tâche pour qu'elle
								soit réalisable. Joignez une facture à cette
								tâche.
							</fbt>
						</div>
					))
					|| (!item.linkedCustomer && item.attachments.length > 0 && (
						<div>
							<fbt
								project="inyo"
								desc="missing customer to activate task"
							>
								Il manque un client à cette tâche pour qu'elle
								soit réalisable.
							</fbt>
						</div>
					))
					|| (!item.linkedCustomer && item.attachments.length === 0 && (
						<div>
							<fbt
								project="inyo"
								desc="missing customer and invoice to activate task"
							>
								Il manque un client et une facture à cette tâche
								pour qu'elle soit réalisable.
							</fbt>
						</div>
					)))}
			{!customerTask && activableTask && (
				<>
					<Timer>
						{lastWorkedTime && !lastWorkedTime.end ? (
							<>
								<Button
									current
									invert={false}
									icon="pause_circle_filled"
									size="normal"
									color={primaryWhite}
									onClick={() => stopCurrentTaskTimer()}
								/>
								<RefreshSeconds>
									{() => (
										<TimerText>
											{moment
												.duration(
													moment().diff(
														lastWorkedTime.start,
													),
												)
												.add(previousTimesDiff)
												.format('HH:mm:ss')}
										</TimerText>
									)}
								</RefreshSeconds>
							</>
						) : (
							<Tooltip
								label={fbt(
									'Chronométrer',
									'time task item view header',
								)}
							>
								<Button
									current
									invert
									icon="play_circle_filled"
									size="normal"
									color={primaryWhite}
									onClick={() => {
										focusTask({
											variables: {itemId: item.id},
											optimisticResponse: {
												focusTask: {
													...item,
													scheduledFor: moment().format(
														moment.HTML5_FMT.DATE,
													),
													schedulePosition: -1,
													isFocused: true,
												},
											},
										});

										startTaskTimer({
											variables: {id: item.id},
										});
									}}
								/>
							</Tooltip>
						)}
					</Timer>
					<TaskActivationButton
						taskId={item.id}
						isActive={item.scheduledFor}
						onCommit={() => focusTask({
							variables: {itemId: item.id},
							optimisticResponse: {
								focusTask: {
									...item,
									scheduledFor: moment().format(
										moment.HTML5_FMT.DATE,
									),
									schedulePosition: -1,
									isFocused: true,
								},
							},
						})
						}
					/>
				</>
			)}
		</>
	);
}

export default TaskActivationHeader;
