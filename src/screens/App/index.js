import React, {useState} from 'react';
import {useQuery} from 'react-apollo-hooks';
import {Switch, Route, Redirect} from 'react-router-dom';
import styled from '@emotion/styled';
import ReactGA from 'react-ga';
import * as Sentry from '@sentry/browser';

import Onboarding from './Onboarding';
import Dashboard from './Dashboard';
import Account from './Account';
import Tasks from './Tasks';
import CustomerTasks from '../Customer/Tasks';
import ProjectCustomerView from './Project/project-customer-view';

import withHeader from '../../HOC/withHeader';

import {CHECK_LOGIN_USER} from '../../utils/queries';
import {
	INTERCOM_APP_ID,
	TOOLTIP_DELAY,
	BREAKPOINTS,
} from '../../utils/constants';

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
				<Route path="/app/onboarding" component={Onboarding} />
				<Redirect to="/app/tasks" />
			</Switch>
		</AppMain>
	);
}

export default App;
