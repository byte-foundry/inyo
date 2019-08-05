export default {
	getUserCollaboratorsAndRequests: ({mutation, query}) => {
		const {collaboratorRequests} = query.result.me;
		const addedRequestCollab = mutation.result.data.requestCollab;

		return {
			...query.result,
			me: {
				...query.result.me,
				collaboratorRequests: [
					addedRequestCollab,
					...collaboratorRequests,
				],
			},
		};
	},
};
