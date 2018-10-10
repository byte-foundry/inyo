import gql from 'graphql-tag';

export const LOGIN = gql`
  mutation Login($email: String!, $password: String!) {
    login
    (email: $email, password: $password) {
      token
      user {
        id
        email
        firstName
        lastName
      }
    }
  }
`;

export const SIGNUP = gql`
  mutation Signup(
    $email: String!,
    $password: String!,
    $firstName: String,
    $lastName: String,
    $company: CompanyInput!,
  ) {
    signup
    (
        email: $email,
        password: $password,
        firstName: $firstName,
        lastName: $lastName,
        company: $company
    ) {
      token
      user {
        id
        email
        firstName
        lastName
      }
    }
  }
`;

