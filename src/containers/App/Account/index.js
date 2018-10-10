import React, { Component } from 'react';
import { Query } from 'react-apollo';
import { Redirect } from "react-router-dom";
import { P } from '../../../utils/content';
import styled from 'react-emotion';

import { GET_USER_INFOS } from '../../../utils/queries';

const AccountMain = styled('div')`
`;

class Account extends Component {
  render() {
    return (
      <Query query={GET_USER_INFOS}>
        {({ client, loading, error, data }) => {
          if (loading) return <p>Loading...</p>;
          if (data && data.me) {
            const { me } = data;
            const { firstName, lastName, email} = me;
            return (
              <AccountMain>
                <button
                  onClick={() => {
                    window.localStorage.removeItem('authToken');
                    client.resetStore();
                  }}
                >
                  Log out
                </button>
                <P>Hello {firstName} {lastName}, your email is {email}</P>
              </AccountMain>
            )
          }            
          return (<Redirect to="/auth"/>)
        }}
      </Query>
    );
  }
}

export default Account;
