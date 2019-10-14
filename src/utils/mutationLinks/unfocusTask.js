import produce from 'immer';

export default {
	getAllTasks: ({mutation, query}) => {
		const task = mutation.result.data.unfocusTask;
		const {tasks} = query.result.me;

		const outdatedTaskIndex = tasks.findIndex(item => item.id === task.id);

		// adding to unscheduled list
		if (query.variables.schedule === 'UNSCHEDULED') {
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

		// removing from unscheduled list
		if (query.variables.schedule === 'TO_BE_RESCHEDULED') {
			return {
				...query.result,
				me: {
					...query.result.me,
					tasks: tasks.filter(t => t.id !== task.id),
				},
			};
		}
	},
	getSchedule: ({mutation, query}) => {
		const task = mutation.result.data.unfocusTask;

		return produce(query.result, (draft) => {
			const {schedule} = draft.me;

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
		});
	},
};
