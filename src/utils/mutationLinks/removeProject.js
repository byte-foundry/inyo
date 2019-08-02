export default {
	getAllProjects({mutation, query}) {
		const {me} = query.result;

		const removedProject = mutation.result.data.removeProject;
		const projects = me.projects.filter(
			project => project.id !== removedProject.id,
		);

		return {
			...query.result,
			me: {
				...me,
				projects,
			},
		};
	},
};
