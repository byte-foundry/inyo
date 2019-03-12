import React, {Suspense, useState, useContext} from 'react';
import ReactDOM from 'react-dom';
import ReactGA from 'react-ga';
import styled from '@emotion/styled';
import {ApolloProvider} from 'react-apollo';
import {
	ApolloProvider as ApolloHooksProvider,
	useQuery,
} from 'react-apollo-hooks';
import {
	BrowserRouter as Router,
	Switch,
	Route,
	Redirect,
} from 'react-router-dom';
import 'react-dates/initialize';
import 'react-dates/lib/css/_datepicker.css';
import moment from 'moment';
import 'moment/locale/fr';
import * as Sentry from '@sentry/browser';
import ReactTooltip from 'react-tooltip';

import withTracker from './HOC/withTracker';

import ProvidersSentry from './providers/sentry';

import App from './screens/App';
import Auth from './screens/Auth';
import Customer from './screens/Customer';

import {UserContext} from './utils/contexts';
import {Loading} from './utils/content';
import client from './utils/graphQLConfig';
import {INTERCOM_APP_ID, TOOLTIP_DELAY} from './utils/constants';
import {CHECK_LOGIN_USER} from './utils/queries';
import {Body} from './utils/new/design-system';

import * as serviceWorker from './serviceWorker';

import './index.css';

// Setting up locale mostly for react-dates
moment.locale((navigator && navigator.language) || 'fr-FR');

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

const ProtectedRoute = ({isAllowed, ...props}) => (isAllowed ? <Route {...props} /> : false);
const ProtectedRedirect = ({isAllowed, ...props}) => (isAllowed ? <Redirect {...props} /> : false);

function Root() {
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
		<ProvidersSentry>
			<BodyMain>
				<main>
					<UserContext.Provider user={data && data.me}>
						<Switch>
							<ProtectedRoute
								path="/app"
								component={withTracker(App)}
								isAllowed={data && data.me}
							/>
							<ProtectedRoute
								path="/auth"
								component={withTracker(Auth)}
								isAllowed={!(data && data.me)}
							/>
							<Route
								path="/app/:customerToken"
								component={withTracker(Customer)}
							/>
							<ProtectedRedirect
								to="/app"
								isAllowed={data && data.me}
							/>
						</Switch>
					</UserContext.Provider>
				</main>
				<ReactTooltip effect="solid" delayShow={TOOLTIP_DELAY} />
			</BodyMain>
		</ProvidersSentry>
	);
}

ReactDOM.render(
	<ApolloProvider client={client}>
		<ApolloHooksProvider client={client}>
			<Router>
				<Suspense fallback={<Loading />}>
					<Root />
				</Suspense>
			</Router>
		</ApolloHooksProvider>
	</ApolloProvider>,
	document.getElementById('root'),
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
