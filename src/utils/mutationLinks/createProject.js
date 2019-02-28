export default {
	getAllProjectsQuery: ({mutation, query}) => {
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
};
