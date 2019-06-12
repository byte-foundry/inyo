import React from 'react';
import styled from '@emotion/styled';
import {Route} from 'react-router-dom';

import {ModalContainer as Modal, ModalElem} from '../../../utils/content';
import TaskView from '../../../components/ItemView';
import Tooltip from '../../../components/Tooltip';
import CustomerTasks from './tasks';

import {BREAKPOINTS} from '../../../utils/constants';
import {
	P,
	A,
	primaryGrey,
	primaryRed,
	mediumGrey,
	primaryBlack,
	primaryWhite,
} from '../../../utils/new/design-system';

const Container = styled('div')`
	min-height: 100vh;
	padding: 3rem;

	@media (max-width: ${BREAKPOINTS}px) {
		padding: 1rem;
	}
`;

const WelcomeMessage = styled(P)`
	color: ${primaryGrey};
	max-width: 1280px;
	margin-left: auto;
	margin-right: auto;
	margin-bottom: 3rem;

	display: flex;
	flex-direction: row;
	justify-content: space-between;

	@media (max-width: ${BREAKPOINTS}px) {
		flex-direction: column;
	}
`;

const Red = styled('span')`
	color: ${primaryRed};
`;

export const Help = styled('div')`
	width: 1.5rem;
	height: 1.5rem;
	border: 2px solid transparent;
	border-radius: 50%;
	background-color: ${mediumGrey};
	color: ${primaryBlack};
	line-height: 0;
	font-weight: 500;
	display: flex;
	align-items: center;
	justify-content: center;
	cursor: pointer;

	transition: all 300ms ease;

	&:hover {
		background-color: ${primaryBlack};
		color: ${primaryWhite};
	}

	@media (max-width: ${BREAKPOINTS}px) {
		display: none;
	}
`;

const Tasks = ({location, match}) => {
	const {customerToken} = match.params;
	const {prevSearch} = location.state || {prevSearch: location.search};
	const query = new URLSearchParams(prevSearch || location.search);
	const projectId = query.get('projectId');

	return (
		<Container>
			<WelcomeMessage>
				<div>
					Bonjour,
					<br />
					Les tâches <Red>rouges</Red> sont celles dont vous êtes
					responsable.
				</div>
				<Tooltip label="À quoi sert cette plateforme ?">
					<A noHover target="_blank" href="https://inyo.pro">
						<Help>?</Help>
					</A>
				</Tooltip>
			</WelcomeMessage>

			<CustomerTasks projectId={projectId} location={location} />

			<Route
				path="/app/:customerToken/tasks/:taskId"
				render={({
					location: {state = {}},
					history,
					match: {
						params: {taskId},
					},
				}) => (
					<Modal
						onDismiss={() => history.push(
							`/app/${customerToken}/tasks${state.prevSearch
									|| prevSearch
									|| ''}`,
						)
						}
					>
						<ModalElem>
							<TaskView
								id={taskId}
								customerToken={customerToken}
								close={() => history.push(
									`/app/${customerToken}/tasks${state.prevSearch
											|| ''}`,
								)
								}
							/>
						</ModalElem>
					</Modal>
				)}
			/>
		</Container>
	);
};

export default Tasks;
