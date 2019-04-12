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
	ModalElem,
} from '../../../utils/content';
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
					<TasksList items={itemsToDo} baseUrl="dashboard" />
				</>
			) : (
				<NoTask>
					<NoTaskIllus>
						<img src={noTaskPlanned} />
					</NoTaskIllus>
					<NoTaskContent>
						<P>
							Vous n'avez pas de tâches prévues pour aujourd'hui.
							Pour en ajouter, ouvrez une tâche puis cliquez sur
							"Je fais cette tâche aujourd'hui" en haut de la
							fenêtre.
						</P>
						<P>
							Vous pouvez aussi déclencher l'éxécution d'une tâche
							client (icône rouge) en ouvrant celle-ci et en
							cliquant sur "Charger Edwige de faire réaliser cette
							tâche". Votre client sera alors notifié que vous
							attendez de lui la réalisation de cette tâche et
							sera relancé automatiquement si nécessaire.
						</P>
					</NoTaskContent>
				</NoTask>
			)}
			{itemsToDoLater.length > 0 && (
				<>
					<SectionTitle>Il vous reste du temps ?</SectionTitle>
					<TasksList items={itemsToDoLater} baseUrl="dashboard" />
				</>
			)}

			<Route
				path="/app/dashboard/:taskId"
				render={({match, history}) => (
					<Modal onDismiss={() => history.push('/app/dashboard')}>
						<ModalElem>
							<TaskView
								id={match.params.taskId}
								close={() => history.push('/app/dashboard')}
							/>
						</ModalElem>
					</Modal>
				)}
			/>
		</>
	);
};

export default withRouter(DashboardTasks);
