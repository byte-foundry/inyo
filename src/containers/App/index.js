import React, {Component} from 'react';
import {Query} from 'react-apollo';
import {Switch, Route, Redirect} from 'react-router-dom';
import styled from 'react-emotion';
import ReactGA from 'react-ga';
import * as Sentry from '@sentry/browser';

import Dashboard from './Dashboard';
import Onboarding from './Onboarding';
import Account from './Account';
import Customer from './Customer';
import Quote from './Quote';
import Company from './Company';
import QuoteCustomerView from './Quote/quote-customer-view';

import {CHECK_LOGIN_USER} from '../../utils/queries';
import {Loading} from '../../utils/content';

const AppMain = styled('div')``;

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
					if (loading) return <Loading />;
					if (data && data.me) {
						window.$crisp.push([
							'set',
							'user:email',
							[data.me.email],
						]);
						window.$crisp.push([
							'set',
							'user:nickname',
							[`${data.me.firstName} ${data.me.lastName}`],
						]);
						window.$crisp.push([
							'set',
							'session:segments',
							[['user']],
						]);
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
								<ProtectedRoute
									path="/app/onboarding"
									component={Onboarding}
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
