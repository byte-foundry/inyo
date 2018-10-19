import React, {Component} from 'react';
import styled from 'react-emotion';
import LoginForm from '../../../components/LoginForm';
import SignUpForm from '../../../components/SignupForm';
import {
	P,
	Button,
	primaryNavyBlue,
	primaryBlue,
	primaryWhite,
	H1,
} from '../../../utils/content';
import {ReactComponent as AppLogo} from '../appLogo.svg';
import AuthLogo from './authLogo.svg';

const AuthMain = styled('div')`
	display: flex;
	flex-direction: row;
	min-height: 100vh;
`;
const AuthForm = styled('div')`
	display: flex;
	flex-direction: column;
	justify-content: space-between;
	min-height: fill-content;
	width: 40%;
	min-width: 200px;
	padding-left: 2%;
	padding-right: 6%;
	padding-top: 2%;
	padding-bottom: 10%;
`;
const AuthText = styled('div')`
	display: flex;
	flex-direction: column;
	justify-content: top;
	min-height: fill-content;
	width: 60%;
	background: ${primaryNavyBlue};
	color: ${primaryWhite};
	padding-left: 5%;
	padding-right: 5%;
	padding-top: 5%;
`;

const AuthTextContent = styled('div')`
	max-width: 700px;
	margin-left: auto;
	margin-right: auto;
`;
const TextTitle = styled(H1)`
	color: ${primaryBlue};
`;
const TextContent = styled(P)`
	color: ${primaryWhite};
	font-size: 24px;
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
				<AuthForm>
					<AppLogo />
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
				</AuthForm>
				<AuthText>
					<AuthTextContent>
						<img src={AuthLogo} alt="auth logo" />
						<TextTitle>Get started with a free account</TextTitle>
						<TextContent>
							We make it easy to create and launch marketing
							campaigns that help you hit your goals whether youre
							trying to grow your audience, sell more stuff, or
							build your brand.
						</TextContent>
					</AuthTextContent>
				</AuthText>
			</AuthMain>
		);
	}
}

export default Auth;
