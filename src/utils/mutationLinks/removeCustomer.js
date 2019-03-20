export default {
	getAllCustomers: ({mutation, query}) => {
		const cachedMe = query.result.me;
		const customers = [...cachedMe.customers];
		const removedCustomer = mutation.result.data.removeCustomer;
		const indexToRemove = customers.findIndex(
			customer => customer.id === removedCustomer.id,
		);

		customers.splice(indexToRemove, 1);

		return {
			...query.result,
			me: {
				...cachedMe,
				customers,
			},
		};
	},
	getUserCustomers: ({mutation, query}) => {
		const cachedMe = query.result.me;
		const customers = [...cachedMe.customers];
		const removedCustomer = mutation.result.data.removeCustomer;
		const indexToRemove = customers.findIndex(
			customer => customer.id === removedCustomer.id,
		);

		customers.splice(indexToRemove, 1);

		return {
			...query.result,
			me: {
				...cachedMe,
				customers,
			},
		};
	},
};
