import produce from 'immer';

import {isCustomerTask} from '../functions';

export default {
	getPaymentAndCurrentTask: ({mutation, query}) => {
		const {currentTask} = query.result.me;
		const finishedTask = mutation.result.data.finishItem;

		if (currentTask && currentTask.id === finishedTask.id) {
			return {
				...query.result,
				me: {
					...query.result.me,
					currentTask: null,
				},
			};
		}

		return query.result;
	},
	getAllTasksShort: ({mutation, query}) => {
		const task = mutation.result.data.finishItem;

		return produce(query.result, (draft) => {
			if (!isCustomerTask(task.type)) {
				if (query.variables.schedule === 'TO_BE_RESCHEDULED') {
					draft.me.tasks = draft.me.tasks.filter(
						t => t.id !== task.id,
					);
				}
				else if (
					query.variables.schedule === 'FINISHED_TIME_IT_TOOK_NULL'
				) {
					draft.me.tasks = draft.me.tasks.filter(
						t => t.id !== task.id,
					);

					if (
						task.status === 'FINISHED'
						&& task.timeItTook === null
					) {
						draft.me.tasks.push(task);
					}
				}
			}
		});
	},
	getSchedule: ({mutation, query}) => {
		const task = {...mutation.result.data.finishItem};

		return produce(query.result, (draft) => {
			const {schedule} = draft.me;

			if (!isCustomerTask(task.type)) return;

			schedule.forEach((scheduleDay) => {
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

				const scheduleLink = task.scheduledForDays.find(
					day => day.date === scheduleDay.date,
				);

				if (scheduleLink) {
					scheduleDay.tasks.splice(scheduleLink.position, 0, task);
					scheduleDay.tasks.forEach((t, i) => {
						t.schedulePosition = i;
					});
				}
			});
		});
	},
};
