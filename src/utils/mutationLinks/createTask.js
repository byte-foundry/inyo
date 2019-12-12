import reorderList from '../reorderList';

export default {
	getProjectData: ({mutation, query}) => {
		const addedItem = mutation.result.data.addItem;

		if (!addedItem.section) return null;

		const sections = [...query.result.project.sections];

		if (sections.length === 0) return null;

		const index = sections.findIndex(
			section => section.id === addedItem.section.id,
		);
		const cachedSection = sections[index];

		if (!cachedSection) return null;

		sections.splice(index, 1, {
			...cachedSection,
			items: reorderList(
				cachedSection.items,
				addedItem,
				null,
				addedItem.position,
				'position',
			),
		});

		return {
			...query.result,
			project: {
				...query.result.project,
				sections,
			},
		};
	},
	getProjectInfos: ({mutation, query}) => {
		const addedItem = mutation.result.data.addItem;

		if (!addedItem.section) return null;

		const sections = [...query.result.project.sections];

		if (sections.length === 0) return null;

		const index = sections.findIndex(
			section => section.id === addedItem.section.id,
		);
		const cachedSection = sections[index];

		if (!cachedSection) return null;

		sections.splice(index, 1, {
			...cachedSection,
			items: reorderList(
				cachedSection.items,
				addedItem,
				null,
				addedItem.position,
				'position',
			),
		});

		return {
			...query.result,
			project: {
				...query.result.project,
				sections,
			},
		};
	},
	getAllTasksShort: ({mutation, query}) => {
		let cachedItems = query.result.me.tasks;
		const addedItem = mutation.result.data.addItem;

		if (
			query.variables.schedule === 'TO_BE_RESCHEDULED'
			|| query.variables.schedule === 'FINISHED_TIME_IT_TOOK_NULL'
		) return query.result;

		if (addedItem.section) {
			cachedItems = cachedItems.map((item) => {
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
				tasks: [addedItem, ...cachedItems],
			},
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
					customers: [addedCustomer, ...customers],
				},
			};
		}

		return undefined;
	},
};
