import React, {Component} from 'react';
import {Query} from 'react-apollo';
import {Redirect, Link} from 'react-router-dom';
import styled from 'react-emotion';
import {
	H1,
	H3,
	P,
	Button,
	gray50,
	primaryNavyBlue,
	primaryBlue,
	signalRed,
	FlexRow,
	Label,
	gray10,
	primaryWhite,
	gray20,
} from '../../../utils/content';
import {GET_USER_INFOS} from '../../../utils/queries';
import UserCompanyForm from '../../../components/UserCompanyForm';
import UserDataForm from '../../../components/UserDataForm';

const AccountMain = styled('div')`
	background: ${gray10};
	min-height: 100vh;
`;
const AccountBody = styled('div')`
	max-width: 1600px;
	margin-left: auto;
	margin-right: auto;
`;

const ProfileMain = styled('div')`
	max-width: 900px;
	margin-left: auto;
	margin-right: auto;
`;
const BackButton = styled(Button)`
	padding: 10px 5px;
	font-size: 11px;
	margin-bottom: 10px;
	color: ${gray50};
`;
const LogoutButton = styled(Button)`
	padding: 10px 5px;
	font-size: 15px;
	margin-bottom: 10px;
	color: ${signalRed};
`;
const Loading = styled('div')`
	font-size: 70px;
	position: absolute;
	top: 50%;
	left: 50%;
	transform: translate(-50%, -50%);
`;

const WelcomeMessage = styled(H3)`
	color: ${primaryBlue};
`;
const TopBarTitle = styled(H1)`
	color: ${primaryNavyBlue};
	margin-top: 0;
`;
const ProfileField = styled(P)`
	margin-top: 0;
`;
const ProfileTitle = styled(H3)`
	font-size: 25px;
`;

class Account extends Component {
	render() {
		return (
			<Query query={GET_USER_INFOS}>
				{({client, loading, data}) => {
					if (loading) return <Loading>Chargement...</Loading>;
					if (data && data.me) {
						const {me} = data;
						const {firstName} = me;

						console.log(me);

						return (
							<AccountMain>
								<AccountBody>
									<BackButton
										theme="Link"
										size="XSmall"
										onClick={() => this.props.history.push(
											'/app/quotes',
										)
										}
									>
										Retour à la liste des devis
									</BackButton>
									<TopBarTitle>Mon compte</TopBarTitle>
									<WelcomeMessage>
										Bonjour {firstName} !
									</WelcomeMessage>
									<ProfileMain>
										<ProfileTitle>Vous</ProfileTitle>
										<UserDataForm data={me} />
										<ProfileTitle>
											Votre société
										</ProfileTitle>
										<UserCompanyForm data={me.company} />
									</ProfileMain>

									<LogoutButton
										theme="Link"
										size="XSmall"
										type="button"
										onClick={() => {
											window.localStorage.removeItem(
												'authToken',
											);
											client.resetStore();
										}}
									>
										Me déconnecter
									</LogoutButton>
								</AccountBody>
							</AccountMain>
						);
					}
					return <Redirect to="/app/auth" />;
				}}
			</Query>
		);
	}
}

export default Account;
