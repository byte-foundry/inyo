import React from 'react';
import styled from '@emotion/styled';
import {withRouter} from 'react-router-dom';

import 'react-toastify/dist/ReactToastify.css';
import Tasks from './tasks';
import CreateTask from '../../../components/CreateTask';

const Main = styled('div')`
	padding-bottom: 80px;
	min-width: 1280px;
	align-self: center;
`;

function Dashboard() {
	return (
		<Main>
			<CreateTask />
			<Tasks />
		</Main>
	);
}

export default withRouter(Dashboard);
