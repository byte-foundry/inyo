import React, {Component} from 'react';
import {Mutation} from 'react-apollo';
import {Redirect} from 'react-router-dom';
import styled from 'react-emotion';
import {Formik} from 'formik';
import * as Yup from 'yup';
import {SIGNUP} from '../../utils/mutations';
import {H1, H4, H6} from '../../utils/content';
import FormElem from '../FormElem';

const SignupFormMain = styled('div')``;

const FormContainer = styled('div')`
	display: flex;
	flex-direction: ${props => (props.column ? 'column' : 'row')};
`;

class SignupForm extends Component {
	constructor(props) {
		super(props);
		this.state = {
			shouldRedirect: false,
		};
	}

	render() {
		const {shouldRedirect} = this.state;
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
							initialValues={{email: ''}}
							validationSchema={Yup.object().shape({
								email: Yup.string()
									.email()
									.required('Required'),
								password: Yup.string().required('Required'),
							})}
							onSubmit={async (values, actions) => {
								actions.setSubmitting(false);
								try {
									const {data} = await signup({
										variables: {
											email: values.email,
											password: values.password,
											firstName: values.firstname,
											lastName: values.lastname,
										},
									});

									if (data) {
										window.localStorage.setItem('authToken', data.signup.token);
										this.setState({
											shouldRedirect: true,
										});
									}
								}
								catch (error) {
									console.log(error);
									actions.setSubmitting(false);
									actions.setErrors(error);
									actions.setStatus({msg: 'Something went wrong'});
								}
							}}
						>
							{(props) => {
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
