import reorderList from '../reorderList';

export default {
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

		return {
			...query.result,
			project: {
				...project,
				sections: reorderList(
					project.sections,
					addedSection,
					null,
					addedSection.position,
					'position',
				),
			},
		};
	},
};
