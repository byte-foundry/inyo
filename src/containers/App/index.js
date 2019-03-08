import React from 'react';
import {Switch, Route, Redirect} from 'react-router-dom';
import styled from '@emotion/styled';
import ReactTooltip from 'react-tooltip';

import Onboarding from './Onboarding';
import Dashboard from './Dashboard';
import Account from './Account';
import Tasks from './Tasks';
import ConditionalContent from './ConditionalContent';
import TopBar, {
	TopBarMenu,
	TopBarLogo,
	TopBarMenuLink,
} from '../../components/TopBar';

import {TOOLTIP_DELAY, BREAKPOINTS} from '../../utils/constants';

const AppMain = styled('div')`
	display: flex;
	flex-direction: column;
	padding: 3rem;

	@media (max-width: ${BREAKPOINTS}px) {
		padding: 1rem;
	}
`;

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

function App({me}) {
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
			{me && (
				<Route
					path={['/app/projects', '/app/account', '/app/dashboard']}
					render={props => (
						<ConditionalContent {...props} user={me} />
					)}
				/>
			)}
		</AppMain>
	);
}

export default App;
