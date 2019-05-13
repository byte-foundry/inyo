export default {
	getProjectInfos: ({mutation, query}) => {
		const addedItem = mutation.result.data.addItem;

		if (addedItem.section) {
			const cachedSections = [...query.result.project.sections];

			if (cachedSections.length > 0) {
				const cachedSection = cachedSections.find(
					section => section.id === addedItem.section.id,
				);

				if (cachedSection) {
					const cachedItems = cachedSection.items;

					cachedItems.unshift(addedItem);

					return {
						...query.result,
						project: {
							...query.result.project,
							sections: [...cachedSections],
						},
					};
				}

				return undefined;
			}

			return undefined;
		}

		return undefined;
	},
	getProjectData: ({mutation, query}) => {
		const addedItem = mutation.result.data.addItem;

		if (addedItem.section) {
			const cachedSections = [...query.result.project.sections];

			if (cachedSections.length > 0) {
				const cachedSection = cachedSections.find(
					section => section.id === addedItem.section.id,
				);

				if (cachedSection) {
					const cachedItems = cachedSection.items;

					cachedItems.unshift(addedItem);
					cachedSection.items = cachedItems;

					return {
						...query.result,
						project: {
							...query.result.project,
							sections: [...cachedSections],
						},
					};
				}

				return undefined;
			}

			return undefined;
		}

		return undefined;
	},
	getAllTasks: ({mutation, query}) => {
		const cachedItems = [...query.result.me.tasks];
		const addedItem = mutation.result.data.addItem;

		if (addedItem.section) {
			const updatePositionItems = cachedItems.filter(
				item => item.section && item.section.id === addedItem.section.id,
			);

			updatePositionItems.forEach((item) => {
				item.position += 1;
			});
		}

		cachedItems.unshift(addedItem);

		return {
			...query.result,
			me: {
				...query.result.me,
				tasks: cachedItems,
			},
		};
	},
	getAllCustomers: ({mutation, query}) => {
		const cachedCustomers = [...query.result.me.customers];

		if (mutation.variables.linkedCustomer) {
			const addedCustomer = mutation.result.data.addItem.linkedCustomer;

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
