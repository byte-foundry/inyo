import produce from 'immer';

export default {
	getProjectQuotes: ({mutation, query}) => {
		const {quoteHeader, quoteFooter} = mutation.result.data.updateProject;

		return produce(query.result, (draft) => {
			draft.project.quoteHeader = quoteHeader;
			draft.project.quoteFooter = quoteFooter;
		});
	},
	getAllTasksShort: ({mutation, query}) => {
		const cachedTasks = query.result.me.tasks;

		const addedCustomer = mutation.result.data.updateProject.customer;

		const tasks = cachedTasks.map((task) => {
			if (
				task.section
				&& task.section.project.id === mutation.variables.projectId
			) {
				return {
					...task,
					linkedCustomer: addedCustomer && {
						id: addedCustomer.id,
						name: addedCustomer.name,
					},
					section: {
						...task.section,
						project: {
							...task.section.project,
							customer: addedCustomer && {
								id: addedCustomer.id,
								name: addedCustomer.name,
							},
						},
					},
				};
			}

			return task;
		});

		return {
			...query.result,
			me: {
				...query.result.me,
				tasks,
			},
		};
	},
};
