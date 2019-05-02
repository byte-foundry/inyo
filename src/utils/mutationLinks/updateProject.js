export default {
	getAllTasks: ({mutation, query}) => {
		const cachedTasks = [...query.result.me.tasks];

		const addedCustomer = mutation.result.data.updateProject.customer;

		const newItems = cachedTasks.map((task) => {
			if (
				task.section
				&& task.section.project.id === mutation.variables.projectId
			) {
				return {
					...task,
					linkedCustomer: addedCustomer && {
						id: addedCustomer.id,
						name: addedCustomer.name,
						__typename: 'Customer',
					},
					section: {
						...task.section,
						project: {
							...task.section.project,
							customer: addedCustomer && {
								id: addedCustomer.id,
								name: addedCustomer.name,
								__typename: 'Customer',
							},
						},
					},
				};
			}

			return {...task};
		});

		return {
			...query.result,
			me: {
				...query.result.me,
				tasks: newItems,
			},
		};
	},
};