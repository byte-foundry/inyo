import moment from 'moment';
import React from 'react';

import {formatName} from '../../utils/functions';
import TaskActivationButton from '../TaskActivationButton';
import TaskCustomerActivationButton from '../TaskCustomerActivationButton';

function TaskActivationHeader({
	item,
	customerTask,
	focusTask,
	activableTask,
	setIsActivating,
}) {
	return (
		<>
			{customerTask
				&& activableTask
				&& item.type !== 'INVOICE'
				&& ((item.linkedCustomer && (
					<TaskCustomerActivationButton
						taskId={item.id}
						isActive={item.isFocused}
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
						isActive={item.isFocused}
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
				<TaskActivationButton
					taskId={item.id}
					isActive={item.isFocused}
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
			)}
		</>
	);
}

export default TaskActivationHeader;
