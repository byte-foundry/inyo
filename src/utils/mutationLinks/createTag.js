export default {
	getAllTags: ({mutation, query}) => {
		const cachedTags = [...query.result.me.tags];
		const addedTag = mutation.result.data.createTag;

		if (!cachedTags.find(t => t.id === addedTag.id)) {
			cachedTags.push(addedTag);

			return {
				...query.result,
				me: {
					...query.result.me,
					tags: cachedTags,
				},
			};
		}
	},
	userInfosQuery: ({mutation, query}) => {
		const cachedTags = [...query.result.me.tags];
		const addedTag = mutation.result.data.createTag;

		if (!cachedTags.find(t => t.id === addedTag.id)) {
			cachedTags.push(addedTag);

			return {
				...query.result,
				me: {
					...query.result.me,
					tags: cachedTags,
				},
			};
		}
	},
};
