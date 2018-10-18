import React, {Component} from 'react';
import styled from 'react-emotion';
import LoginForm from '../../../components/LoginForm';
import SignUpForm from '../../../components/SignupForm';
import {P, Button} from '../../../utils/content';

const AuthMain = styled('div')`
	padding: 10px 20px;
	max-width: 600px;
`;

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
						<Button
							theme="Link"
							size="XSmall"
							onClick={() => {
								this.setState({isLogin: false});
							}}
						>
							Create an account
						</Button>
					</P>
				) : (
					<P>
						Already have an account?{' '}
						<Button
							theme="Link"
							size="XSmall"
							onClick={() => {
								this.setState({isLogin: true});
							}}
						>
							Log in
						</Button>
					</P>
				)}
			</AuthMain>
		);
	}
}

export default Auth;
