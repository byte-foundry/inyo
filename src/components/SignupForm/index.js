import React, { Component } from 'react';
import { ApolloConsumer } from 'react-apollo';
import { Redirect } from "react-router-dom";
import styled from 'react-emotion';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { H1 } from '../../utils/content';
import FormElem from '../FormElem';

const SignupFormMain = styled('div')`
`;

class SignupForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      shouldRedirect: false,
    }
  }
  render() {
    const { shouldRedirect } = this.state;
    const from = this.props.from || '/app';
    if (shouldRedirect) {
      return <Redirect to={from} />;
    }
    return (
      <SignupFormMain>        
        <H1>Sign up</H1>
        <ApolloConsumer>
          {client => (
            <Formik
              initialValues={{ email: '' }}
              validationSchema={Yup.object().shape({
                email: Yup.string()
                  .email()
                  .required('Required'),
                password: Yup.string()
                  .required('Required'),
              })}
              onSubmit={(values, actions) => {
                actions.setSubmitting(false);
                client.writeData({
                  data: {
                    user: {
                      __typename: 'User',
                      isLoggedIn: true
                    }
                  }
                })
                this.setState({
                  shouldRedirect: true,
                });
              }}
            >
              {props => {
                const {
                  dirty,
                  isSubmitting,
                  handleSubmit,
                  handleReset,
                } = props;
                return (
                  <form onSubmit={handleSubmit}>
                    <FormElem
                      {...props}
                      name="email"
                      type="email"
                      label="Email"
                      placeholder="enter your email"
                    />
                    <FormElem
                      {...props}
                      name="password"
                      type="password"
                      label="Password"
                      placeholder="enter your password"
                    />
                    <FormElem
                      {...props}
                      name="firstname"
                      type="text"
                      label="First name"
                      placeholder="Your first name"
                    />
                    <FormElem
                      {...props}
                      name="lastname"
                      type="text"
                      label="Last name"
                      placeholder="Your last name"
                    />
                    <button type="submit" disabled={isSubmitting}>
                      Submit
                    </button>
                  </form>
                );
              }}
            </Formik>
          )}
        </ApolloConsumer>
      </SignupFormMain>
    );
  }
}

export default SignupForm;
