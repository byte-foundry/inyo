export default {
	getItemDetails: ({mutation, query}) => {
		const cachedItem = query.result.item;
		const attachments = [...cachedItem.attachments];

		attachments.push(...mutation.result.data.uploadAttachments);

		return {
			...query.result,
			item: {
				...cachedItem,
				attachments,
			},
		};
	},
};
