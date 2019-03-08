import React, {Component} from 'react';
import {Query} from 'react-apollo';
import styled from '@emotion/styled';
import {withRouter} from 'react-router-dom';

import {Loading, primaryBlue, H2} from '../../../utils/content';
import {GET_USER_INFOS, GET_PROJECT_DATA} from '../../../utils/queries';
import 'react-toastify/dist/ReactToastify.css';
import Tasks from './tasks';

const Main = styled('div')`
	padding-bottom: 80px;
	max-width: 980px;
	align-self: center;
`;

const WelcomeMessage = styled(H2)`
	color: ${primaryBlue};
	display: none;
`;

class Dashboard extends Component {
	unfinishItem = async (itemId, sectionId, unfinishItem, token) => unfinishItem({
		variables: {
			itemId,
			token,
		},
		refetchQueries: ['userTasks'],
		optimisticResponse: {
			__typename: 'Mutation',
			unfinishItem: {
				id: itemId,
				status: 'FINISHED',
			},
		},
		update: (cache, {data: {unfinishItem: unfinishedItem}}) => {
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
				e => e.id === unfinishedItem.id,
			);

			section.items[itemIndex].status = unfinishedItem.status;
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

	finishItem = async (itemId, sectionId, finishItem, token) => finishItem({
		variables: {
			itemId,
			token,
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
			window.Intercom('trackEvent', 'item-snoozed');
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

	render() {
		return (
			<Query query={GET_USER_INFOS}>
				{({client, loading, data}) => {
					if (loading) return <Loading />;

					const {me} = data;
					const {firstName} = me;

					return (
						<Main>
							<Tasks
								finishItem={this.finishItem}
								unfinishItem={this.unfinishItem}
								snoozeItem={this.snoozeItem}
							/>
						</Main>
					);
				}}
			</Query>
		);
	}
}

export default withRouter(Dashboard);
