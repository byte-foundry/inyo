export default {
	getAllCustomers: ({mutation, query}) => {
		const {me} = query.result;
		const customers = [...me.customers];
		const removedCustomer = mutation.result.data.removeCustomer;
		const indexToRemove = customers.findIndex(
			customer => customer.id === removedCustomer.id,
		);

		customers.splice(indexToRemove, 1);

		return {
			...query.result,
			me: {
				...me,
				customers,
			},
		};
	},
	getUserCustomers: ({mutation, query}) => {
		const {me} = query.result;
		const customers = [...me.customers];
		const removedCustomer = mutation.result.data.removeCustomer;
		const indexToRemove = customers.findIndex(
			customer => customer.id === removedCustomer.id,
		);

		customers.splice(indexToRemove, 1);

		return {
			...query.result,
			me: {
				...me,
				customers,
			},
		};
	},
};
