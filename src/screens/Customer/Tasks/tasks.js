import styled from '@emotion/styled';
import Tooltip from '@reach/tooltip';
import React, {Suspense, useContext} from 'react';

import CustomProjectHeader from '../../../components/CustomProjectHeader';
import ProjectCustomerTasksList from '../../../components/ProjectCustomerTasksList';
import ProjectDocumentsFolders from '../../../components/ProjectDocumentsFolders';
import ProjectSharedNotes from '../../../components/ProjectSharedNotes';
import SidebarCustomerProjectInfos from '../../../components/SidebarCustomerProjectInfos';
import TasksList from '../../../components/TasksList';
import fbt from '../../../fbt/fbt.macro';
import {useQuery} from '../../../utils/apollo-hooks';
import {BREAKPOINTS} from '../../../utils/constants';
import {Loading, primaryGrey} from '../../../utils/content';
import {CustomerContext} from '../../../utils/contexts';
import {formatFullName} from '../../../utils/functions';
import {
	A,
	mediumGrey,
	P,
	primaryBlack,
	primaryRed,
	primaryWhite,
} from '../../../utils/new/design-system';
import {GET_CUSTOMER_INFOS, GET_CUSTOMER_TASKS} from '../../../utils/queries';

const Container = styled('div')`
	display: flex;
	justify-content: center;
	flex: 1;
	max-width: 1280px;
	margin: 0 auto;

	@media (max-width: ${BREAKPOINTS.mobile}px) {
		flex-direction: column;
	}
`;

const TaskAndArianne = styled('div')`
	display: flex;
	flex-direction: column;
	flex: auto;
`;

const Main = styled('div')`
	display: flex;
	flex-direction: row;
	justify-content: space-between;

	@media (max-width: ${BREAKPOINTS.mobile}px) {
		flex-direction: column-reverse;
	}
`;

const WelcomeMessage = styled(P)`
	color: ${primaryGrey};
	max-width: 1280px;
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

const Help = styled('div')`
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

const CustomerTasks = ({
	css, style, projectId, location = {},
}) => {
	const customerToken = useContext(CustomerContext);
	const token = customerToken === 'preview' ? undefined : customerToken;
	const query = new URLSearchParams(location.search);
	const view = query.get('view');
	const {data, error} = useQuery(GET_CUSTOMER_TASKS, {
		variables: {
			token,
			projectId,
		},
		suspend: true,
	});
	const {data: customerInfosData} = useQuery(GET_CUSTOMER_INFOS, {
		variables: {token: customerToken},
		suspend: true,
		skip: !token,
	});

	if (error) throw error;

	const tasks = data.tasks.filter(t => t.type !== 'PERSONAL');

	// order by creation date
	tasks.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

	const tasksView = (projectId && (view === 'tasks' || !view)) || !projectId;

	let welcome = (
		<fbt project="inyo" desc="Hello">
			Bonjour
		</fbt>
	);

	if (token && customerInfosData && customerInfosData.customer) {
		const {customer: c} = customerInfosData;

		welcome += c
			? ` ${formatFullName(c.title, c.firstName, c.lastName)}`
			: '';
	}

	const message = (
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
					<Help customerToken={!!token}>?</Help>
				</A>
			</Tooltip>
		</WelcomeMessage>
	);

	if (projectId) {
		return (
			<>
				<CustomProjectHeader
					projectId={projectId}
					customerToken={customerToken}
				/>
				<Container css={css} style={style}>
					<TaskAndArianne>
						<Main>
							<SidebarCustomerProjectInfos
								projectId={projectId}
							/>
							{tasksView && (
								<div style={{flex: 1}}>
									{message}
									<ProjectCustomerTasksList
										projectId={projectId}
										items={tasks.filter(
											item => item.section
												&& item.section.project.id
													=== projectId,
										)}
									/>
								</div>
							)}
							<Suspense fallback={<Loading />}>
								{projectId && view === 'shared-notes' && (
									<ProjectSharedNotes
										projectId={projectId}
										customerToken={customerToken}
									/>
								)}
							</Suspense>
							<Suspense fallback={<Loading />}>
								{projectId && view === 'documents' && (
									<ProjectDocumentsFolders
										projectId={projectId}
										customerToken={customerToken}
									/>
								)}
							</Suspense>
						</Main>
					</TaskAndArianne>
				</Container>
			</>
		);
	}

	return (
		<Container css={css} style={style}>
			<TaskAndArianne>
				{message}
				{tasks.length ? (
					<TasksList items={tasks} customerToken={token} />
				) : (
					<P>
						<fbt desc="no tasks placeholder customer view">
							Il n'y pas ou plus de tâches associé à ce compte
							client.
						</fbt>
					</P>
				)}
			</TaskAndArianne>
		</Container>
	);
};

export default CustomerTasks;
