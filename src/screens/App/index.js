import styled from '@emotion/styled';
import React from 'react';
import {Redirect, Route, Switch} from 'react-router-dom';

import TrialHeadband from '../../components/TrialHeadband';
import withHeader from '../../HOC/withHeader';
import {BREAKPOINTS} from '../../utils/constants';

const Account = React.lazy(() => import('./Account'));
const CustomerList = React.lazy(() => import('./Customers'));
const CollaboratorList = React.lazy(() => import('./Collaborators'));
const CustomizeEmail = React.lazy(() => import('./CustomizeEmail'));
const Dashboard = React.lazy(() => import('./Dashboard'));
const Onboarding = React.lazy(() => import('./Onboarding'));
const Projects = React.lazy(() => import('./Projects'));
const Stats = React.lazy(() => import('./Stats'));
const Tags = React.lazy(() => import('./Tags'));
const Tasks = React.lazy(() => import('./Tasks'));

const AppMain = styled('div')`
	display: flex;
	flex-direction: row;

	@media (max-width: ${BREAKPOINTS.mobile}px) {
		padding: 1rem;
		flex-direction: column;
	}
`;

function App({history}) {
	return (
		<>
			<TrialHeadband history={history} />
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
						path="/app/collaborators"
						component={withHeader(CollaboratorList)}
					/>
					<Route
						path="/app/customers"
						component={withHeader(CustomerList)}
					/>
					<Route
						path="/app/emails"
						component={withHeader(CustomizeEmail)}
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
