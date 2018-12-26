import React, {Component} from 'react';
import {Query} from 'react-apollo';
import {Redirect} from 'react-router-dom';
import styled, {css} from 'react-emotion';
import {ToastContainer, toast} from 'react-toastify';

import TopBar, {
	TopBarTitle,
	TopBarButton,
	TopBarNavigation,
} from '../../../components/TopBar';
import {
	H3,
	P,
	Button,
	gray50,
	primaryBlue,
	signalRed,
	FlexRow,
	gray10,
	primaryWhite,
	gray20,
	gray30,
	Loading,
} from '../../../utils/content';
import {GET_USER_INFOS} from '../../../utils/queries';
import UserCompanyForm from '../../../components/UserCompanyForm';
import UserDataForm from '../../../components/UserDataForm';
import UserSettings from '../../../components/UserSettings';
import UserWorkHourAndDaysForm from '../../../components/UserWorkHourAndDaysForm';
import {ReactComponent as FoldersIcon} from '../../../utils/icons/folders.svg';
// import {ReactComponent as UsersIcon} from '../../../utils/icons/users.svg';
import 'react-toastify/dist/ReactToastify.css';

const AccountMain = styled('div')`
	background: ${gray10};
	min-height: 100vh;
	padding-bottom: 80px;
`;
const AccountBody = styled('div')`
	padding-left: 40px;
	padding-right: 40px;
`;
const Profile = styled(FlexRow)``;
const ProfileSide = styled('div')`
	float: right;
	margin-top: 80px;
	margin-right: 80px;
	position: sticky;
`;

const ProfileSideElem = styled(P)`
	text-transform: uppercase;
	color: ${gray50};
	border-left: 3px solid transparent;
	padding-left: 10px;
	cursor: pointer;
	transition: border-color 0.3s ease, color 0.3s ease;
	${props => props.active
		&& css`
			border-color: ${gray30};
			color: ${gray30};
		`};
`;
const ProfileMain = styled('div')`
	max-width: 900px;
	margin-right: auto;
	flex-grow: 2;
`;

const ProfileSection = styled('div')`
	background: ${primaryWhite};
	padding: 20px 40px;
	border: 1px solid ${gray20};
`;
const LogoutButton = styled(Button)`
	padding: 10px 5px;
	font-size: 15px;
	margin-bottom: 10px;
	color: ${signalRed};
`;

const WelcomeMessage = styled(H3)`
	color: ${primaryBlue};
`;
const ProfileTitle = styled(H3)`
	font-size: 25px;
`;

class Account extends Component {
	constructor(props) {
		super(props);
		this.state = {
			activeItem: 'me',
		};
	}

	toast = () => {
		toast.info(
			<div>
				<p>Les données ont été mises à jour</p>
			</div>,
			{
				position: toast.POSITION.BOTTOM_LEFT,
				autoClose: 3000,
			},
		);
	};

	render() {
		const {activeItem} = this.state;

		return (
			<Query query={GET_USER_INFOS}>
				{({client, loading, data}) => {
					if (loading) return <Loading />;
					if (data && data.me) {
						const {me} = data;
						const {firstName} = me;

						return (
							<AccountMain>
								<ToastContainer />

								<TopBar>
									<TopBarTitle>Mon Compte</TopBarTitle>
									<TopBarNavigation>
										<TopBarButton
											theme="Primary"
											size="Medium"
											onClick={() => {
												this.props.history.push(
													'/app/projects/create',
												);
											}}
										>
											Créer un nouveau projet
										</TopBarButton>
										<TopBarButton
											theme="Link"
											size="XSmall"
											onClick={() => {
												this.props.history.push(
													'/app/dashboard',
												);
											}}
										>
											<FoldersIcon />
										</TopBarButton>
										<TopBarButton
											theme="Link"
											size="XSmall"
											onClick={() => {
												this.props.history.push(
													'/app/projects',
												);
											}}
										>
											<FoldersIcon />
										</TopBarButton>
										{/* <TopBarButton
											theme="Link"
											size="XSmall"
											onClick={() => {
												this.props.history.push(
													'/app/customers',
												);
											}}
										>
											<UsersIcon />
										</TopBarButton> */}
									</TopBarNavigation>
								</TopBar>

								<AccountBody>
									<WelcomeMessage>
										Bonjour {firstName} !
									</WelcomeMessage>
									<Profile>
										<ProfileSide>
											<ProfileSideElem
												active={activeItem === 'me'}
												onClick={() => {
													this.me.scrollIntoView({
														block: 'start',
														behavior: 'smooth',
													});
													this.setState({
														activeItem: 'me',
													});
												}}
											>
												Vous
											</ProfileSideElem>
											<ProfileSideElem
												active={
													activeItem === 'company'
												}
												onClick={() => {
													this.company.scrollIntoView(
														{
															block: 'start',
															behavior: 'smooth',
														},
													);
													this.setState({
														activeItem: 'company',
													});
												}}
											>
												Votre société
											</ProfileSideElem>
											<ProfileSideElem
												active={
													activeItem === 'settings'
												}
												onClick={() => {
													this.settings.scrollIntoView(
														{
															block: 'start',
															behavior: 'smooth',
														},
													);
													this.setState({
														activeItem: 'settings',
													});
												}}
											>
												Vos options
											</ProfileSideElem>
											<ProfileSideElem
												active={
													activeItem === 'account'
												}
												onClick={() => {
													this.account.scrollIntoView(
														{
															block: 'start',
															behavior: 'smooth',
														},
													);
													this.setState({
														activeItem: 'account',
													});
												}}
											>
												Votre compte
											</ProfileSideElem>
										</ProfileSide>

										<ProfileMain>
											<ProfileTitle
												innerRef={(elem) => {
													this.me = elem;
												}}
											>
												Vous
											</ProfileTitle>
											<UserDataForm
												data={me}
												done={() => this.toast()}
											/>
											<ProfileTitle
												innerRef={(elem) => {
													this.company = elem;
												}}
											>
												Votre société
											</ProfileTitle>
											<UserCompanyForm
												data={me.company}
												done={() => this.toast()}
											/>
											<ProfileTitle
												innerRef={(elem) => {
													this.settings = elem;
												}}
											>
												Vos horaires et jours de travail
											</ProfileTitle>
											<UserWorkHourAndDaysForm
												data={me}
												done={() => this.toast()}
											/>
											<UserSettings
												data={me}
												done={() => this.toast()}
											/>
											<ProfileTitle
												innerRef={(elem) => {
													this.account = elem;
												}}
											>
												Votre compte
											</ProfileTitle>
											<ProfileSection>
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
											</ProfileSection>
										</ProfileMain>
									</Profile>
								</AccountBody>
							</AccountMain>
						);
					}
					return <Redirect to="/auth" />;
				}}
			</Query>
		);
	}
}

export default Account;
