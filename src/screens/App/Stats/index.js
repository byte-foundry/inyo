import styled from '@emotion/styled/macro';
import React from 'react';
import {useQuery} from 'react-apollo-hooks';
import {withRouter} from 'react-router-dom';

import ArianneThread from '../../../components/ArianneThread';
import SingleBarChart from '../../../components/SingleBarChart';
import TasksProgressBar from '../../../components/TasksProgressBar';
import {BREAKPOINTS} from '../../../utils/constants';
import {
	Heading,
	mediumGrey,
	P,
	primaryBlack,
	primaryGrey,
	SubHeading,
} from '../../../utils/new/design-system';
import {GET_ALL_TASKS, GET_REMINDERS} from '../../../utils/queries';

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

const Cards = styled('div')`
	display: grid;
	grid-template-columns: repeat(3, 1fr);
	grid-column-gap: 20px;
`;

const Card = styled('div')`
	background-color: ${mediumGrey};
	padding: 20px;
`;

const Number = styled(P)`
	font-size: 3rem;
	font-weight: 500;
	color: ${primaryGrey};
	margin: 0;
`;

const Stats = ({history, location}) => {
	const {
		data: {
			me: {tasks},
		},
		error,
	} = useQuery(GET_ALL_TASKS, {suspend: true});

	const query = new URLSearchParams(location.search);

	const projectId = query.get('projectId');
	const tags = query.getAll('tags');
	const linkedCustomerId = query.get('customerId');

	if (error) throw error;

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
		task => (!linkedCustomerId
				|| ((task.linkedCustomer
					&& task.linkedCustomer.id === linkedCustomerId)
					|| (task.section
						&& task.section.project.customer
						&& task.section.project.customer.id
							=== linkedCustomerId)))
			&& (!task.section || projectId)
			&& (!projectId
				|| (task.section && task.section.project.id === projectId))
			&& tags.every(tag => task.tags.some(taskTag => taskTag.id === tag)),
	);

	const customers = {};

	let totalTime = 0;

	tasks.forEach((task) => {
		if (task.status !== 'FINISHED') return;

		const customer
			= task.linkedCustomer
			|| (task.section && task.section.project.customer);

		if (!customer) return;

		customers[customer.id] = customers[customer.id] || {
			value: 0,
			label: customer.name,
		};

		const time
			= typeof task.timeItTook === 'number' ? task.timeItTook : task.unit;

		customers[customer.id].value += time;
		totalTime += time;
	});

	const customerDistributions = Object.entries(customers).map(
		([key, obj]) => ({
			id: key,
			label: obj.label,
			value: (obj.value / totalTime) * 100,
		}),
	);

	const reminders = filteredTasks
		.filter(t => t.status === 'FINISHED')
		.map(task => task.reminders)
		.flat();

	return (
		<Container>
			<Heading>Statistiques</Heading>
			<SubHeading>Répartition de vos clients</SubHeading>
			<SingleBarChart entries={customerDistributions} />
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
			<Cards>
				<Card>
					<SubHeading>Temps travaillé</SubHeading>
					<Number>
						{filteredTasks
							.filter(t => t.status === 'FINISHED')
							.reduce(
								(total, {timeItTook}) => total + timeItTook,
								0,
							) * 24}
						h
					</Number>
				</Card>
				<Card>
					<SubHeading>Temps estimé</SubHeading>
					<Number>
						{filteredTasks
							.filter(t => t.status === 'FINISHED')
							.reduce((total, {unit}) => total + unit, 0) * 24}
						h
					</Number>
				</Card>
				<Card>
					<SubHeading>Rappels envoyés</SubHeading>
					<Number>
						{
							reminders.filter(
								reminder => reminder.status === 'SENT',
							).length
						}
					</Number>
				</Card>
			</Cards>
		</Container>
	);
};

export default withRouter(Stats);
