export default {
	getUserCollaboratorsAndRequests: ({mutation, query}) => {
		const cachedCollaboratorRequests = [
			...query.result.me.collaboratorRequests,
		];
		const addedRequestCollab = mutation.result.data.requestCollab;

		cachedCollaboratorRequests.unshift(addedRequestCollab);

		return {
			...query.result,
			me: {
				...query.result.me,
				collaboratorRequests: cachedCollaboratorRequests,
			},
		};
	},
};
