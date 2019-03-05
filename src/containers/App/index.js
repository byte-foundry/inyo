import React, {useState} from 'react';
import {useQuery} from 'react-apollo-hooks';
import {
	Switch, Route, Redirect, NavLink,
} from 'react-router-dom';
import styled from '@emotion/styled';
import ReactGA from 'react-ga';
import * as Sentry from '@sentry/browser';
import ReactTooltip from 'react-tooltip';

import Onboarding from './Onboarding';
import Dashboard from './Dashboard';
import Account from './Account';
import Tasks from './Tasks';
import ConditionalContent from './ConditionalContent';
import ProjectCustomerView from './Project/project-customer-view';
import TopBar, {
	TopBarMenu,
	TopBarLogo,
	TopBarMenuLink,
} from '../../components/TopBar';
import {ButtonLink} from '../../utils/new/design-system';

import {CHECK_LOGIN_USER} from '../../utils/queries';
import {INTERCOM_APP_ID, TOOLTIP_DELAY} from '../../utils/constants';

const AppMain = styled('div')`
	display: flex;
	flex-direction: column;
	padding: 3rem;
`;

const ProtectedRoute = ({isAllowed, ...props}) => (isAllowed ? <Route {...props} /> : <Redirect to="/auth" />);

const withHeader = Component => (...args) => (
	<>
		<TopBar>
			<ReactTooltip effect="solid" delayShow={TOOLTIP_DELAY} />
			<TopBarLogo />
			<TopBarMenu>
				<TopBarMenuLink
					data-tip="Tâches prioritaires"
					to="/app/dashboard"
				>
					Dashboard
				</TopBarMenuLink>
				<TopBarMenuLink data-tip="Toutes les tâches" to="/app/tasks">
					Tâches
				</TopBarMenuLink>
				<TopBarMenuLink
					data-tip="Profil, jours travaillés, etc."
					to="/app/account"
				>
					Réglages
				</TopBarMenuLink>
			</TopBarMenu>
		</TopBar>
		<Component {...args} />
	</>
);

function App() {
	const [setupDone, setSetupDone] = useState(false);
	const {data} = useQuery(CHECK_LOGIN_USER);

	if (data && data.me && !setupDone) {
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
		ReactGA.set({userId: data.me.id});

		setSetupDone(true);
	}
	else {
		window.Intercom('boot', {
			app_id: INTERCOM_APP_ID,
		});
	}

	return (
		<AppMain>
			<Switch>
				{!data.me && (
					<Route
						path="/app/projects/:projectId/view/:customerToken"
						component={withHeader(ProjectCustomerView)}
					/>
				)}
				<ProtectedRoute
					path="/app/dashboard"
					component={withHeader(Dashboard)}
					isAllowed={data && data.me}
				/>
				<ProtectedRoute
					path="/app/account"
					component={withHeader(Account)}
					isAllowed={data && data.me}
				/>
				<ProtectedRoute
					path="/app/tasks"
					component={withHeader(Tasks)}
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
