import produce from 'immer';

export default {
	getItemDetails: ({mutation, query}) => {
		const uploadedAttachments = mutation.result.data.uploadAttachments;

		return produce(query.result, (draft) => {
			uploadedAttachments.forEach((attachment) => {
				if (!draft.item.attachments.find(a => attachment.id === a.id)) {
					draft.item.attachments.push(attachment);
				}
			});
		});
	},
	getProjectData: ({mutation, query}) => {
		const uploadedAttachments = mutation.result.data.uploadAttachments;
		const {taskId} = mutation.variables;
		const queryResult = query.result;

		return produce(queryResult, (draft) => {
			draft.project.sections.forEach((section) => {
				section.items.forEach((item) => {
					uploadedAttachments.forEach((attachment) => {
						if (
							item.id === taskId
							&& !item.attachments.find(a => attachment.id === a.id)
						) {
							item.attachments.push(attachment);
						}
					});
				});
			});
		});
	},
};
