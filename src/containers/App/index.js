import React, {useState} from 'react';
import {useQuery} from 'react-apollo-hooks';
import {Switch, Route, Redirect} from 'react-router-dom';
import styled from '@emotion/styled';
import ReactGA from 'react-ga';
import * as Sentry from '@sentry/browser';

import Onboarding from './Onboarding';
import Dashboard from './Dashboard';
import Account from './Account';
import Project from './Project';
import Tasks from './Tasks';
import ConditionalContent from './ConditionalContent';
import ProjectCustomerView from './Project/project-customer-view';

import {CHECK_LOGIN_USER} from '../../utils/queries';
import {INTERCOM_APP_ID} from '../../utils/constants';

const AppMain = styled('div')``;

const ProtectedRoute = ({isAllowed, ...props}) => (isAllowed ? <Route {...props} /> : <Redirect to="/auth" />);

function App() {
	const [uidSet, setUidSet] = useState(false);
	const {data, error} = useQuery(CHECK_LOGIN_USER);

	if (error) throw error;

	if (data && data.me) {
		window.Intercom('boot', {
			app_id: INTERCOM_APP_ID,
			email: data.me.email,
			user_id: data.me.id,
			name: `${data.me.firstName} ${data.me.lastName}`,
			phone: data.me.company.phone,
			user_hash: data.me.hmacIntercomId,
		});
		Sentry.configureScope((scope) => {
			scope.setUser({email: data.me.email});
		});
		if (!uidSet) {
			ReactGA.set({userId: data.me.id});
			setUidSet(true);
		}
	}
	else {
		window.Intercom('boot', {
			app_id: INTERCOM_APP_ID,
		});
	}

	return (
		<AppMain>
			<Switch>
				{error && (
					<Route
						path="/app/projects/:projectId/view/:customerToken"
						component={ProjectCustomerView}
					/>
				)}
				<ProtectedRoute
					path="/app/dashboard"
					component={Dashboard}
					isAllowed={data && data.me}
				/>
				<ProtectedRoute
					path="/app/account"
					component={Account}
					isAllowed={data && data.me}
				/>
				<ProtectedRoute
					path="/app/tasks"
					component={Tasks}
					isAllowed={data && data.me}
				/>
				<ProtectedRoute
					path="/app/onboarding"
					component={Onboarding}
					isAllowed={data && data.me}
				/>
				<Redirect to="/app/tasks" />
			</Switch>
			{data && data.me && (
				<ProtectedRoute
					path={['/app/projects', '/app/account', '/app/dashboard']}
					render={props => (
						<ConditionalContent {...props} user={data.me} />
					)}
					isAllowed
				/>
			)}
		</AppMain>
	);
}

export default App;
