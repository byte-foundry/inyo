import React, { Component } from 'react';
import { ApolloConsumer } from 'react-apollo';
import { Redirect } from "react-router-dom";
import styled from 'react-emotion';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { H1 } from '../../utils/content';

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
                    <input
                      id="email"
                      placeholder="Enter your email"
                      type="text"
                      value={values.email}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      className={
                        errors.email && touched.email ? 'text-input error' : 'text-input'
                      }
                    />
                    {errors.email &&
                      touched.email && <div className="input-feedback">{errors.email}</div>}
                    <label htmlFor="password">
                      Email
                    </label>
                    <input
                      id="password"
                      placeholder="Enter your password"
                      type="password"
                      value={values.password}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      className={
                        errors.password && touched.password ? 'text-input error' : 'text-input'
                      }
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
      </SignupFormMain>
    );
  }
}

export default SignupForm;
