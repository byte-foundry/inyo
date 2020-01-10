import styled from '@emotion/styled';
import React, {useState} from 'react';
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

	padding-top: ${props => (props.headband ? '45px' : '')};

	@media (max-width: ${BREAKPOINTS.mobile}px) {
		padding: 1rem;
		flex-direction: column;
	}
`;

function App({history, location}) {
	const [headband, setHeadband] = useState();
	return (
		<>
			<TrialHeadband
				history={history}
				location={location}
				setHeadband={setHeadband}
			/>
			<AppMain headband={headband}>
				<Switch>
					<Route
						path="/app/dashboard"
						render={withHeader(Dashboard)}
					/>
					<Route path="/app/account" render={withHeader(Account)} />
					<Route path="/app/tasks" render={withHeader(Tasks)} />
					<Route path="/app/tags" render={withHeader(Tags)} />
					<Route path="/app/projects" render={withHeader(Projects)} />
					<Route
						path="/app/collaborators"
						render={withHeader(CollaboratorList)}
					/>
					<Route
						path="/app/customers"
						render={withHeader(CustomerList)}
					/>
					<Route
						path="/app/emails"
						component={withHeader(CustomizeEmail)}
					/>
					<Route path="/app/stats" render={withHeader(Stats)} />
					<Route
						path="/app/onboarding"
						render={() => <Onboarding />}
					/>
					<Redirect to="/app/dashboard" />
				</Switch>
			</AppMain>
		</>
	);
}

export default App;
