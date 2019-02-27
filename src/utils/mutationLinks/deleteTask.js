export default {
	getAllTasks: ({mutation, query}) => {
		const cachedItems = query.result.me.tasks;
		const removedItem = mutation.result.data.removeItem;
		const removedItemIndex = cachedItems.findIndex(
			item => item.id === removedItem.id,
		);

		cachedItems.splice(removedItemIndex, 1);

		return {
			...query.result,
			me: {
				...query.result.me,
				tasks: cachedItems,
			},
		};
	},
};
