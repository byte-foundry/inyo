export default {
	getAllProjects({mutation, query}) {
		const cachedMe = query.result.me;

		const removedProject = mutation.result.data.removeProject;
		const projects = cachedMe.projects.filter(
			project => project.id !== removedProject.id,
		);

		return {
			...query.result,
			me: {
				...cachedMe,
				projects,
			},
		};
	},
};
