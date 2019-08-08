export default {
	getAllCustomers: ({mutation, query}) => {
		const {customers} = query.result.me;

		if (mutation.variables.linkedCustomer) {
			const addedCustomer
				= mutation.result.data.updateItem.linkedCustomer;

			return {
				...query.result,
				me: {
					...query.result.me,
					customers: [addedCustomer, ...customers],
				},
			};
		}

		return undefined;
	},
};
