import produce from 'immer';

import {isCustomerTask} from '../functions';

export default {
	getAllTasksShort: ({mutation, query}) => {
		const task = mutation.result.data.finishItem;

		return produce(query.result, (draft) => {
			if (
				query.variables.schedule === 'TO_BE_RESCHEDULED'
				&& !isCustomerTask(task.type)
			) {
				draft.me.tasks = draft.me.tasks.filter(t => t.id !== task.id);
			}
		});
	},
	getSchedule: ({mutation, query}) => {
		const task = mutation.result.data.finishItem;

		return produce(query.result, (draft) => {
			if (task.scheduledFor && !isCustomerTask(task.type)) {
				const {schedule} = draft.me;

				const scheduleDay = schedule.find(
					d => d.date === task.scheduledFor,
				);

				// remove old
				const filteredTasks = scheduleDay.tasks.filter(
					t => t.id !== task.id,
				);

				if (filteredTasks.length !== scheduleDay.tasks.length) {
					filteredTasks.forEach((t, i) => {
						t.schedulePosition = i;
					});
				}

				scheduleDay.tasks = filteredTasks;

				// add new
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
