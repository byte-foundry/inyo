export default {
	getAllTags: ({mutation, query}) => {
		const cachedTags = [...query.result.me.tags];
		const addedTag = mutation.result.data.createTag;

		cachedTags.push(addedTag);

		return {
			...query.result,
			me: {
				...query.result.me,
				tags: cachedTags,
			},
		};
	},
	userInfosQuery: ({mutation, query}) => {
		const cachedTags = [...query.result.me.tags];
		const addedTag = mutation.result.data.createTag;

		cachedTags.push(addedTag);

		return {
			...query.result,
			me: {
				...query.result.me,
				tags: cachedTags,
			},
		};
	},
};
