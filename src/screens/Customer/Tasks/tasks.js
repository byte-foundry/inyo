import React, {useContext} from 'react';
import {useQuery} from 'react-apollo-hooks';
import styled from '@emotion/styled';
import ReactTooltip from 'react-tooltip';

import {GET_CUSTOMER_TASKS} from '../../../utils/queries';
import {TOOLTIP_DELAY, BREAKPOINTS} from '../../../utils/constants';
import {CustomerContext} from '../../../utils/contexts';

import ProjectCustomerTasksList from '../../../components/ProjectCustomerTasksList';
import ProjectHeader from '../../../components/ProjectHeader';
import TasksList from '../../../components/TasksList';
import SidebarCustomerProjectInfos from '../../../components/SidebarCustomerProjectInfos';

const Container = styled('div')`
	display: flex;
	justify-content: center;

	@media (max-width: ${BREAKPOINTS}px) {
		flex-direction: column;
	}
`;

const TaskAndArianne = styled('div')`
	display: flex;
	flex-direction: row;

	@media (max-width: ${BREAKPOINTS}px) {
		flex-direction: column-reverse;
	}
`;

const Main = styled('div')`
	display: flex;
	flex-direction: row;
	justify-content: space-between;

	@media (max-width: ${BREAKPOINTS}px) {
		flex-direction: column-reverse;
	}
`;

const CustomerTasks = ({css, style, projectId}) => {
	const customerToken = useContext(CustomerContext);
	const token = customerToken === 'preview' ? undefined : customerToken;

	const {data, error} = useQuery(GET_CUSTOMER_TASKS, {
		variables: {
			token,
		},
	});

	if (error) throw error;

	const {tasks} = data;

	// order by creation date
	tasks.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

	if (projectId) {
		return (
			<Container css={css} style={style}>
				<TaskAndArianne>
					<ProjectHeader
						projectId={projectId}
						customerToken={customerToken}
					/>
					<Main>
						<SidebarCustomerProjectInfos projectId={projectId} />
						<ProjectCustomerTasksList
							projectId={projectId}
							items={tasks.filter(
								item => item.section
									&& item.section.project.id === projectId,
							)}
						/>
					</Main>
				</TaskAndArianne>
				<ReactTooltip effect="solid" delayShow={TOOLTIP_DELAY} />
			</Container>
		);
	}

	return (
		<Container css={css} style={style}>
			<TaskAndArianne>
				<TasksList items={tasks} customerToken={token} />
				<ReactTooltip effect="solid" delayShow={TOOLTIP_DELAY} />
			</TaskAndArianne>
		</Container>
	);
};

export default CustomerTasks;
