import 'react-dates/initialize';
import 'react-dates/lib/css/_datepicker.css';
import 'moment/locale/fr';
import './index.css';
// if imported with the tooltip, the order is wrong due to code-splitting
import '@reach/tooltip/styles.css';
import './dragdroptouch';

import {ApolloProvider} from '@apollo/react-hooks';
import styled from '@emotion/styled';
import * as Sentry from '@sentry/browser';
import {init, IntlViewerContext} from 'fbt';
import moment from 'moment';
import momentDurationFormat from 'moment-duration-format';
import React, {Suspense, useCallback, useState} from 'react';
import {DndProvider} from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';
import ReactDOM from 'react-dom';
import ReactGA from 'react-ga';
import {
	BrowserRouter as Router,
	Redirect,
	Route,
	Switch,
} from 'react-router-dom';

import withTracker from './HOC/withTracker';
import ProvidersSentry from './providers/sentry';
import * as serviceWorker from './serviceWorker';
import {useQuery} from './utils/apollo-hooks';
import {
	INTERCOM_APP_ID,
	MOMENT_DURATION_LOCALE_EN,
	MOMENT_DURATION_LOCALE_FR,
} from './utils/constants';
import {Loading} from './utils/content';
import {UserContext} from './utils/contexts';
import client from './utils/graphQLConfig';
import {Body, Button} from './utils/new/design-system';
import {CHECK_LOGIN_USER} from './utils/queries';

const Customer = React.lazy(() => import('./screens/Customer'));
const App = React.lazy(() => import('./screens/App'));
const Auth = React.lazy(() => import('./screens/Auth'));
const StraightToCheckout = React.lazy(() => import('./screens/StraightToCheckout'));
const Paid = React.lazy(() => import('./screens/Paid'));
const EndOfTrial = React.lazy(() => import('./screens/EndOfTrial'));
const PrematureEndOfTrial = React.lazy(() => import('./screens/PrematureEndOfTrial'));
const ConditionalContent = React.lazy(() => import('./screens/App/ConditionalContent'));

const translations = require('./translatedFbts.json');

init({translations});
IntlViewerContext.locale
	= navigator && navigator.language.includes('fr') ? 'fr-FR' : 'en-US';

momentDurationFormat(moment);
moment.updateLocale('fr', MOMENT_DURATION_LOCALE_FR);
moment.updateLocale('en', MOMENT_DURATION_LOCALE_EN);

// Setting up locale mostly for react-dates
moment.locale((navigator && navigator.language) || 'fr');

/* eslint-disable */
(function() {
	var w = window;
	var ic = w.Intercom;
	if (typeof ic === 'function') {
		ic('reattach_activator');
		ic('update', w.intercomSettings);
	} else {
		var d = document;
		var i = function() {
			i.c(arguments);
		};
		i.q = [];
		i.c = function(args) {
			i.q.push(args);
		};
		w.Intercom = i;
		var l = function() {
			var s = d.createElement('script');
			s.type = 'text/javascript';
			s.async = true;
			s.src = 'https://widget.intercom.io/widget/' + INTERCOM_APP_ID;
			var x = d.getElementsByTagName('script')[0];
			x.parentNode.insertBefore(s, x);
		};
		if (w.attachEvent) {
			w.attachEvent('onload', l);
		} else {
			w.addEventListener('load', l, false);
		}
	}
})();
/* eslint-enable */

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

const ProtectedRoute = ({isAllowed, protectedPath, ...props}) => (isAllowed ? <Route path={protectedPath} {...props} /> : false);
const ProtectedRedirect = ({
	isAllowed,
	paymentError,
	protectedPath,
	...props
}) => (isAllowed ? (
	<Redirect path={protectedPath} {...props} />
) : !paymentError ? (
	<Redirect to="/auth" />
) : (
	<Redirect to="/end-of-trial" />
));

function Root() {
	const [setupDone, setSetupDone] = useState(false);
	const {data, loading, error} = useQuery(CHECK_LOGIN_USER, {
		suspend: false,
		fetchPolicy: 'network-only',
		errorPolicy: 'all',
	});
	// This is utter shit and should be removed once it works properly

	const PaidWithTracker = withTracker(Paid);
	const paidWithProps = useCallback(
		routeProps => <PaidWithTracker {...routeProps} user={data} />,
		[data],
	);

	if (loading) return <Loading />;

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

	if (data && data.me && data.me.settings && data.me.settings.language) {
		IntlViewerContext.locale
			= data.me.settings.language === 'fr' ? 'fr-FR' : 'en-US';
		moment.locale(data.me.settings.language);
	}

	return (
		<DndProvider backend={HTML5Backend}>
			<ProvidersSentry>
				<BodyMain>
					<main>
						<UserContext.Provider user={data && data.me}>
							<Switch>
								<Route
									path="/app/:customerToken(.*-.*-.*-.*)/tasks"
									component={withTracker(Customer)}
								/>
								<Redirect
									from="/app/projects/:projectId/view/:customerToken(.*-.*-.*-.*)"
									to="/app/:customerToken/tasks?projectId=:projectId"
								/>
								<Route
									path={['/inyo-a-vie', '/premium']}
									component={withTracker(StraightToCheckout)}
								/>
								<Route path="/paid" component={paidWithProps} />
								<Redirect
									from="/canceled"
									to="/app/dashboard"
								/>
								{ProtectedRoute({
									protectedPath: '/app',
									component: withTracker(App),
									isAllowed: data && data.me,
								})}
								{ProtectedRoute({
									protectedPath: '/pay-for-inyo',
									component: withTracker(PrematureEndOfTrial),
									isAllowed: data && data.me,
								})}
								{ProtectedRoute({
									protectedPath: '/auth',
									component: withTracker(Auth),
									isAllowed:
										!(data && data.me)
										&& !(
											error
											&& error.graphQLErrors[0].extensions
											&& error.graphQLErrors[0].extensions
												.code === 'Payment'
										),
								})}
								{ProtectedRoute({
									protectedPath: '/end-of-trial',
									component: withTracker(EndOfTrial),
									isAllowed:
										!(data && data.me)
										&& (error
											&& error.graphQLErrors[0].extensions
											&& error.graphQLErrors[0].extensions
												.code === 'Payment'),
								})}
								<ProtectedRedirect
									to="/app"
									paymentError={
										error
										&& error.graphQLErrors[0].extensions
										&& error.graphQLErrors[0].extensions
											.code === 'Payment'
									}
									isAllowed={data && data.me}
								/>
							</Switch>
							<ProtectedRoute
								protectedPath={[
									'/app/projects',
									'/app/account',
									'/app/dashboard',
									'/app/tasks',
									'/app/tags',
								]}
								render={props => (
									<ConditionalContent {...props} />
								)}
								isAllowed={data && data.me}
							/>
						</UserContext.Provider>
					</main>
				</BodyMain>
			</ProvidersSentry>
		</DndProvider>
	);
}

ReactDOM.render(
	<ApolloProvider client={client}>
		<Router>
			<Suspense fallback={<Loading />}>
				<Root />
			</Suspense>
		</Router>
	</ApolloProvider>,
	document.getElementById('root'),
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
