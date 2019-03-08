import React from 'react';
import {useQuery} from 'react-apollo-hooks';
import ReactTooltip from 'react-tooltip';
import styled from '@emotion/styled';

import {GET_CUSTOMER_TASKS} from '../../../utils/queries';
import {TOOLTIP_DELAY} from '../../../utils/constants';
import ProjectCustomerTasksList from '../../../components/ProjectCustomerTasksList';
import TasksList from '../../../components/TasksList';
import SidebarCustomerProjectInfos from '../../../components/SidebarCustomerProjectInfos';

const Container = styled('div')`
	display: flex;
	justify-content: center;
	flex: 1;
`;

const CustomerTasks = ({
	css, style, customerToken, projectId,
}) => {
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
				<ProjectCustomerTasksList
					customerToken={token}
					projectId={projectId}
					items={tasks.filter(
						item => item.section
							&& item.section.project.id === projectId,
					)}
				/>
				<SidebarCustomerProjectInfos
					projectId={projectId}
					customerToken={token}
				/>
				<ReactTooltip effect="solid" delayShow={TOOLTIP_DELAY} />
			</Container>
		);
	}

	return (
		<Container css={css} style={style}>
			<TasksList items={tasks} customerToken={token} />
			<ReactTooltip effect="solid" delayShow={TOOLTIP_DELAY} />
		</Container>
	);
};

export default CustomerTasks;
