import produce from 'immer';

const getAllTaskMutation = ({mutation, query}) => {
	const removedProject = mutation.result.data.removeProject;
	const tasks = removedProject.sections.reduce(
		(acc, section) => acc.concat(section.items.map(item => item.id)),
		[],
	);

	return produce(query.result, (draft) => {
		// remove old
		draft.me.tasks = draft.me.tasks.filter(t => !tasks.includes(t.id));
	});
};

export default {
	getAllTasksShort: args => getAllTaskMutation(args),
	getAllTasks: args => getAllTaskMutation(args),
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
