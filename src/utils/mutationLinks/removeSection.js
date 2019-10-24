export default {
	getProjectInfos({mutation, query}) {
		const {project} = query.result;

		const removedSection = mutation.result.data.removeSection;
		const sections = project.sections.filter(
			section => section.id !== removedSection.id,
		);

		return {
			...query.result,
			project: {
				...project,
				sections,
			},
		};
	},
	getProjectData({mutation, query}) {
		const {project} = query.result;

		const removedSection = mutation.result.data.removeSection;
		const sections = project.sections.filter(
			section => section.id !== removedSection.id,
		);

		return {
			...query.result,
			project: {
				...project,
				sections,
			},
		};
	},
	getAllTasksShort({mutation, query}) {
		const {me} = query.result;

		const removedSection = mutation.result.data.removeSection;
		const tasks = me.tasks.filter(
			task => !task.section || task.section.id !== removedSection.id,
		);

		return {
			...query.result,
			me: {
				...me,
				tasks,
			},
		};
	},
	getAllTasks({mutation, query}) {
		const {me} = query.result;

		const removedSection = mutation.result.data.removeSection;
		const tasks = me.tasks.filter(
			task => !task.section || task.section.id !== removedSection.id,
		);

		return {
			...query.result,
			me: {
				...me,
				tasks,
			},
		};
	},
};
