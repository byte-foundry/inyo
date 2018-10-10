import React, { Component } from 'react';
import { Query } from 'react-apollo';
import { BrowserRouter as Router, Route, Redirect } from "react-router-dom";
import styled from 'react-emotion';

import Auth from './Auth';
import Dashboard from './Dashboard';
import CreateQuote from './CreateQuote';

import { GET_USER_LOGGEDIN } from '../../utils/queries';

const AppMain = styled('div')`
`;

const ProtectedRoute 
  = ({ isAllowed, ...props }) => 
     isAllowed 
     ? <Route {...props}/> 
     : <Redirect to="/auth"/>;

class App extends Component {
  render() {
    return (
      <Query query={GET_USER_LOGGEDIN}>
        {({ data: { user } }) => (
          <Router>
            <AppMain>
                <ProtectedRoute 
                  isAllowed={user.isLoggedIn} 
                  exact 
                  path="/app" 
                  component={Dashboard}
                />
                <ProtectedRoute 
                  isAllowed={user.isLoggedIn} 
                  exact 
                  path="/app/create" 
                  component={Dashboard}
                />
                <Route path="/auth" component={Auth} />
            </AppMain>
          </Router>
        )}
      </Query>
    );
  }
}

export default App;
