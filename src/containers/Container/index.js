import React, {Suspense, Component} from 'react';
import {Switch, Route, Redirect} from 'react-router-dom';
import * as Sentry from '@sentry/browser';

import ReactGA from 'react-ga';
import styled from '@emotion/styled';

import {Loading} from '../../utils/content';
import {Body} from '../../utils/new/design-system';
import App from '../App';
import Auth from '../App/Auth';
import SentryReporter from '../SentryReporter';

const BodyMain = styled(Body)``;

Sentry.init({
	dsn: 'https://d6ed2b1e0a594835b2f768405b6c5e90@sentry.io/1307916',
	environment: process.env.REACT_APP_INYO_ENV,
	release: 'inyo@v1.0.0',
});
ReactGA.initialize('UA-41962243-14');

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
}

export default Container;
