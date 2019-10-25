import produce from 'immer';

import {isCustomerTask} from '../functions';

export default {
	getAllTasksShort: ({mutation, query}) => {
		const task = mutation.result.data.unfinishItem;

		return produce(query.result, (draft) => {
			if (!isCustomerTask(task.type)) {
				if (
					query.variables.schedule === 'TO_BE_RESCHEDULED'
					&& task.scheduledFor
				) {
					draft.me.tasks = draft.me.tasks.filter(
						t => t.id !== task.id,
					);

					draft.me.tasks.push(task);
				}
				else if (
					query.variables.schedule === 'FINISHED_TIME_IT_TOOK_NULL'
				) {
					draft.me.tasks = draft.me.tasks.filter(
						t => t.id !== task.id,
					);
				}
			}
		});
	},
	getSchedule: ({mutation, query}) => {
		const task = {...mutation.result.data.unfinishItem};

		return produce({task, result: query.result}, (draft) => {
			if (task.scheduledFor) {
				const {
					task,
					result: {
						me: {schedule},
					},
				} = draft;

				const scheduleDay = schedule.find(
					d => d.date === task.scheduledFor,
				);

				if (scheduleDay) {
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
				}
			}
		});
	},
};
