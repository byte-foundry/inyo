import React, { Component } from 'react';
import { ApolloConsumer } from 'react-apollo';
import { Redirect } from "react-router-dom";
import styled from 'react-emotion';
import { Formik } from 'formik';
import * as Yup from 'yup';
import FormElem from '../FormElem';
import { H1 } from '../../utils/content';

const LoginFormMain = styled('div')`
`;

class LoginForm extends Component {
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
      <LoginFormMain>
        <H1>Log in</H1>
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
                  values,
                  touched,
                  errors,
                  dirty,
                  isSubmitting,
                  handleChange,
                  handleBlur,
                  handleSubmit,
                  handleReset,
                } = props;
                return (
                  <form onSubmit={handleSubmit}>
                    <label htmlFor="email">
                      Email
                    </label>
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
                    {errors.password &&
                      touched.password && <div className="input-feedback">{errors.password}</div>}
                    <button type="submit" disabled={isSubmitting}>
                      Submit
                    </button>
                  </form>
                );
              }}
            </Formik>
          )}
        </ApolloConsumer>
      </LoginFormMain>
    );
  }
}

export default LoginForm;
