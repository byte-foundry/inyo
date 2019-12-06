export default {
	getProjectInfos: ({mutation, query}) => {
		const addedItem = mutation.result.data.addItem;

		if (addedItem.section) {
			const sections = [...query.result.project.sections];

			if (sections.length > 0) {
				const index = sections.findIndex(
					section => section.id === addedItem.section.id
				);
				const cachedSection = sections[index];

				if (cachedSection) {
					sections.splice(index, 1, {
						...cachedSection,
						items: [addedItem, ...cachedSection.items]
					});

					return {
						...query.result,
						project: {
							...query.result.project,
							sections
						}
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
			const sections = [...query.result.project.sections];

			if (sections.length > 0) {
				const index = sections.findIndex(
					section => section.id === addedItem.section.id
				);
				const cachedSection = sections[index];

				if (cachedSection) {
					cachedSection.items = [addedItem, ...cachedSection.items];
					cachedSection.items = cachedSection.items.map(
						(item, index) => ({
							...item,
							position: index
						})
					);
					sections.splice(index, 1, {
						...cachedSection
					});

					return {
						...query.result,
						project: {
							...query.result.project,
							sections
						}
					};
				}

				return undefined;
			}

			return undefined;
		}

		return undefined;
	},
	getAllTasksShort: ({mutation, query}) => {
		let cachedItems = query.result.me.tasks;
		const addedItem = mutation.result.data.addItem;

		if (
			query.variables.schedule === 'TO_BE_RESCHEDULED' ||
			query.variables.schedule === 'FINISHED_TIME_IT_TOOK_NULL'
		)
			return query.result;

		if (addedItem.section) {
			cachedItems = cachedItems.map(item => {
				if (item.section && item.section.id === addedItem.section.id) {
					return {...item, position: item.position + 1};
				}

				return item;
			});
		}

		return {
			...query.result,
			me: {
				...query.result.me,
				tasks: [addedItem, ...cachedItems]
			}
		};
	},
	getAllTasks: ({mutation, query}) => {
		let cachedItems = query.result.me.tasks;
		const addedItem = mutation.result.data.addItem;

		if (
			query.variables.schedule === 'TO_BE_RESCHEDULED' ||
			query.variables.schedule === 'FINISHED_TIME_IT_TOOK_NULL'
		)
			return query.result;

		if (addedItem.section) {
			cachedItems = cachedItems.map(item => {
				if (item.section && item.section.id === addedItem.section.id) {
					return {...item, position: item.position + 1};
				}

				return item;
			});
		}

		return {
			...query.result,
			me: {
				...query.result.me,
				tasks: [addedItem, ...cachedItems]
			}
		};
	},
	getAllCustomers: ({mutation, query}) => {
		const {customers} = query.result.me;

		if (mutation.variables.linkedCustomer) {
			const addedCustomer = mutation.result.data.addItem.linkedCustomer;

			return {
				...query.result,
				me: {
					...query.result.me,
					customers: [addedCustomer, ...customers]
				}
			};
		}

		return undefined;
	}
};
