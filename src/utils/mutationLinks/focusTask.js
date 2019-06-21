export default {
	getReminders: ({mutation, query}) => {
		const cachedReminders = [...query.result.reminders];
		const newRemindersItem = mutation.result.data.focusTask.reminders.filter(
			reminder => reminder.status === 'PENDING',
		);

		const reminders = cachedReminders.map((reminder) => {
			const currentReminderIndex = newRemindersItem.findIndex(
				r => r.id === reminder.id,
			);

			if (currentReminderIndex > -1) {
				return newRemindersItem.splice(currentReminderIndex, 1)[0];
			}

			return reminder;
		});

		return {
			...query.result,
			reminders: reminders.concat(...newRemindersItem),
		};
	},
	getAllTasks: ({mutation, query}) => {
		const {focusTask: task} = mutation.result.data;
		const {tasks} = query.result.me;

		const outdatedTask = tasks.find(item => item.id === task.id);

		if (
			outdatedTask.schedulePosition === task.schedulePosition
			&& outdatedTask.scheduledFor === task.scheduledFor
		) {
			return {...query.result};
		}

		if (outdatedTask.scheduledFor !== task.scheduledFor) {
			const outdatedList = tasks.filter(
				item => item.scheduledFor === outdatedTask.scheduledFor
					&& item.id !== outdatedTask.id,
			);

			outdatedList.sort(
				(a, b) => a.schedulePosition - b.schedulePosition,
			);
			outdatedList.forEach((item, index) => {
				item.schedulePosition = index;
			});
		}

		const list = tasks.filter(
			item => item.scheduledFor === task.scheduledFor
				&& item.id !== outdatedTask.id,
		);

		list.sort((a, b) => a.schedulePosition - b.schedulePosition);
		list.forEach((item, index) => {
			item.schedulePosition
				= index >= task.schedulePosition ? index + 1 : index;
		});

		return {
			...query.result,
			me: {
				...query.result.me,
				tasks: tasks.map((item) => {
					if (outdatedTask.id === item.id) {
						return task;
					}
					return item;
				}),
			},
		};
	},
};
