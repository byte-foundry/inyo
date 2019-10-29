import styled from '@emotion/styled';
import React from 'react';
import {Route} from 'react-router-dom';

import TaskView from '../../../components/ItemView';
import Tooltip from '../../../components/Tooltip';
import fbt from '../../../fbt/fbt.macro';
import {useQuery} from '../../../utils/apollo-hooks';
import {BREAKPOINTS} from '../../../utils/constants';
import {ModalContainer as Modal, ModalElem} from '../../../utils/content';
import {formatFullName} from '../../../utils/functions';
import {
	A,
	mediumGrey,
	P,
	primaryBlack,
	primaryGrey,
	primaryRed,
	primaryWhite,
} from '../../../utils/new/design-system';
import {GET_CUSTOMER_INFOS} from '../../../utils/queries';
import CustomerTasks from './tasks';

const Container = styled('div')`
	min-height: 100vh;
	padding: 3rem;

	@media (max-width: ${BREAKPOINTS.mobile}px) {
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

	@media (max-width: ${BREAKPOINTS.mobile}px) {
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

	@media (max-width: ${BREAKPOINTS.mobile}px) {
		display: none;
	}
`;

const Tasks = ({location, match}) => {
	const {customerToken} = match.params;
	const {prevSearch} = location.state || {prevSearch: location.search};
	const query = new URLSearchParams(prevSearch || location.search);
	const projectId = query.get('projectId');
	const {data: customerInfosData, error} = useQuery(GET_CUSTOMER_INFOS, {
		variables: {token: customerToken},
		suspend: true,
	});

	if (error) throw error;

	let welcome = (
		<fbt project="inyo" desc="Hello">
			Bonjour
		</fbt>
	);

	if (customerInfosData && customerInfosData.customer) {
		const {customer: c} = customerInfosData;

		welcome += c
			? ` ${formatFullName(c.title, c.firstName, c.lastName)}`
			: '';
	}

	return (
		<Container>
			<WelcomeMessage>
				<div>
					{welcome},
					<br />
					<fbt project="inyo" desc="customer info about task">
						Les tâches <Red>rouges</Red> sont celles dont vous êtes
						responsable.
					</fbt>
				</div>
				<Tooltip
					label={
						<fbt project="inyo" desc="what's inyo about">
							À quoi sert cette plateforme ?
						</fbt>
					}
				>
					<A
						noHover
						target="_blank"
						href={fbt('https://inyo.pro', 'inyo pro link')}
					>
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
