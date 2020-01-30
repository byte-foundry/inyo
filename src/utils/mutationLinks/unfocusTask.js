import produce from 'immer';

export default {
	getAllTasksShort: ({mutation, query}) => {
		const task = mutation.result.data.unfocusTask;
		const {tasks} = query.result.me;

		const outdatedTaskIndex = tasks.findIndex(item => item.id === task.id);

		// adding to unscheduled list
		if (
			task.scheduledForDays.length === 0
			&& query.variables.schedule === 'UNSCHEDULED'
		) {
			return {
				...query.result,
				me: {
					...query.result.me,
					tasks:
						outdatedTaskIndex >= 0
							? tasks.splice(outdatedTaskIndex, 1, task)
							: [task, ...tasks],
				},
			};
		}

		// removing from to be rescheduled list
		if (
			task.scheduledForDays.length === 0
			&& query.variables.schedule === 'TO_BE_RESCHEDULED'
		) {
			return {
				...query.result,
				me: {
					...query.result.me,
					tasks: tasks.filter(t => t.id !== task.id),
				},
			};
		}

		if (
			query.variables.schedule === 'FINISHED_TIME_IT_TOOK_NULL'
			&& task.status === 'FINISHED'
			&& task.timeItTook === null
		) {
			if (tasks.findIndex(t => t.id === task.id) !== -1) {
				return query.result;
			}

			return {
				...query.result,
				me: {
					...query.result.me,
					tasks: [...tasks, task],
				},
			};
		}
	},
	getSchedule: ({mutation, query}) => {
		const task = mutation.result.data.unfocusTask;
		const {from} = mutation.variables;

		return produce(query.result, (draft) => {
			const {schedule} = draft.me;

			// remove old
			schedule.forEach((d) => {
				if (from && from !== d.date) return;

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
