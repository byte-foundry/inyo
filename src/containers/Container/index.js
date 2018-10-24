import React, {Component} from 'react';
import {Switch, Route} from 'react-router-dom';
import * as Sentry from '@sentry/browser';

import styled from 'react-emotion';
import {Body} from '../../utils/content';
import Landing from '../Landing';
import App from '../App';
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
});

class Container extends Component {
	render() {
		return (
			<SentryReporter>
				<BodyMain>
					<main>
						<Switch>
							<Route exact path="/" component={Landing} />
							<Route path="/app" component={App} />
						</Switch>
					</main>
				</BodyMain>
			</SentryReporter>
		);
	}
}

export default Container;
