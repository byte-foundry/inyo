import produce from 'immer';

export default {
	getProjectData: ({mutation, query}) => {
		const uploadedAttachments = mutation.result.data.uploadAttachments;
		const {taskId} = mutation.variables;
		const queryResult = query.result;

		return produce(queryResult, (draft) => {
			draft.project.sections.forEach((section) => {
				section.items.forEach((item) => {
					if (item.id === taskId) {
						item.attachments.push(...uploadedAttachments);
					}
				});
			});
		});
	},
	getItemDetails: ({mutation, query}) => {
		const cachedItem = query.result.item;
		const {attachments} = cachedItem;
		const uploadedAttachments = mutation.result.data.uploadAttachments;

		return {
			...query.result,
			item: {
				...cachedItem,
				attachments: [...attachments, ...uploadedAttachments],
			},
		};
	},
};
