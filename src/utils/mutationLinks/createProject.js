export default {
	getAllProjects: ({mutation, query}) => {
		const addedProject = mutation.result.data.createProject;

		return {
			...query.result,
			me: {
				...query.result.me,
				projects: [addedProject, ...query.result.me.projects],
			},
		};
	},
	getAllTasks: ({mutation, query}) => {
		const {tasks} = query.result.me;
		const addedTasks = mutation.result.data.createProject.sections
			.map(section => section.items)
			.flat();

		return {
			...query.result,
			me: {
				...query.result.me,
				tasks: [...tasks, ...addedTasks],
			},
		};
	},
};
