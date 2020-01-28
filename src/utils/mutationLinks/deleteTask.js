import produce from 'immer';

import reorderList from '../reorderList';

const getProject = ({mutation, query}) => {
	const {project} = query.result;
	const removedItem = mutation.result.data.removeItem;

	const sections = project.sections.map((section) => {
		const itemIndex = section.items.findIndex(i => i.id === removedItem.id);

		if (itemIndex > -1) {
			return {
				...section,
				items: reorderList(
					section.items,
					removedItem,
					itemIndex,
					null,
					'position',
				),
			};
		}

		return section;
	});

	return {
		...query.result,
		project: {
			...project,
			sections,
		},
	};
};

export default {
	getAllTasksShort: ({mutation, query}) => {
		const cachedItems = [...query.result.me.tasks];
		const removedItem = mutation.result.data.removeItem;
		const removedItemIndex = cachedItems.findIndex(
			item => item.id === removedItem.id,
		);

		cachedItems.splice(removedItemIndex, 1);

		return {
			...query.result,
			me: {
				...query.result.me,
				tasks: cachedItems,
			},
		};
	},
	getProjectData: getProject,
	getProjectInfos: getProject,
	getSchedule: ({mutation, query}) => {
		const taskId = mutation.variables.itemId;

		return produce(query.result, (draft) => {
			const {schedule} = draft.me;

			// remove old
			schedule.forEach((d) => {
				const filteredTasks = d.tasks.filter(t => t.id !== taskId);

				if (filteredTasks.length !== d.tasks.length) {
					filteredTasks.forEach((t, i) => {
						const scheduledFor = t.scheduledForDays.find(
							day => day.date === d.date,
						);

						if (scheduledFor) {
							scheduledFor.position = i;
						}

						t.schedulePosition = i;
					});
				}

				d.tasks = filteredTasks;
			});
		});
	},
};
