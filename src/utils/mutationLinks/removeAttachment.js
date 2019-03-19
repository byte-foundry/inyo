export default {
	getItemDetails: ({mutation, query}) => {
		const cachedItem = query.result.item;
		const attachments = [...cachedItem.attachments];
		const removedAttachment = mutation.result.data.removeFile;
		const indexToRemove = attachments.findIndex(
			attachment => attachment.id === removedAttachment.id,
		);

		attachments.splice(indexToRemove, 1);

		return {
			...query.result,
			item: {
				...cachedItem,
				attachments,
			},
		};
	},
};
