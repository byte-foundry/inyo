import styled from '@emotion/styled';
import React from 'react';
import {useQuery} from 'react-apollo-hooks';
import {withRouter} from 'react-router-dom';

import ArianneThread from '../../../components/ArianneThread';
import SingleBarChart from '../../../components/SingleBarChart';
import TasksProgressBar from '../../../components/TasksProgressBar';
import {BREAKPOINTS} from '../../../utils/constants';
import {Heading, SubHeading} from '../../../utils/new/design-system';
import {GET_ALL_TASKS} from '../../../utils/queries';

const Container = styled('div')`
	width: 980px;
	margin: 0 auto;
	min-height: 100vh;

	@media (max-width: ${BREAKPOINTS}px) {
		padding: 1rem;
		max-width: 980px;
		width: auto;
	}
`;

const Stats = ({history, location}) => {
	const {data, error} = useQuery(GET_ALL_TASKS, {suspend: true});
	const query = new URLSearchParams(location.search);

	const projectId = query.get('projectId');
	const tags = query.getAll('tags');
	const linkedCustomerId = query.get('customerId');

	if (error) throw error;

	const {tasks} = data.me;

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

		history.push(`/app/stats?${newQuery.toString()}`);
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

		history.push(`/app/stats?${newQuery.toString()}`);
	};

	const setTagSelected = (selected) => {
		const newQuery = new URLSearchParams(query);

		if (selected) {
			newQuery.delete('tags');
			selected.forEach(tag => newQuery.append('tags', tag.value));
		}

		history.push(`/app/stats?${newQuery.toString()}`);
	};

	const filteredTasks = tasks.filter(
		task => (!task.section || projectId)
			&& (!projectId
				|| (task.section && task.section.project.id === projectId))
			&& tags.every(tag => task.tags.some(taskTag => taskTag.id === tag)),
	);

	return (
		<Container>
			<Heading>Statistiques</Heading>
			<SubHeading>Répartition de vos clients</SubHeading>
			<SingleBarChart
				entries={[
					{label: 'Mon Client', value: 25},
					{label: 'Mon Autre Client', value: 35},
					{label: 'Le dernier', value: 40},
				]}
			/>
			<SubHeading>
				Rapport temps estimé / temps réellement passé
			</SubHeading>
			<ArianneThread
				projectId={projectId}
				linkedCustomerId={linkedCustomerId}
				selectCustomer={setCustomerSelected}
				selectProjects={setProjectSelected}
				selectTag={setTagSelected}
				tagsSelected={tags}
				marginTop
			/>
			<TasksProgressBar
				showCompletionPercentage={false}
				project={{
					sections: filteredTasks
						.filter(t => t.status === 'FINISHED')
						.map(t => ({items: t})),
				}}
			/>
		</Container>
	);
};

export default withRouter(Stats);
