import React, {useState, useCallback} from 'react';
import Portal from '@reach/portal';
import {useQuery, useMutation} from 'react-apollo-hooks';
import {withRouter, Route} from 'react-router-dom';
import {useDrag} from 'react-dnd';
import moment from 'moment';

import Schedule from '../../../components/Schedule';
import TasksList from '../../../components/TasksList';
import Task from '../../../components/TasksList/task';
import TaskView from '../../../components/ItemView';
import ArianneThread from '../../../components/ArianneThread';
import LeftBarSchedule from '../../../components/LeftBarSchedule';

import {
	ModalContainer as Modal,
	ModalElem,
	Loading,
} from '../../../utils/content';
import {DRAG_TYPES} from '../../../utils/constants';
import {GET_ALL_TASKS, GET_USER_INFOS} from '../../../utils/queries';
import {FOCUS_TASK} from '../../../utils/mutations';

function DraggableTask({
	item,
	customerToken,
	baseUrl,
	setIsDragging = () => {},
}) {
	const [, drag] = useDrag({
		item: {
			id: item.id,
			type: DRAG_TYPES.TASK,
		},
		begin() {
			setIsDragging(true);
			return {
				id: item.id,
			};
		},
		end() {
			setIsDragging(false);
		},
	});

	return (
		<Task
			ref={drag}
			item={item}
			customerToken={customerToken}
			baseUrl={baseUrl}
		/>
	);
}

const DashboardTasks = ({location, history}) => {
	const {prevSearch} = location.state || {};
	const [isDragging, setIsDragging] = useState(false);
	const query = new URLSearchParams(prevSearch || location.search);

	const {data, loading, error} = useQuery(GET_ALL_TASKS, {suspend: true});
	const {
		data: userPrefsData,
		loading: loadingUserPrefs,
		error: errorUserPrefs,
	} = useQuery(GET_USER_INFOS, {suspend: true});
	const focusTask = useMutation(FOCUS_TASK);

	const onMoveTask = useCallback(({task, scheduledFor, position}) => {
		focusTask({
			variables: {
				itemId: task.id,
				for: scheduledFor,
				schedulePosition: position,
			},
			optimisticReponse: {
				focusTask: {
					itemId: task.id,
					for: scheduledFor,
					schedulePosition: position,
				},
			},
		});
	});

	const projectId = query.get('projectId');
	const filter = query.get('filter');
	const tags = query.getAll('tags');
	const linkedCustomerId = query.get('customerId');

	if (loading) return <Loading />;
	if (error) throw error;
	if (errorUserPrefs) throw errorUserPrefs;

	const {
		me: {tasks},
	} = data;

	let unscheduledTasks = [];
	const scheduledTasks = {};

	const setProjectSelected = (selected, removeCustomer) => {
		const newQuery = new URLSearchParams(query);

		if (selected) {
			const {value: selectedProjectId} = selected;

			newQuery.set('projectId', selectedProjectId);
		}
		else if (newQuery.has('projectId')) {
			newQuery.delete('projectId');
		}

		if (removeCustomer) {
			newQuery.delete('customerId');
		}

		history.push(`/app/dashboard?${newQuery.toString()}`);
	};

	const setCustomerSelected = (selected) => {
		const newQuery = new URLSearchParams(query);

		if (selected) {
			const {value: selectedCustomerId} = selected;

			newQuery.set('customerId', selectedCustomerId);
		}
		else if (newQuery.has('customerId')) {
			newQuery.delete('customerId');
		}

		if (newQuery.has('projectId')) {
			newQuery.delete('projectId');
		}

		history.push(`/app/dashboard?${newQuery.toString()}`);
	};

	const setFilterSelected = (selected) => {
		const newQuery = new URLSearchParams(query);

		if (selected) {
			const {value: selectedFilterId} = selected;

			newQuery.set('filter', selectedFilterId);
		}

		history.push(`/app/dashboard?${newQuery.toString()}`);
	};

	const setTagSelected = (selected) => {
		const newQuery = new URLSearchParams(query);

		if (selected) {
			newQuery.delete('tags');
			selected.forEach(tag => newQuery.append('tags', tag.value));
		}

		history.push(`/app/dashboard?${newQuery.toString()}`);
	};

	tasks.forEach((task) => {
		if (!task.scheduledFor) {
			if (!task.section || task.section.project.status === 'ONGOING') {
				unscheduledTasks.push(task);
			}

			return;
		}

		scheduledTasks[task.scheduledFor] = scheduledTasks[
			task.scheduledFor
		] || {
			date: task.scheduledFor,
			tasks: [],
		};

		scheduledTasks[task.scheduledFor].tasks.push(task);
	});

	unscheduledTasks = unscheduledTasks.filter(
		task => (!filter || task.status === filter || filter === 'ALL')
			&& (!task.section
				|| task.section.project.status === 'ONGOING'
				|| projectId)
			&& (!projectId
				|| (task.section && task.section.project.id === projectId))
			&& tags.every(tag => task.tags.some(taskTag => taskTag.id === tag)),
	);

	return (
		<>
			{loadingUserPrefs ? (
				<Loading />
			) : (
				<Schedule
					days={scheduledTasks}
					workingDays={userPrefsData.me.workingDays}
					fullWeek={userPrefsData.me.settings.hasFullWeekSchedule}
					onMoveTask={onMoveTask}
				/>
			)}

			<ArianneThread
				projectId={projectId}
				linkedCustomerId={linkedCustomerId}
				selectCustomer={setCustomerSelected}
				selectProjects={setProjectSelected}
				selectFilter={setFilterSelected}
				selectTag={setTagSelected}
				filterId={filter}
				tagsSelected={tags}
				marginTop
			/>
			<TasksList
				style={{minHeight: '50px'}}
				items={unscheduledTasks}
				baseUrl="dashboard"
				createTaskComponent={({item, index, customerToken}) => (
					<DraggableTask
						item={item}
						key={item.id}
						customerToken={customerToken}
						baseUrl="dashboard"
						setIsDragging={setIsDragging}
					/>
				)}
			/>
			<Route
				path="/app/dashboard/:taskId"
				render={({match, history, location: {state = {}}}) => (
					<Modal onDismiss={() => history.push('/app/dashboard')}>
						<ModalElem>
							<TaskView
								id={match.params.taskId}
								close={() => history.push('/app/dashboard')}
								isActivating={state.isActivating}
							/>
						</ModalElem>
					</Modal>
				)}
			/>
			<Portal>
				<LeftBarSchedule
					isDragging={isDragging}
					days={scheduledTasksPerDay}
					fullWeek={userPrefsData.me.settings.hasFullWeekSchedule}
					onMoveTask={onMoveTask}
				/>
			</Portal>
		</>
	);
};

export default withRouter(DashboardTasks);
