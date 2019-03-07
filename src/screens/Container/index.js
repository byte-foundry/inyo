import React, {Component, useState} from 'react';
import {Query} from 'react-apollo';
import {Switch, Route, Redirect} from 'react-router-dom';
import * as Sentry from '@sentry/browser';

import ReactGA from 'react-ga';
import styled from '@emotion/styled';

import {Body} from '../../utils/new/design-system';
import {CHECK_LOGIN_USER} from '../../utils/queries';
import {INTERCOM_APP_ID} from '../../utils/constants';

import SentryReporter from '../SentryReporter';
import App from '../App';
import Auth from '../App/Auth';
import SentryReporter from '../SentryReporter';
import withTracker from '../../HOC/withTracker';

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

class Container extends Component {
	render() {
		return (
			<SentryReporter>
				<BodyMain>
					<main>
						<Suspense fallback={<Loading />}>
							<Switch>
								<Route
									path="/app"
									component={withTracker(App)}
								/>
								<Route
									path="/auth"
									component={withTracker(Auth)}
								/>
								<Redirect to="/app" />
							</Switch>
						</Suspense>
					</main>
				</BodyMain>
			</SentryReporter>
		);
	}
>>>>>>> start of new folder structure:src/screens/Container/index.js
}

export default Container;
