export default {
	getUserCollaboratorsAndRequests: ({mutation, query}) => {
		const cachedCollaborators = [...query.result.me.collaborators];
		const {requester} = mutation.result.data.acceptCollabRequest;

		cachedCollaborators.unshift(requester);

		return {
			...query.result,
			me: {
				...query.result.me,
				collaborators: cachedCollaborators,
			},
		};
	},
};
