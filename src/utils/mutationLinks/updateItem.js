export default {
	getAllCustomers: ({mutation, query}) => {
		const cachedCustomers = [...query.result.me.customers];

		if (mutation.variables.linkedCustomer) {
			const addedCustomer
				= mutation.result.data.updateItem.linkedCustomer;

			cachedCustomers.unshift(addedCustomer);

			return {
				...query.result,
				me: {
					...query.result.me,
					customers: cachedCustomers,
				},
			};
		}

		return undefined;
	},
};
