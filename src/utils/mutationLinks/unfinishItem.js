import produce from 'immer';

export default {
	getAllTasksShort: ({mutation, query}) => {
		const task = mutation.result.data.unfinishItem;

		return produce(query.result, (draft) => {
			if (
				query.variables.schedule === 'TO_BE_RESCHEDULED'
				&& task.scheduledFor
			) {
				draft.me.tasks.push(task);
			}
		});
	},
	getSchedule: ({mutation, query}) => {
		const task = mutation.result.data.unfinishItem;

		return produce(query.result, (draft) => {
			if (task.scheduledFor) {
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
			}
		});
	},
};
