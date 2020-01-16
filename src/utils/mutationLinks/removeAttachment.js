import produce from 'immer';

export default {
	getProjectData: ({mutation, query}) => {
		const removedAttachment = mutation.result.data.removeFile;
		const queryResult = query.result;

		return produce(queryResult, (draft) => {
			const attachmentIndexInProject = draft.project.attachments.findIndex(
				attachment => attachment.id === removedAttachment.id,
			);

			if (attachmentIndexInProject !== -1) {
				draft.project.attachments.splice(attachmentIndexInProject, 1);
			}

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
		const {attachments} = item.attachments;
		const removedAttachment = mutation.result.data.removeFile;

		if (!attachments.find(d => d.id === removedAttachment.id)) {
			return undefined;
		}

		return {
			...query.result,
			item: {
				...query.result.item,
				attachments: attachments.filter(
					f => f.id !== removedAttachment.id,
				),
			},
		};
	},
	userInfosQuery: ({mutation, query}) => {
		const {me} = query.result;
		const removedFile = mutation.result.data.removeFile;

		if (!me.company.documents.find(d => d.id === removedFile.id)) {
			return undefined;
		}

		return {
			...query.result,
			me: {
				...me,
				company: {
					...me.company,
					documents: me.company.documents.filter(
						d => d.id !== removedFile.id,
					),
				},
			},
		};
	},
};
