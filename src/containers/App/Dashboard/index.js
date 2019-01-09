import React, {Component} from 'react';
import {Query} from 'react-apollo';
import styled from 'react-emotion';
import {withRouter} from 'react-router-dom';
import {ToastContainer, toast} from 'react-toastify';

import Tasks from './tasks';
import TopBar, {
	TopBarTitle,
	TopBarButton,
	TopBarNavigation,
} from '../../../components/TopBar';
import {
	H2, primaryBlue, gray10, Loading,
} from '../../../utils/content';
import {GET_USER_INFOS, GET_PROJECT_DATA} from '../../../utils/queries';
import {ReactComponent as FoldersIcon} from '../../../utils/icons/folders.svg';
// import {ReactComponent as UsersIcon} from '../../../utils/icons/users.svg';
import {ReactComponent as SettingsIcon} from '../../../utils/icons/settings.svg';
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

const WelcomeMessage = styled(H2)`
	color: ${primaryBlue};
`;

class Dashboard extends Component {
	finishItem = async (itemId, sectionId, finishItem, token) => finishItem({
		variables: {
			itemId,
			token,
		},
		optimisticResponse: {
			__typename: 'Mutation',
			finishItem: {
				id: itemId,
				status: 'FINISHED',
			},
		},
		update: (cache, {data: {finishItem: finishedItem}}) => {
			window.$crisp.push([
				'set',
				'session:event',
				[[['item_finished', undefined, 'yellow']]],
			]);
			const data = cache.readQuery({
				query: GET_PROJECT_DATA,
				variables: {projectId: this.props.match.params.projectId},
			});
			const section = data.project.sections.find(
				e => e.id === sectionId,
			);
			const itemIndex = section.items.find(
				e => e.id === finishedItem.id,
			);

			section.items[itemIndex].status = finishedItem.status;
			try {
				cache.writeQuery({
					query: GET_PROJECT_DATA,
					variables: {
						projectId: this.props.match.params.projectId,
					},
					data,
				});
			}
			catch (e) {
				throw e;
			}
			this.setState({apolloTriggerRenderTemporaryFix: true});
		},
	});

	snoozeItem = (itemId, sectionId, during = 1, snoozeItem) => snoozeItem({
		variables: {
			itemId,
			during,
		},
		optimisticResponse: {
			__typename: 'Mutation',
			finishItem: {
				id: itemId,
				status: 'SNOOZED',
			},
		},
		update: (cache, {data: {snoozeItem: snoozedItem}}) => {
			window.$crisp.push([
				'set',
				'session:event',
				[[['item_snoozed', undefined, 'yellow']]],
			]);
			const data = cache.readQuery({
				query: GET_PROJECT_DATA,
				variables: {projectId: this.props.match.params.projectId},
			});
			const section = data.project.sections.find(
				e => e.id === sectionId,
			);
			const itemIndex = section.items.find(
				e => e.id === snoozedItem.id,
			);

			section.items[itemIndex].status = snoozedItem.status;
			try {
				cache.writeQuery({
					query: GET_PROJECT_DATA,
					variables: {
						projectId: this.props.match.params.projectId,
					},
					data,
				});
			}
			catch (e) {
				throw e;
			}
			this.setState({apolloTriggerRenderTemporaryFix: true});
		},
	});

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
							<TopBar>
								<TopBarTitle>Tableau de bord</TopBarTitle>
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
									</TopBarButton>
								</TopBarNavigation>
							</TopBar>
							<Content>
								<WelcomeMessage>
									Bonjour {firstName} !
								</WelcomeMessage>

								<Tasks
									finishItem={this.finishItem}
									snoozeItem={this.snoozeItem}
								/>
							</Content>
						</Main>
					);
				}}
			</Query>
		);
	}
}

export default withRouter(Dashboard);
