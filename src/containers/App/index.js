import React, { Component } from 'react';
import { Query } from 'react-apollo';
import { BrowserRouter as Router, Route, Redirect } from "react-router-dom";
import styled from 'react-emotion';

import Auth from './Auth';
import Dashboard from './Dashboard';
import CreateQuote from './CreateQuote';

import { GET_USER_INFOS } from '../../utils/queries';

const AppMain = styled('div')`
`;

class App extends Component {
  render() {
    return (
      <Query query={GET_USER_INFOS}>
        {({ loading, error, data}) => {
          if (loading) return <p>Loading...</p>;
          return (
            <Router>
              <AppMain>
                <Route exact path="/app" component={Dashboard} />
                <Route path="/app/create" component={Dashboard} />
                <Route path="/auth" component={Auth} />
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
