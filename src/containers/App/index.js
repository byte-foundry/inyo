import React from 'react';
import {Switch, Route, Redirect} from 'react-router-dom';
import styled from '@emotion/styled';
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

import {TOOLTIP_DELAY} from '../../utils/constants';

const AppMain = styled('div')`
	display: flex;
	flex-direction: column;
	padding: 3rem;
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
				{!me && (
					<Route
						path="/app/projects/:projectId/view/:customerToken"
						component={withHeader(ProjectCustomerView)}
					/>
				)}
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
