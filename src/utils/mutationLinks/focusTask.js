export default {
	getReminders: ({mutation, query}) => {
		const cachedReminders = [...query.result.reminders];
		const newRemindersItem = mutation.result.data.focusTask.reminders.filter(
			reminder => reminder.status === 'PENDING',
		);

		cachedReminders.push(...newRemindersItem);

		return {
			...query.result,
			reminders: [...cachedReminders],
		};
	},
};
