import React, {Component} from 'react';
import {Query} from 'react-apollo';
import styled from 'react-emotion';
import {ToastContainer, toast} from 'react-toastify';

import Tasks from './tasks';
import {
	H1,
	H2,
	Button,
	primaryNavyBlue,
	primaryBlue,
	gray10,
	primaryWhite,
	Loading,
} from '../../../utils/content';
import {GET_USER_INFOS} from '../../../utils/queries';
import {ReactComponent as AccountIcon} from '../../../utils/icons/user.svg';
import 'react-toastify/dist/ReactToastify.css';

const Main = styled('div')`
	background: ${gray10};
	min-height: 100vh;
	padding-bottom: 80px;
`;
const Content = styled('div')`
	padding-left: 40px;
	padding-right: 40px;
`;

const TopBarTitle = styled(H1)`
	color: ${primaryNavyBlue};
`;
const WelcomeMessage = styled(H2)`
	color: ${primaryBlue};
`;

const TopBarButton = styled(Button)`
	height: 60px;
	padding: 0 25px;
	svg {
		width: 60px;
	}
`;

const ListProjectsTopBar = styled('div')`
	display: flex;
	flex-flow: row nowrap;
	justify-content: space-between;
	align-items: center;
	padding-left: 40px;
	padding-right: 40px;
	background-color: ${primaryWhite};
`;

const ActionRow = styled('div')`
	display: flex;
	flex-flow: row nowrap;
	justify-content: flex-end;
	align-items: center;
`;

class Dashboard extends Component {
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
		return (
			<Query query={GET_USER_INFOS}>
				{({client, loading, data}) => {
					if (loading) return <Loading />;

					const {me} = data;
					const {firstName} = me;

					return (
						<Main>
							<ToastContainer />
							<ListProjectsTopBar>
								<TopBarTitle>Tableau de bord</TopBarTitle>
								<ActionRow>
									<TopBarButton
										theme="Link"
										size="XSmall"
										onClick={() => {
											this.props.history.push(
												'/app/account',
											);
										}}
									>
										<AccountIcon />
									</TopBarButton>
									<TopBarButton
										theme="Primary"
										size="Medium"
										onClick={this.createNewProject}
									>
										Créer un nouveau projet
									</TopBarButton>
								</ActionRow>
							</ListProjectsTopBar>
							<Content>
								<WelcomeMessage>
									Bonjour {firstName} !
								</WelcomeMessage>

								<Tasks />
							</Content>
						</Main>
					);
				}}
			</Query>
		);
	}
}

export default Dashboard;
