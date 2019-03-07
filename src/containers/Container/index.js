import React, {Component, useState} from 'react';
import {useQuery} from 'react-apollo-hooks';
import {Switch, Route, Redirect} from 'react-router-dom';
import * as Sentry from '@sentry/browser';
import ReactTooltip from 'react-tooltip';

import ReactGA from 'react-ga';
import styled from '@emotion/styled';

import {Body} from '../../utils/new/design-system';
import {CHECK_LOGIN_USER} from '../../utils/queries';
import {INTERCOM_APP_ID, TOOLTIP_DELAY} from '../../utils/constants';

import SentryReporter from '../SentryReporter';
import App from '../App';
import Auth from '../App/Auth';

import TopBar, {
	TopBarMenu,
	TopBarLogo,
	TopBarMenuLink,
} from '../../components/TopBar';
import ProjectCustomerView from '../App/Project/project-customer-view';

const BodyMain = styled(Body)``;

Sentry.init({
	dsn: 'https://d6ed2b1e0a594835b2f768405b6c5e90@sentry.io/1307916',
	environment: process.env.REACT_APP_INYO_ENV,
	release: 'inyo@v1.0.0',
});
ReactGA.initialize('UA-41962243-14');

const query = new URLSearchParams(document.location.search);

if (query.has('dimension')) {
	ReactGA.set({dimension1: query.get('dimension')});
}

const withTracker = (WrappedComponent, options = {}) => {
	const trackPage = (page) => {
		ReactGA.set({
			page,
			...options,
		});
		ReactGA.pageview(page);
	};

	// eslint-disable-next-line
	const HOC = class extends Component {
		componentDidMount() {
			// eslint-disable-next-line
			const page =
				this.props.location.pathname + this.props.location.search;
			trackPage(page);
		}

		componentDidUpdate(prevProps) {
			const currentPage
				= prevProps.location.pathname + prevProps.location.search;
			const nextPage
				= this.props.location.pathname + this.props.location.search;

			if (currentPage !== nextPage) {
				trackPage(nextPage);
			}
		}

		render() {
			return <WrappedComponent {...this.props} />;
		}
	};

	return HOC;
};

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

const ProtectedRoute = ({isAllowed, fallback, ...props}) => (isAllowed ? <Route {...props} /> : <Redirect to={fallback} />);
const ProtectedRedirect = ({isAllowed, fallback, ...props}) => (isAllowed ? <Redirect {...props} /> : <Redirect to={fallback} />);

function Container() {
	const [setupDone, setSetupDone] = useState(false);
	const {data, loading, error} = useQuery(CHECK_LOGIN_USER, {
		suspend: false,
		fetchPolicy: 'network-only',
		errorPolicy: 'ignore',
	});

	if (loading) return false;
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
	else if (!(data && data.me)) {
		if (setupDone) {
			setSetupDone(false);
		}
		window.Intercom('boot', {
			app_id: INTERCOM_APP_ID,
		});
	}

	return (
		<SentryReporter>
			<BodyMain>
				<main>
					<Switch>
						{!data.me && (
							<Route
								path="/app/projects/:projectId/view/:customerToken"
								component={withTracker(
									withHeader(ProjectCustomerView),
								)}
							/>
						)}
						<ProtectedRoute
							path="/app"
							component={withTracker(App)}
							isAllowed={data && data.me}
							fallback="/auth"
						/>
						<ProtectedRoute
							path="/auth"
							component={withTracker(Auth)}
							isAllowed={!(data && data.me)}
							fallback="/app"
						/>
						<ProtectedRedirect
							to="/app"
							isAllowed={data && data.me}
							fallback="/auth"
						/>
					</Switch>
				</main>
			</BodyMain>
		</SentryReporter>
	);
}

export default Container;
