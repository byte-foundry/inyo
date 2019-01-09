import React, {Component} from 'react';
import {Query} from 'react-apollo';
import {Switch, Route, Redirect} from 'react-router-dom';
import styled from 'react-emotion';
import ReactGA from 'react-ga';
import * as Sentry from '@sentry/browser';

import Onboarding from './Onboarding';
import Dashboard from './Dashboard';
import Account from './Account';
import Project from './Project';
import ConditionalContent from './ConditionalContent';
import ProjectCustomerView from './Project/project-customer-view';

import {CHECK_LOGIN_USER} from '../../utils/queries';
import {Loading} from '../../utils/content';

const AppMain = styled('div')``;

const ProtectedRoute = ({isAllowed, ...props}) => (isAllowed ? <Route {...props} /> : <Redirect to="/auth" />);

class App extends Component {
	state = {
		uid_set: false,
	};

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
										path="/app/projects/:projectId/view/:customerToken"
										component={ProjectCustomerView}
									/>
								)}
								<ProtectedRoute
									path="/app/dashboard"
									component={Dashboard}
									isAllowed={data && data.me}
								/>
								<ProtectedRoute
									path="/app/account"
									component={Account}
									isAllowed={data && data.me}
								/>
								<ProtectedRoute
									path="/app/projects"
									component={Project}
									isAllowed={data && data.me}
								/>
								<ProtectedRoute
									path="/app/onboarding"
									component={Onboarding}
									isAllowed={data && data.me}
								/>
								<Redirect to="/app/dashboard" />
							</Switch>
							{data
								&& data.me && (
								<ProtectedRoute
									path={['/app/projects', '/app/account']}
									render={props => (
										<ConditionalContent
											{...props}
											user={data.me}
										/>
									)}
									isAllowed
								/>
							)}
						</AppMain>
					);
				}}
			</Query>
		);
	}
}

export default App;
