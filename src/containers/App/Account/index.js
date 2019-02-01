import React, {Component} from 'react';
import {Query} from 'react-apollo';
import {Redirect} from 'react-router-dom';
import styled from '@emotion/styled';
import {css} from '@emotion/core';
import {ToastContainer, toast} from 'react-toastify';

import TopBar, {
	TopBarTitle,
	TopBarButton,
	TopBarNavigation,
} from '../../../components/TopBar';
import {
	H3,
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
import {ReactComponent as DashboardIcon} from '../../../utils/icons/dashboard.svg';
// import {ReactComponent as UsersIcon} from '../../../utils/icons/users.svg';
import {ReactComponent as SettingsIcon} from '../../../utils/icons/settings.svg';
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
const Profile = styled(FlexRow)`
	align-items: flex-start;
`;

const ProfileSide = styled('div')`
	margin-top: 80px;
	margin-right: 80px;
	position: sticky;
	top: 20px;
`;

const ProfileSideLinks = styled('ul')`
	margin: 0;
	padding: 0;
`;

const ProfileSideElem = styled('li')`
	list-style-type: none;
	margin-bottom: 24px;
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
const ProfileSideLink = styled('a')`
	text-decoration: none;
	color: inherit;
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
	state = {
		activeItem: 'me',
		initialRender: true,
	};

	initialScroll = () => {
		const hash = this.props.history.location.hash.slice(1);

		if (hash && this[hash] && this.state.initialRender) {
			this[hash].scrollIntoView({
				block: 'start',
				behavior: 'smooth',
			});
			this.setState({
				activeItem: this[hash],
				initialRender: false,
			});
		}
	};

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

	handleScroll = (e) => {
		e.preventDefault();

		const hashValue = e.target.hash.slice(1);

		this[hashValue].scrollIntoView({
			block: 'start',
			behavior: 'smooth',
		});
		this.setState({activeItem: hashValue});
	};

	render() {
		const {activeItem} = this.state;

		return (
			<Query query={GET_USER_INFOS} onCompleted={this.initialScroll}>
				{({client, loading, data}) => {
					if (loading) return <Loading />;
					if (!data || !data.me) return <Redirect to="/auth" />;

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
										<DashboardIcon />
										<span>Dashboard</span>
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
										<span>Projets</span>
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
									<TopBarButton
										theme="Link"
										size="XSmall"
										onClick={() => {
											this.props.history.push(
												'/app/account',
											);
										}}
									>
										<SettingsIcon />
										<span>Réglages</span>
									</TopBarButton>
								</TopBarNavigation>
							</TopBar>

							<AccountBody>
								<WelcomeMessage>
									Bonjour {firstName} !
								</WelcomeMessage>

								<Profile>
									<ProfileSide>
										<ProfileSideLinks>
											<ProfileSideElem
												active={activeItem === 'me'}
											>
												<ProfileSideLink
													href="#me"
													onClick={this.handleScroll}
												>
													Vous
												</ProfileSideLink>
											</ProfileSideElem>
											<ProfileSideElem
												active={
													activeItem === 'company'
												}
											>
												<ProfileSideLink
													href="#company"
													onClick={this.handleScroll}
												>
													Votre société
												</ProfileSideLink>
											</ProfileSideElem>
											<ProfileSideElem
												active={
													activeItem === 'settings'
												}
											>
												<ProfileSideLink
													href="#settings"
													onClick={this.handleScroll}
												>
													Vos options
												</ProfileSideLink>
											</ProfileSideElem>
											<ProfileSideElem
												active={
													activeItem === 'account'
												}
											>
												<ProfileSideLink
													href="#account"
													onClick={this.handleScroll}
												>
													Votre compte
												</ProfileSideLink>
											</ProfileSideElem>
										</ProfileSideLinks>
									</ProfileSide>

									<ProfileMain>
										<ProfileTitle
											id="me"
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
											id="company"
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
											id="settings"
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
										<ProfileTitle
											id="account"
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
				}}
			</Query>
		);
	}
}

export default Account;
