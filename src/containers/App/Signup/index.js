import React, { Component } from 'react';
import styled from 'react-emotion';
import LoginForm from '../../../components/LoginForm';
import { H1 } from '../../../utils/content';

const SignupMain = styled('div')`
`;

class Signup extends Component {
  render() {
    return (
      <SignupMain>
        <H1>Sign up</H1>
        <LoginForm/>
      </SignupMain>
    );
  }
}

export default Signup;
