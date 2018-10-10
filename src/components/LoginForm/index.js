import React, { Component } from 'react';
import { Mutation } from 'react-apollo';
import { Redirect } from "react-router-dom";
import styled from 'react-emotion';
import { Formik } from 'formik';
import * as Yup from 'yup';
import FormElem from '../FormElem';
import { LOGIN } from '../../utils/mutations';
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
        <Mutation mutation={LOGIN}>
          {login => (
            <Formik
              initialValues={{ email: '' }}
              validationSchema={Yup.object().shape({
                email: Yup.string()
                  .email()
                  .required('Required'),
                password: Yup.string()
                  .required('Required'),
              })}
              onSubmit={async (values, actions) => {
                actions.setSubmitting(false);
                try {
                    const { data } = await login({ variables: { email: values.email, password: values.password } });
                    if (data) {
                        console.log(data)
                        window.localStorage.setItem('authToken', data.login.token);
                        this.setState({
                            shouldRedirect: true,
                        });
                    }
                } catch (error) {
                    console.log(error)
                    actions.setSubmitting(false);
                    actions.setErrors(error);
                    actions.setStatus({ msg: 'Wrong credentials' });
                }
              }}
            >
              {props => {
                const {
                  values,
                  touched,
                  errors,
                  status,
                  dirty,
                  isSubmitting,
                  handleChange,
                  handleBlur,
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
                    {status && status.msg && <div>{status.msg}</div>}
                    <button type="submit" disabled={isSubmitting}>
                      Submit
                    </button>
                  </form>
                );
              }}
            </Formik>
          )}
        </Mutation>
      </LoginFormMain>
    );
  }
}

export default LoginForm;
