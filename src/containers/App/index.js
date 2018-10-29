import React, {Component} from 'react';
import {Query} from 'react-apollo';
import {Switch, Route, Redirect} from 'react-router-dom';
import styled from 'react-emotion';
import ReactGA from 'react-ga';
import * as Sentry from '@sentry/browser';

import Dashboard from './Dashboard';
import Account from './Account';
import Customer from './Customer';
import Quote from './Quote';
import Company from './Company';
import QuoteCustomerView from './Quote/quote-customer-view';

import {CHECK_LOGIN_USER} from '../../utils/queries';

const AppMain = styled('div')``;

const Loading = styled('div')`
	font-size: 30px;
	position: absolute;
	top: 50%;
	left: 50%;
	transform: translate(-50%, -50%);
`;

const ProtectedRoute = ({isAllowed, ...props}) => (isAllowed ? <Route {...props} /> : <Redirect to="/auth" />);

class App extends Component {
	constructor(props) {
		super(props);
		this.state = {
			uid_set: false,
		};
	}

	render() {
		return (
			<Query query={CHECK_LOGIN_USER} fetchPolicy="network-only">
				{({data, loading, error}) => {
					if (loading) return <Loading>Chargement...</Loading>;
					if (data && data.me) {
						Sentry.configureScope((scope) => {
							scope.setUser({email: data.me.email});
						});
						if (!this.state.uid_set) {
							ReactGA.set({userId: data.me.id});
							this.setState({uid_set: true});
						}
					}
					return (
						<AppMain>
							<Switch>
								{error && (
									<Route
										path="/app/quotes/:quoteId/view/:customerToken"
										component={QuoteCustomerView}
									/>
								)}
								<ProtectedRoute
									exact
									path="/app"
									component={Dashboard}
									isAllowed={data && data.me}
								/>
								<ProtectedRoute
									path="/app/account"
									component={Account}
									isAllowed={data && data.me}
								/>
								<ProtectedRoute
									path="/app/company"
									component={Company}
									isAllowed={data && data.me}
								/>
								<ProtectedRoute
									path="/app/customer"
									component={Customer}
									isAllowed={data && data.me}
								/>
								<ProtectedRoute
									path="/app/quotes"
									component={Quote}
									isAllowed={data && data.me}
								/>
							</Switch>
						</AppMain>
					);
				}}
			</Query>
		);
	}
}

export default App;
