import moment from 'moment';
import {useQuery} from 'react-apollo-hooks';

import {isCustomerTask} from './functions';
import {GET_ALL_TASKS} from './queries';

const useScheduleData = () => {
	const {
		data: {
			me: {id, tasks},
		},
	} = useQuery(GET_ALL_TASKS, {suspend: true});

	const unscheduledTasks = [];
	const tasksToReschedule = [];
	const scheduledTasksPerDay = {};

	tasks.forEach((task) => {
		if (
			task.section
			&& task.section.project.deadline
			&& task.section.project.status === 'ONGOING'
		) {
			const {project} = task.section;

			const deadlineDate = moment(project.deadline).format(
				moment.HTML5_FMT.DATE,
			);

			scheduledTasksPerDay[deadlineDate] = scheduledTasksPerDay[
				deadlineDate
			] || {
				date: deadlineDate,
				tasks: [],
				reminders: [],
				deadlines: [],
				assignedTasks: [],
			};

			if (
				!scheduledTasksPerDay[deadlineDate].deadlines.find(
					d => d.project && d.project.id === project.id,
				)
			) {
				scheduledTasksPerDay[deadlineDate].deadlines.push({
					date: project.deadline,
					project,
				});
			}
		}

		if (
			task.dueDate
			&& (!task.section || task.dueDate !== task.section.project.deadline)
		) {
			const deadlineDate = moment(task.dueDate).format(
				moment.HTML5_FMT.DATE,
			);

			scheduledTasksPerDay[deadlineDate] = scheduledTasksPerDay[
				deadlineDate
			] || {
				date: deadlineDate,
				tasks: [],
				reminders: [],
				deadlines: [],
				assignedTasks: [],
			};

			scheduledTasksPerDay[deadlineDate].deadlines.push({
				date: task.dueDate,
				task,
			});
		}

		if (
			!task.scheduledFor
			&& task.status === 'FINISHED'
			&& moment(task.finishedAt).isBefore(moment(), 'day')
		) {
			const finishedAtDate = task.finishedAt.split('T')[0];

			scheduledTasksPerDay[finishedAtDate] = scheduledTasksPerDay[
				finishedAtDate
			] || {
				date: finishedAtDate,
				tasks: [],
				reminders: [],
				deadlines: [],
			};

			scheduledTasksPerDay[finishedAtDate].tasks.push(task);

			return;
		}

		if (
			!(
				task.owner.id === id
				&& task.assignee
				&& task.assignee.id !== id
			)
			&& !task.scheduledFor
		) {
			if (!task.section || task.section.project.status === 'ONGOING') {
				unscheduledTasks.push(task);
			}

			return;
		}

		if (isCustomerTask(task.type)) {
			const plannedReminders = task.reminders.filter(
				reminder => reminder.status === 'PENDING' || reminder.status === 'SENT',
			);

			plannedReminders.forEach((reminder) => {
				const reminderDate = moment(reminder.sendingDate).format(
					moment.HTML5_FMT.DATE,
				);

				scheduledTasksPerDay[reminderDate] = scheduledTasksPerDay[
					reminderDate
				] || {
					date: reminderDate,
					tasks: [],
					reminders: [],
					deadlines: [],
					assignedTasks: [],
				};

				scheduledTasksPerDay[reminderDate].reminders.push({
					...reminder,
					item: task,
				});
			});

			// we just want the reminders
			return;
		}

		if (
			task.owner.id === id
			&& task.assignee
			&& task.assignee.id !== id
			&& task.scheduledFor
		) {
			scheduledTasksPerDay[task.scheduledFor] = scheduledTasksPerDay[
				task.scheduledFor
			] || {
				date: task.scheduledFor,
				tasks: [],
				reminders: [],
				deadlines: [],
				assignedTasks: [],
			};

			scheduledTasksPerDay[task.scheduledFor].assignedTasks.push(task);

			return;
		}

		scheduledTasksPerDay[task.scheduledFor] = scheduledTasksPerDay[
			task.scheduledFor
		] || {
			date: task.scheduledFor,
			tasks: [],
			reminders: [],
			deadlines: [],
			assignedTasks: [],
		};

		scheduledTasksPerDay[task.scheduledFor].tasks.push(task);

		if (
			task.status === 'PENDING'
			&& !isCustomerTask(task.type)
			&& moment(task.scheduledFor).isBefore(moment(), 'day')
		) {
			tasksToReschedule.push(task);
		}
	});

	return {
		scheduledTasksPerDay,
		unscheduledTasks,
		tasksToReschedule,
	};
};

export default useScheduleData;
