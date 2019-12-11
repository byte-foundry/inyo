import reorderList from '../reorderList';

const getProject = ({mutation, query}) => {
	const {project} = query.result;
	const removedSection = mutation.result.data.removeSection;

	const sectionPosition = project.sections.findIndex(
		section => section.id === removedSection.id,
	);

	if (sectionPosition < 0) return null;

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
};

const getAllTasks = ({mutation, query}) => {
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
};

export default {
	getProjectData: getProject,
	getProjectInfos: getProject,
	getAllTasksShort: getAllTasks,
	getAllTasksStats: getAllTasks,
};
