import produce from 'immer';
import moment from 'moment';

import {isCustomerTask} from '../functions';

export default {
	getAllTasksShort: ({mutation, query}) => {
		const task = mutation.result.data.unfinishItem;

		return produce(query.result, (draft) => {
			if (!isCustomerTask(task.type)) {
				if (
					(query.variables.schedule === 'TO_BE_RESCHEDULED'
						&& (task.status !== 'FINISHED'
							&& task.scheduledFor
							&& moment(task.scheduledFor).isBefore(
								moment(),
								'day',
							)))
					|| task.scheduledForDays.some(
						d => moment(d.date).isBefore(moment(), 'day')
							&& d.status !== 'FINISHED',
					)
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
			const {
				task,
				result: {
					me: {schedule},
				},
			} = draft;

			// remove old
			schedule.forEach((d) => {
				const filteredTasks = d.tasks.filter(t => t.id !== task.id);

				if (filteredTasks.length !== d.tasks.length) {
					filteredTasks.forEach((t, i) => {
						const scheduledFor = t.scheduledForDays.find(
							day => day.date === d.date,
						);

						if (scheduledFor) {
							scheduledFor.position = i;
						}

						t.schedulePosition = i;
					});
				}

				d.tasks = filteredTasks;
			});
		});
	},
};
