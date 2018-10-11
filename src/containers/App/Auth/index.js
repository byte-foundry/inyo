import React, {Component} from 'react';
import styled from 'react-emotion';
import LoginForm from '../../../components/LoginForm';
import SignUpForm from '../../../components/SignupForm';
import {P} from '../../../utils/content';

const AuthMain = styled('div')``;

class Auth extends Component {
	constructor(props) {
		super(props);
		this.state = {
			isLogin: true,
		};
	}

	render() {
		const {isLogin} = this.state;

		return (
			<AuthMain>
				{isLogin ? <LoginForm /> : <SignUpForm />}
				{isLogin ? (
					<P>
						New?{' '}
						<button
							onClick={() => {
								this.setState({isLogin: false});
							}}
						>
							Create an account
						</button>
					</P>
				) : (
					<P>
						Already have an account?{' '}
						<button
							onClick={() => {
								this.setState({isLogin: true});
							}}
						>
							Log in
						</button>
					</P>
				)}
			</AuthMain>
		);
	}
}

export default Auth;
