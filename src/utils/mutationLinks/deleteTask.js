const getProject = ({mutation, query}) => {
	const cachedProject = query.result.project;
	const removedItem = mutation.result.data.removeItem;

	cachedProject.sections = cachedProject.sections.map(section => ({
		...section,
		items: section.items.filter(item => item.id !== removedItem.id),
	}));

	return {
		...query.result,
		project: cachedProject,
	};
};

export default {
	getAllTasks: ({mutation, query}) => {
		const cachedItems = [...query.result.me.tasks];
		const removedItem = mutation.result.data.removeItem;
		const removedItemIndex = cachedItems.findIndex(
			item => item.id === removedItem.id,
		);

		cachedItems.splice(removedItemIndex, 1);

		return {
			...query.result,
			me: {
				...query.result.me,
				tasks: cachedItems,
			},
		};
	},
	getProjectData: getProject,
	getProjectInfos: getProject,
};
