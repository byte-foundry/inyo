import React, {Component} from 'react';
import {Switch, Route} from 'react-router-dom';
import * as Sentry from '@sentry/browser';

import GoogleAnalytics from 'react-ga';
import styled from 'react-emotion';
import {Body} from '../../utils/content';
import Landing from '../Landing';
import App from '../App';
import Auth from '../App/Auth';
import SentryReporter from '../SentryReporter';

const BodyMain = styled(Body)`
	nav {
		a {
			color: #61dafb;
			margin-right: 10px;
		}
	}
`;

Sentry.init({
	dsn: 'https://d6ed2b1e0a594835b2f768405b6c5e90@sentry.io/1307916',
	environment: process.env.NODE_ENV,
	release: 'inyo@v1.0.0',
});
GoogleAnalytics.initialize('UA-41962243-12');

const withTracker = (WrappedComponent, options = {}) => {
	const trackPage = (page) => {
		GoogleAnalytics.set({
			page,
			...options,
		});
		GoogleAnalytics.pageview(page);
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
						<Switch>
							<Route
								exact
								path="/"
								component={withTracker(Landing)}
							/>
							<Route path="/app" component={withTracker(App)} />
							<Route path="/auth" component={Auth} />
						</Switch>
					</main>
				</BodyMain>
			</SentryReporter>
		);
	}
}

export default Container;
