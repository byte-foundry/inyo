export default {
	getItemDetails: ({mutation, query}) => {
		const {item} = query.result;
		const attachments = [...item.attachments];
		const removedAttachment = mutation.result.data.removeFile;
		const indexToRemove = attachments.findIndex(
			attachment => attachment.id === removedAttachment.id,
		);

		attachments.splice(indexToRemove, 1);

		return {
			...query.result,
			item: {
				...query.result.item,
				attachments,
			},
		};
	},
};
