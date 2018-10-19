import React, {Component} from 'react';
import {Query} from 'react-apollo';
import {
	Switch, Route, Redirect, Link,
} from 'react-router-dom';
import styled from 'react-emotion';

import Auth from './Auth';
import Dashboard from './Dashboard';
import Account from './Account';
import Customer from './Customer';
import Quote from './Quote';
import Company from './Company';

import {CHECK_LOGIN_USER} from '../../utils/queries';

const AppMain = styled('div')``;

class App extends Component {
	render() {
		return (
			<Query query={CHECK_LOGIN_USER} fetchPolicy="network-only">
				{({loading, error, data}) => {
					if (loading) return <p>Loading...</p>;
					return (
						<AppMain>
							<Switch>
								<Route
									exact
									path="/app"
									component={Dashboard}
								/>
								<Route path="/app/auth" component={Auth} />
								<Route
									path="/app/account"
									component={Account}
								/>
								<Route
									path="/app/company"
									component={Company}
								/>
								<Route
									path="/app/customer"
									component={Customer}
								/>
								<Route path="/app/quotes" component={Quote} />
								<Redirect to="/app" />
							</Switch>
							{error && <Redirect to="/app/auth" />}
						</AppMain>
					);
				}}
			</Query>
		);
	}
}

export default App;
