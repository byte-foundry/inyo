export default {
	getAllTasks: ({mutation, query}) => {
		const cachedItems = query.result.me.tasks;
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
};
