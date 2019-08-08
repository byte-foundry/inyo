export default {
	getUsersInfos({mutation, query}) {
		const updatedUser = mutation.result.data.updateUser;

		return {
			...query.result,
			me: {
				...query.result.me,
				me: updatedUser,
			},
		};
	},
};
