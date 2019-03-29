import React from 'react';
import styled from '@emotion/styled';
import {withRouter} from 'react-router-dom';

import 'react-toastify/dist/ReactToastify.css';
import Tasks from './tasks';
import CreateTask from '../../../components/CreateTask';
import SidebarDashboardInfos from '../../../components/SidebarDashboardInfos';

import {Main, Container, Content} from '../../../utils/new/design-system';

function Dashboard() {
	return (
		<Container>
			<Main>
				<Content>
					<CreateTask />
					<Tasks />
				</Content>
				<SidebarDashboardInfos />
			</Main>
		</Container>
	);
}

export default withRouter(Dashboard);
