import React from 'react';

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
	return (
		<>
			<StickyHeader customer={item.type !== 'DEFAULT'}>
				Prévisualisation des actions{' '}
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
				customerName={item.linkedCustomer.name}
				initialScheduledFor={initialScheduledFor}
				onFocusTask={async ({reminders, scheduledFor}) => {
					await focusTask({
						variables: {
							itemId: item.id,
							reminders,
							for: scheduledFor,
						},
					});

					setIsActivating(false);
				}}
				onCancel={() => setIsActivating(false)}
			/>
		</>
	);
}

export default TaskActivationModal;
