import produce from 'immer';
import moment from 'moment';

import {isCustomerTask} from '../functions';

export default {
	getReminders: ({mutation, query}) => {
		const newRemindersItem = mutation.result.data.focusTask.reminders.filter(
			reminder => reminder.status === 'PENDING',
		);

		const reminders = query.result.reminders.map((reminder) => {
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
	getAllTasksShort: ({mutation, query}) => {
		const task = mutation.result.data.focusTask;

		return produce(query.result, (draft) => {
			// remove old
			draft.me.tasks = draft.me.tasks.filter(t => t.id !== task.id);

			// add to unscheduled
			if (
				query.variables.schedule === 'UNSCHEDULED'
				&& !task.scheduledFor
			) {
				draft.me.tasks.push(task);
			}

			// add to rescheduled
			if (
				query.variables.schedule === 'TO_BE_RESCHEDULED'
				&& task.status !== 'FINISHED'
				&& task.scheduledFor
				&& moment(task.scheduledFor).isBefore(moment(), 'day')
			) {
				draft.me.tasks.push(task);
			}
		});
	},
	getSchedule: ({mutation, query}) => {
		const task = {...mutation.result.data.focusTask};

		return produce(query.result, (draft) => {
			const {schedule} = draft.me;

			if (isCustomerTask(task.type)) {
				task.reminders
					.filter(reminder => reminder.status !== 'CANCELED')
					.forEach((reminder) => {
						const scheduleDay = schedule.find(
							d => d.date
								=== moment(reminder.sendingDate).format(
									'YYYY-MM-DD',
								),
						);

						if (scheduleDay) {
							scheduleDay.reminders.push(reminder);
						}
					});
			}
			else {
				// remove old
				schedule.forEach((d) => {
					const filteredTasks = d.tasks.filter(t => t.id !== task.id);

					if (filteredTasks.length !== d.tasks.length) {
						filteredTasks.forEach((t, i) => {
							t.schedulePosition = i;
						});
					}

					d.tasks = filteredTasks;
				});

				// add new
				const scheduleDay = schedule.find(
					d => d.date === task.scheduledFor,
				);

				if (scheduleDay) {
					scheduleDay.tasks.splice(task.schedulePosition, 0, task);
					scheduleDay.tasks.forEach((t, i) => {
						t.schedulePosition = i;
					});
				}
			}
		});
	},
};
