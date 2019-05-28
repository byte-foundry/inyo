import React from 'react';
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
							item.linkedCustomer && item.linkedCustomer.name
						}
						onCommit={() => {
							if (item.type === 'CONTENT_ACQUISITION') {
								focusTask({
									variables: {itemId: item.id},
								});
							}
							else {
								setIsActivating(true);
							}
						}}
					/>
				)) || (
					<div>
						Il manque un client a cette tâche pour qu'elle soit
						réalisable.
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
							item.linkedCustomer && item.linkedCustomer.name
						}
						onCommit={() => {
							if (item.type === 'CONTENT_ACQUISITION') {
								focusTask({
									variables: {itemId: item.id},
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
							Il manque une facture a cette tâche pour qu'elle
							soit réalisable. Joignez une facture à cette tâche.
						</div>
					))
					|| (!item.linkedCustomer && item.attachments.length > 0 && (
						<div>
							Il manque un client a cette tâche pour qu'elle soit
							réalisable.
						</div>
					))
					|| (!item.linkedCustomer && item.attachments.length === 0 && (
						<div>
							Il manque un client et une facture a cette tâche
							pour qu'elle soit réalisable.
						</div>
					)))}
			{!customerTask && activableTask && (
				<TaskActivationButton
					taskId={item.id}
					isActive={item.isFocused}
					onCommit={() => focusTask({
						variables: {itemId: item.id},
					})
					}
				/>
			)}
		</>
	);
}

export default TaskActivationHeader;
