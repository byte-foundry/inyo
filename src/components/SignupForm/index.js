import React, { Component } from 'react';
import { Mutation } from 'react-apollo';
import { Redirect } from "react-router-dom";
import styled from 'react-emotion';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { SIGNUP } from '../../utils/mutations';
import { H1, H4, H6 } from '../../utils/content';
import FormElem from '../FormElem';

const SignupFormMain = styled('div')`
`;

const FormContainer = styled('div')`
  display: flex;
  flex-direction: ${props =>
    props.column ? 'column' : 'row'};
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
          <Mutation mutation={SIGNUP}>
          {signup => (
            <Formik
              initialValues={{ email: '' }}
              validationSchema={Yup.object().shape({
                email: Yup.string()
                  .email()
                  .required('Required'),
                password: Yup.string()
                  .required('Required'),
                companyname: Yup.string()
                  .required('Required'),
              })}
              onSubmit={async (values, actions) => {
                actions.setSubmitting(false);
                try {
                    const { data } = await signup(
                      { variables: {
                        email: values.email,
                        password: values.password,
                        firstName: values.firstname,
                        lastName: values.lastname,
                        company: {
                          name: values.companyname,
                        },
                      } });
                    if (data) {
                        window.localStorage.setItem('authToken', data.signup.token);
                        this.setState({
                            shouldRedirect: true,
                        });
                    }
                } catch (error) {
                    console.log(error)
                    actions.setSubmitting(false);
                    actions.setErrors(error);
                    actions.setStatus({ msg: 'Something went wrong' });
                }
              }}
            >
              {props => {
                const {
                  dirty,
                  isSubmitting,
                  status,
                  handleSubmit,
                  handleReset,
                } = props;
                return (
                  <form onSubmit={handleSubmit}>
                    <FormContainer>
                      <div>
                        <H4>Yourself</H4>
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
                      </div>
                      <div>
                      <H4>Your company (used to fill the quote)</H4>
                        <FormElem
                          {...props}
                          name="companyname"
                          type="text"
                          label="Company name"
                          placeholder="Your company name"
                        />
                        <H6>Your company address</H6>
                        <FormElem
                          {...props}
                          name="companyaddressnumber"
                          type="number"
                          label="Number"
                          placeholder="Number"
                        />
                        <FormElem
                          {...props}
                          name="companyaddressstreet"
                          type="text"
                          label="Street address"
                          placeholder="Street"
                        />
                        <FormElem
                          {...props}
                          name="companyaddresscity"
                          type="text"
                          label="City"
                          placeholder="City"
                        />
                        <FormElem
                          {...props}
                          name="companyaddresspostcode"
                          type="number"
                          label="Postcode"
                          placeholder="Postcode"
                        />
                        <FormElem
                          {...props}
                          name="companyaddresscountry"
                          type="text"
                          label="Country"
                          placeholder="Country"
                        />
                        <FormElem
                          {...props}
                          name="companyemail"
                          type="email"
                          label="Company Email"
                          placeholder="Your company email"
                        />
                        <FormElem
                          {...props}
                          name="companyphone"
                          type="tel"
                          label="Company Phone number"
                          placeholder="Your company phone number"
                        />
                        <FormElem
                          {...props}
                          name="companysiret"
                          type="text"
                          label="Company Siret"
                          placeholder="Your company Siret"
                        />
                        <FormElem
                          {...props}
                          name="companyrcs"
                          type="text"
                          label="Company RCS"
                          placeholder="Your company RCS"
                        />
                        <FormElem
                          {...props}
                          name="companyrm"
                          type="text"
                          label="Company RM"
                          placeholder="Your company RM"
                        />
                        <FormElem
                          {...props}
                          name="companyvat"
                          type="text"
                          label="Company VAT"
                          placeholder="Your company vat number"
                        />
                      </div>
                    </FormContainer>
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
      </SignupFormMain>
    );
  }
}

export default SignupForm;
