export default {
	getAllTags: ({mutation, query}) => {
		const cachedTags = query.result.me.tags;
		const removedTag = mutation.result.data.removeTag;
		const tags = cachedTags.filter(tag => tag.id !== removedTag.id);

		return {
			...query.result,
			me: {
				...query.result.me,
				tags,
			},
		};
	},
	userInfosQuery: ({mutation, query}) => {
		const cachedTags = query.result.me.tags;
		const removedTag = mutation.result.data.removeTag;
		const tags = cachedTags.filter(tag => tag.id !== removedTag.id);

		return {
			...query.result,
			me: {
				...query.result.me,
				tags,
			},
		};
	},
	getAllTasksShort: ({mutation, query}) => {
		const cachedItems = query.result.me.tasks;
		const removedTag = mutation.result.data.removeTag;

		const newItems = cachedItems.map(item => ({
			...item,
			tags: item.tags.filter(tag => tag.id !== removedTag.id),
		}));

		return {
			...query.result,
			me: {
				...query.result.me,
				tasks: newItems,
			},
		};
	},
};
