import React, { Component } from 'react';
import { Query } from 'react-apollo';
import { BrowserRouter as Router, Route, Redirect, Link } from "react-router-dom";
import styled from 'react-emotion';

import Auth from './Auth';
import Dashboard from './Dashboard';
import CreateQuote from './CreateQuote';
import Account from './Account';

import { CHECK_LOGIN_USER } from '../../utils/queries';

const AppMain = styled('div')`
`;

class App extends Component {
  render() {
    return (
      <Query query={CHECK_LOGIN_USER}>
        {({ loading, error, data}) => {
          if (loading) return <p>Loading...</p>;
          return (
            <Router>
              <AppMain>
                <Link to='/account'>
                  My account
                </Link>
                <Route exact path="/app" component={Dashboard} />
                <Route path="/app/create" component={Dashboard} />
                <Route path="/auth" component={Auth} />
                <Route path="/account" component={Account} />
                {error && (<Redirect to="/auth"/>)}
              </AppMain>
            </Router>
          )
        }}
      </Query>
    );
  }
}

export default App;
