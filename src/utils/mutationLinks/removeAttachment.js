import produce from 'immer';

export default {
	getProjectData: ({mutation, query}) => {
		const removedAttachment = mutation.result.data.removeFile;
		const queryResult = query.result;

		return produce(queryResult, (draft) => {
			draft.project.sections.forEach((section) => {
				section.items.forEach((item) => {
					const attachmentIndex = item.attachments.findIndex(
						attachment => attachment.id === removedAttachment.id,
					);

					if (attachmentIndex !== -1) {
						item.attachments.splice(attachmentIndex, 1);
					}
				});
			});
		});
	},
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
