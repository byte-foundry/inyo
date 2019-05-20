import React from 'react';
import {Switch, Route, Redirect} from 'react-router-dom';
import styled from '@emotion/styled';

import Onboarding from './Onboarding';
import Dashboard from './Dashboard';
import Account from './Account';
import Tasks from './Tasks';
import Tags from './Tags';
import CustomerList from './Customers';
import Projects from './Projects';

import withHeader from '../../HOC/withHeader';

import {BREAKPOINTS} from '../../utils/constants';

const AppMain = styled('div')`
	display: flex;
	flex-direction: column;
	padding: 3rem;

	@media (max-width: ${BREAKPOINTS}px) {
		padding: 1rem;

		.__react_component_tooltip {
			display: none;
		}
	}
`;

function App() {
	return (
		<AppMain>
			<Switch>
				<Route
					path="/app/dashboard"
					component={withHeader(Dashboard)}
				/>
				<Route path="/app/account" component={withHeader(Account)} />
				<Route path="/app/tasks" component={withHeader(Tasks)} />
				<Route path="/app/tags" component={withHeader(Tags)} />
				<Route path="/app/projects" component={withHeader(Projects)} />
				<Route
					path="/app/customers"
					component={withHeader(CustomerList)}
				/>
				<Route path="/app/onboarding" component={Onboarding} />
				<Redirect to="/app/tasks" />
			</Switch>
		</AppMain>
	);
}

export default App;
