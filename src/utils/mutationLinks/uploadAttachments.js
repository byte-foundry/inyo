export default {
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
