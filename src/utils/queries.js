import gql from 'graphql-tag';

export const GET_USER_LOGGEDIN = gql`
  { 
    user @client {
      isLoggedIn
    }
  }
`;