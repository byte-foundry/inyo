export default {
	getAllCustomers: ({mutation, query}) => {
		const cachedCustomers = [...query.result.me.customers];
		const addedCustomer = mutation.result.data.createCustomer;

		cachedCustomers.unshift(addedCustomer);

		return {
			...query.result,
			me: {
				...query.result.me,
				customers: cachedCustomers,
			},
		};
	},
};
