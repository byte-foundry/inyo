export default `
  type User {
    isLoggedIn: Boolean!
  }

  type Query {
    user: User
  }
`;