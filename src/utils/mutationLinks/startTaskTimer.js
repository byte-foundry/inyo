export default {
	getPaymentAndCurrentTask: ({mutation, query}) => ({
		...query.result,
		me: {
			...query.result.me,
			currentTask: mutation.result.data.startTaskTimer,
		},
	}),
};
