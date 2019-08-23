import React, {useCallback} from 'react';

import fbt from '../../fbt/fbt.macro';
import {formatName, isCustomerTask} from '../../utils/functions';
import {StickyHeader} from '../../utils/new/design-system';
import Apostrophe from '../Apostrophe';
import TaskRemindersPreviewsList from '../TaskRemindersPreviewsList';

function TaskActivationModal({
	item,
	assistantName,
	initialScheduledFor,
	focusTask,
	setIsActivating,
}) {
	const onFocusTask = useCallback(
		async ({reminders, scheduledFor}) => {
			await focusTask({
				variables: {
					itemId: item.id,
					reminders,
					for: scheduledFor,
				},
			});

			setIsActivating(false);
		},
		[focusTask, item.id, setIsActivating],
	);

	return (
		<>
			<StickyHeader customer={isCustomerTask(item.type)}>
				<fbt project="inyo" desc="previsualize action">
					Prévisualisation des actions
				</fbt>{' '}
				<Apostrophe
					value={assistantName}
					withVowel="d'"
					withConsonant="de "
				/>
				{assistantName}
			</StickyHeader>
			<TaskRemindersPreviewsList
				taskId={item.id}
				remindersPreviews={item.remindersPreviews}
				customerName={
					item.linkedCustomer
					&& `${item.linkedCustomer.name} (${formatName(
						item.linkedCustomer.firstName,
						item.linkedCustomer.lastName,
					)})`
				}
				initialScheduledFor={initialScheduledFor}
				onFocusTask={onFocusTask}
				onCancel={() => setIsActivating(false)}
			/>
		</>
	);
}

export default TaskActivationModal;
