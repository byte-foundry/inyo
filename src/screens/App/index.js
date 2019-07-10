import styled from '@emotion/styled';
import React from 'react';
import {Redirect, Route, Switch} from 'react-router-dom';

import TrialHeadband from '../../components/TrialHeadband';
import withHeader from '../../HOC/withHeader';
import {BREAKPOINTS} from '../../utils/constants';

const Account = React.lazy(() => import('./Account'));
const CustomerList = React.lazy(() => import('./Customers'));
const Dashboard = React.lazy(() => import('./Dashboard'));
const Onboarding = React.lazy(() => import('./Onboarding'));
const Projects = React.lazy(() => import('./Projects'));
const Stats = React.lazy(() => import('./Stats'));
const Tags = React.lazy(() => import('./Tags'));
const Tasks = React.lazy(() => import('./Tasks'));

const AppMain = styled('div')`
	display: flex;
	flex-direction: column;
	padding: 3rem;

	@media (max-width: ${BREAKPOINTS}px) {
		padding: 1rem;
	}
`;

function App() {
	return (
		<>
			<TrialHeadband />
			<AppMain>
				<Switch>
					<Route
						path="/app/dashboard"
						component={withHeader(Dashboard)}
					/>
					<Route
						path="/app/account"
						component={withHeader(Account)}
					/>
					<Route path="/app/tasks" component={withHeader(Tasks)} />
					<Route path="/app/tags" component={withHeader(Tags)} />
					<Route
						path="/app/projects"
						component={withHeader(Projects)}
					/>
					<Route
						path="/app/customers"
						component={withHeader(CustomerList)}
					/>
					<Route path="/app/stats" component={withHeader(Stats)} />
					<Route path="/app/onboarding" component={Onboarding} />
					<Redirect to="/app/dashboard" />
				</Switch>
			</AppMain>
		</>
	);
}

export default App;
