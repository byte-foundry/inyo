import React, {Component} from 'react';
import {Query} from 'react-apollo';
import {Switch, Route, Redirect} from 'react-router-dom';
import styled from 'react-emotion';
import ReactGA from 'react-ga';
import Auth from './Auth';
import Dashboard from './Dashboard';
import Account from './Account';
import Customer from './Customer';
import Quote from './Quote';
import Company from './Company';
import QuoteCustomerView from './Quote/quote-customer-view';

import {CHECK_LOGIN_USER} from '../../utils/queries';

const AppMain = styled('div')``;

const Loading = styled('div')`
	font-size: 70px;
	position: absolute;
	top: 50%;
	left: 50%;
	transform: translate(-50%, -50%);
`;

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
				{({data, loading}) => {
					if (loading) return <Loading>Chargement...</Loading>;
					if (data && data.me) {
						if (!this.state.uid_set) {
							ReactGA.set({userId: data.me.id});
							this.setState({uid_set: true});
						}
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
									<Route
										path="/app/quotes"
										component={Quote}
									/>
									<Redirect to="/app" />
								</Switch>
							</AppMain>
						);
					}

					return (
						<AppMain>
							<Switch>
								<Route
									path="/app/quotes/:quoteId/view/:customerToken"
									component={QuoteCustomerView}
								/>
								<Redirect to="/app/auth" />
							</Switch>
						</AppMain>
					);
				}}
			</Query>
		);
	}
}

export default App;
