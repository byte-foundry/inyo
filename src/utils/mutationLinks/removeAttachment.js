export default {
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
