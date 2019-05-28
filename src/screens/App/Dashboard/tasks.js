import React from 'react';
import {useQuery} from 'react-apollo-hooks';
import {withRouter, Route} from 'react-router-dom';
import styled from '@emotion/styled';

import TasksList from '../../../components/TasksList';
import TaskView from '../../../components/ItemView';
import noTaskPlanned from '../../../utils/images/bermuda-searching.svg';

import {
	P,
	H3,
	primaryBlue,
	ModalContainer as Modal,
} from '../../../utils/content';
import {BREAKPOINTS} from '../../../utils/constants';
import {A} from '../../../utils/new/design-system';
import {GET_ALL_TASKS} from '../../../utils/queries';

const SectionTitle = styled(H3)`
	color: ${primaryBlue};
	font-size: 22px;
	font-weight: 500;
	margin: 2em 0 0;
`;

const NoTask = styled('div')`
	display: flex;
	flex-direction: row;
	margin-top: 2rem;

	@media (max-width: ${BREAKPOINTS}px) {
		display: flex;
		flex-direction: column;
	}
`;

const NoTaskIllus = styled('div')`
	flex: 0 0 300px;
	margin-right: 3rem;
`;

const NoTaskContent = styled('div')``;

const DashboardTasks = () => {
	const {data, loading, error} = useQuery(GET_ALL_TASKS, {suspend: true});

	if (loading) return <p>Loading</p>;
	if (error) throw error;

	const {
		me: {tasks, endWorkAt},
	} = data;
	const now = new Date();
	const endWorkAtDate = new Date();

	endWorkAtDate.setUTCHours(
		endWorkAt ? endWorkAt.split(':')[0] : 19,
		endWorkAt ? endWorkAt.split(':')[1] : 30,
		0,
		0,
	);

	const itemsToDo = tasks.filter(task => task.isFocused);

	const itemsToDoLater = tasks.filter(
		task => !task.isFocused
			&& task.status === 'PENDING'
			&& (!task.section || task.section.project.status === 'ONGOING'),
	);

	return (
		<>
			{now > endWorkAtDate ? (
				<SectionTitle>Tâches à faire demain</SectionTitle>
			) : (
				<SectionTitle>Tâches à faire aujourd'hui</SectionTitle>
			)}
			{itemsToDo.length ? (
				<>
					<TasksList items={[...itemsToDo]} baseUrl="dashboard" />
				</>
			) : (
				<NoTask>
					<NoTaskIllus>
						<img src={noTaskPlanned} />
					</NoTaskIllus>
					<NoTaskContent>
						<P>
							Vous n'avez pas de tâches prévues pour aujourd'hui.
							Pour en ajouter, ouvrez une tâche puis cliquez sur{' '}
							<A
								target="_blank"
								href="https://inyo.me/documentation/les-principales-vues/vue-tache/activer-une-tache"
							>
								{' '}
								"Je fais cette tâche aujourd'hui"
							</A>{' '}
							en haut de la fenêtre.
						</P>
						<P>
							Vous pouvez aussi{' '}
							<A
								target="_blank"
								href="https://inyo.me/documentation/les-principales-vues/vue-tache/activer-une-tache"
							>
								activer une tâche client pour que celui-ci soit
								notifié et qu'il la réalise.
							</A>
						</P>
					</NoTaskContent>
				</NoTask>
			)}
			{itemsToDoLater.length > 0 && (
				<>
					<SectionTitle>Il vous reste du temps ?</SectionTitle>
					<TasksList
						items={[...itemsToDoLater]}
						baseUrl="dashboard"
					/>
				</>
			)}

			<Route
				path="/app/dashboard/:taskId"
				render={({match, history}) => (
					<Modal onDismiss={() => history.push('/app/dashboard')}>
						<TaskView
							id={match.params.taskId}
							close={() => history.push('/app/dashboard')}
						/>
					</Modal>
				)}
			/>
		</>
	);
};

export default withRouter(DashboardTasks);
