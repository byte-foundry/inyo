import React, { Component } from 'react';
import { Query } from 'react-apollo';
import { BrowserRouter as Router, Route, Redirect } from "react-router-dom";
import styled from 'react-emotion';
import AppIndex from './AppIndex';
import Signup from './Signup';
import { GET_USER_LOGGEDIN } from '../../utils/queries';

const AppMain = styled('div')`
`;

const ProtectedRoute 
  = ({ isAllowed, ...props }) => 
     isAllowed 
     ? <Route {...props}/> 
     : <Redirect to="/signup"/>;

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
                  component={AppIndex}
                />
                <Route path="/signup" component={Signup} />
            </AppMain>
          </Router>
        )}
      </Query>
    );
  }
}

export default App;
