import produce from 'immer';

export default {
	getItemDetails: ({mutation, query}) => {
		const uploadedAttachments = mutation.result.data.uploadAttachments;
		const {taskId} = mutation.variables;

		if (taskId) {
			return produce(query.result, (draft) => {
				uploadedAttachments.forEach((attachment) => {
					if (
						!draft.item.attachments.find(
							a => attachment.id === a.id,
						)
					) {
						draft.item.attachments.push(attachment);
					}
				});
			});
		}
	},
	getProjectData: ({mutation, query}) => {
		const uploadedAttachments = mutation.result.data.uploadAttachments;
		const {taskId, projectId} = mutation.variables;
		const queryResult = query.result;

		if (taskId) {
			return produce(queryResult, (draft) => {
				draft.project.sections.forEach((section) => {
					section.items.forEach((item) => {
						uploadedAttachments.forEach((attachment) => {
							if (
								item.id === taskId
								&& !item.attachments.find(
									a => attachment.id === a.id,
								)
							) {
								item.attachments.push(attachment);
							}
						});
					});
				});
			});
		}
		if (projectId) {
			return produce(queryResult, (draft) => {
				uploadedAttachments.forEach((attachment) => {
					if (
						projectId === draft.project.id
						&& !draft.project.attachments.find(
							a => attachment.id === a.id,
						)
					) {
						draft.project.attachments.push(attachment);
					}
				});
			});
		}
	},
};
