export default {
	getUserCollaboratorsAndRequests: ({mutation, query}) => {
		const {requester} = mutation.result.data.acceptCollabRequest;

		return {
			...query.result,
			me: {
				...query.result.me,
				collaborators: [requester, ...query.result.me.collaborators],
			},
		};
	},
};
