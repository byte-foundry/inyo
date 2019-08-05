export default {
	getAllTags: ({mutation, query}) => {
		const {tags} = query.result.me;
		const addedTag = mutation.result.data.createTag;

		if (!tags.find(t => t.id === addedTag.id)) {
			return {
				...query.result,
				me: {
					...query.result.me,
					tags: [...tags, addedTag],
				},
			};
		}
	},
	userInfosQuery: ({mutation, query}) => {
		const {tags} = query.result.me;
		const addedTag = mutation.result.data.createTag;

		if (!tags.find(t => t.id === addedTag.id)) {
			return {
				...query.result,
				me: {
					...query.result.me,
					tags: [...tags, addedTag],
				},
			};
		}
	},
};
