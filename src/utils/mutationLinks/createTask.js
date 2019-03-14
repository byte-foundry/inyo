export default {
	getProjectInfos: ({mutation, query}) => {
		const addedItem = mutation.result.data.addItem;

		if (addedItem.section) {
			const cachedSections = [...query.result.project.sections];
			const cachedItems = cachedSections.find(
				section => section.id === addedItem.section.id,
			).items;

			cachedItems.unshift(addedItem);

			return {
				...query.result,
				project: {
					...query.result.project,
					sections: [...cachedSections],
				},
			};
		}
	},
	getAllTasks: ({mutation, query}) => {
		const cachedItems = [...query.result.me.tasks];
		const addedItem = mutation.result.data.addItem;

		cachedItems.unshift(addedItem);

		return {
			...query.result,
			me: {
				...query.result.me,
				tasks: cachedItems,
			},
		};
	},
	getAllCustomers: ({mutation, query}) => {
		const cachedCustomers = [...query.result.me.customers];

		if (mutation.variables.linkedCustomer) {
			const addedCustomer = mutation.result.data.addItem.linkedCustomer;

			cachedCustomers.unshift(addedCustomer);

			return {
				...query.result,
				me: {
					...query.result.me,
					customers: cachedCustomers,
				},
			};
		}
	},
};
