export default {
	getAllCustomers: ({mutation, query}) => {
		const addedCustomer = mutation.result.data.createCustomer;

		return {
			...query.result,
			me: {
				...query.result.me,
				customers: [addedCustomer, ...query.result.me.customers],
			},
		};
	},
	getUserCustomers: ({mutation, query}) => {
		const addedCustomer = mutation.result.data.createCustomer;

		return {
			...query.result,
			me: {
				...query.result.me,
				customers: [addedCustomer, ...query.result.me.customers],
			},
		};
	},
};
