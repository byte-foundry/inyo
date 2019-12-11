import reorderList from '../reorderList';

export default {
	getProjectInfos({mutation, query}) {
		const {project} = query.result;
		const removedSection = mutation.result.data.removeSection;

		const sectionPosition = project.sections.findIndex(
			section => section.id === removedSection.id,
		);

		return {
			...query.result,
			project: {
				...project,
				sections: reorderList(
					project.sections,
					removedSection,
					sectionPosition,
					null,
					'position',
				),
			},
		};
	},
	getProjectData({mutation, query}) {
		const {project} = query.result;
		const removedSection = mutation.result.data.removeSection;

		const sectionPosition = project.sections.findIndex(
			section => section.id === removedSection.id,
		);

		return {
			...query.result,
			project: {
				...project,
				sections: reorderList(
					project.sections,
					removedSection,
					sectionPosition,
					null,
					'position',
				),
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
};
