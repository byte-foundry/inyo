export default {
	getProjectInfos({mutation, query}) {
		const cachedProject = query.result.project;

		const removedSection = mutation.result.data.removeSection;
		const sections = cachedProject.sections.filter(
			section => section.id !== removedSection.id,
		);

		return {
			...query.result,
			project: {
				...cachedProject,
				sections,
			},
		};
	},
	getProjectData({mutation, query}) {
		const cachedProject = query.result.project;

		const removedSection = mutation.result.data.removeSection;
		const sections = cachedProject.sections.filter(
			section => section.id !== removedSection.id,
		);

		return {
			...query.result,
			project: {
				...cachedProject,
				sections,
			},
		};
	},
	getAllTasks({mutation, query}) {
		const cachedMe = query.result.me;

		const removedSection = mutation.result.data.removeSection;
		const tasks = cachedMe.tasks.filter(
			task => !task.section || task.section.id !== removedSection.id,
		);

		console.log(cachedMe.tasks, tasks);

		return {
			...query.result,
			me: {
				...cachedMe,
				tasks,
			},
		};
	},
};
