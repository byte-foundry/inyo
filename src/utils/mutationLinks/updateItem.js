import reorderList from '../reorderList';

export default {
	getProjectData({mutation, query}) {
		const {project} = query.result;
		const updatedItem = mutation.result.data.updateItem;

		const sectionItem = project.sections.find(s => s.items.some(i => i.id === updatedItem.id));

		// item has been detached from current project
		if (
			sectionItem
			&& (!updatedItem.section || updatedItem.section.id !== sectionItem.id)
		) {
			return {
				...query.result,
				project: {
					...project,
					sections: project.sections.map((section) => {
						if (section.id === sectionItem.id) {
							const index = sectionItem.items.findIndex(
								i => i.id === updatedItem.id,
							);

							return {
								...section,
								items: reorderList(
									section.items,
									updatedItem,
									index,
									null,
									'position',
								),
							};
						}

						return section;
					}),
				},
			};
		}
		// item will be attached to current project
		if (
			!sectionItem
			&& updatedItem.section
			&& updatedItem.section.project.id === project.id
		) {
			return {
				...query.result,
				project: {
					...project,
					sections: project.sections.map((section) => {
						if (section.id === updatedItem.section.id) {
							return {
								...section,
								items: reorderList(
									section.items,
									updatedItem,
									null,
									updatedItem.position,
									'position',
								),
							};
						}

						return section;
					}),
				},
			};
		}

		return null;
	},
	getProjectInfos({mutation, query}) {
		const {project} = query.result;
		const updatedItem = mutation.result.data.updateItem;

		const sectionItem = project.sections.find(s => s.items.some(i => i.id === updatedItem.id));

		// item was/is related to project
		if (
			sectionItem
			&& (!updatedItem.section || updatedItem.section.id !== sectionItem.id)
		) {
			return {
				...query.result,
				project: {
					...project,
					sections: project.sections.map((section) => {
						if (section.id === sectionItem.id) {
							const index = sectionItem.items.findIndex(
								i => i === updatedItem.id,
							);

							return {
								...section,
								items: reorderList(
									section.items,
									updatedItem,
									index,
									null,
									'position',
								),
							};
						}

						return section;
					}),
				},
			};
		}
		if (
			!sectionItem
			&& updatedItem.section
			&& updatedItem.section.project.id === project.id
		) {
			return {
				...query.result,
				project: {
					...project,
					sections: project.sections.map((section) => {
						if (section.id === updatedItem.section.id) {
							return {
								...section,
								items: reorderList(
									section.items,
									updatedItem,
									null,
									updatedItem.position,
									'position',
								),
							};
						}

						return section;
					}),
				},
			};
		}

		return null;
	},
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
