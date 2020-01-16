export default {
	getPaymentAndCurrentTask: ({query}) => ({
		...query.result,
		me: {
			...query.result.me,
			currentTask: null,
		},
	}),
};
