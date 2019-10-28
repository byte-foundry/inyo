export default {
	getAllTasks({mutation, query}) {
		const {tasks} = query.result.me;
		const addedSection = mutation.result.data.addSection;

		return {
			...query.result,
			me: {
				...query.result.me,
				tasks: [...tasks, ...addedSection.items],
			},
		};
	},
	getAllTasksShort({mutation, query}) {
		const {tasks} = query.result.me;
		const addedSection = mutation.result.data.addSection;

		return {
			...query.result,
			me: {
				...query.result.me,
				tasks: [...tasks, ...addedSection.items],
			},
		};
	},
	getProjectData({mutation, query}) {
		const {project} = query.result;
		const addedSection = mutation.result.data.addSection;

		const sections = project.sections.map(section => ({
			...section,
			position: section.position + 1,
		}));

		return {
			...query.result,
			project: {
				...project,
				sections: [addedSection, ...sections],
			},
		};
	},
};
