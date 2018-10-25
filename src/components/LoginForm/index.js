import React, {Component} from 'react';
import {Mutation} from 'react-apollo';
import {Redirect} from 'react-router-dom';
import styled from 'react-emotion';
import ReactGA from 'react-ga';
import {Formik} from 'formik';
import * as Yup from 'yup';

import FormElem from '../FormElem';
import {LOGIN} from '../../utils/mutations';
import {Button, ErrorInput} from '../../utils/content';

const LoginFormMain = styled('div')``;

class LoginForm extends Component {
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
			<LoginFormMain>
				<Mutation mutation={LOGIN}>
					{login => (
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
									const {data} = await login({
										variables: {
											email: values.email,
											password: values.password,
										},
									});

									if (data) {
										window.localStorage.setItem(
											'authToken',
											data.login.token,
										);
										ReactGA.event({
											category: 'User',
											action: 'Logged in',
										});
										this.setState({
											shouldRedirect: true,
										});
									}
								}
								catch (error) {
									actions.setSubmitting(false);
									actions.setErrors(error);
									actions.setStatus({
										msg: 'Wrong credentials',
									});
								}
							}}
						>
							{(props) => {
								const {
									status,
									isSubmitting,
									handleSubmit,
								} = props;

								return (
									<form onSubmit={handleSubmit}>
										<FormElem
											{...props}
											name="email"
											type="email"
											label="Email"
											placeholder="enter your email"
											required
										/>
										<FormElem
											{...props}
											name="password"
											type="password"
											label="Password"
											placeholder="enter your password"
											required
										/>
										{status
											&& status.msg && (
											<ErrorInput>
												{status.msg}
											</ErrorInput>
										)}
										<Button
											type="submit"
											theme={
												isSubmitting
													? 'Disabled'
													: 'PrimaryNavy'
											}
											size="Big"
											disabled={isSubmitting}
										>
											Log in
										</Button>
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
