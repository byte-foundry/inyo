export default {
	getAllProjects: ({mutation, query}) => {
		const cachedProjects = [...query.result.me.projects];
		const addedProject = mutation.result.data.createProject;

		cachedProjects.unshift(addedProject);

		return {
			...query.result,
			me: {
				...query.result.me,
				projects: cachedProjects,
			},
		};
	},
	getAllTasks: ({mutation, query}) => {
		const cachedTasks = [...query.result.me.tasks];
		const addedTasks = mutation.result.data.createProject.sections
			.map(section => section.items)
			.flat();

		return {
			...query.result,
			me: {
				...query.result.me,
				tasks: [...cachedTasks, ...addedTasks],
			},
		};
	},
};
