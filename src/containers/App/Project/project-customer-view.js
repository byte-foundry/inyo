import React, {Component} from 'react';
import {Query} from 'react-apollo';
import {ToastContainer, toast} from 'react-toastify';
import {Route} from 'react-router-dom';

import {GET_PROJECT_DATA_WITH_TOKEN} from '../../../utils/queries';
import ItemView from '../../../components/ItemView';
import {
	Loading,
	ModalContainer as Modal,
	ModalElem,
} from '../../../utils/content';

import ProjectDisplay from '../../../components/ProjectDisplay';

class ProjectCustomerView extends Component {
	constructor(props) {
		super(props);
		this.state = {mode: 'proposal', isCrispLoggedIn: false};
	}

	acceptOrRejectAmendment = async (
		projectId,
		token,
		acceptOrRejectAmendment,
	) => acceptOrRejectAmendment({
		variables: {
			projectId,
			token,
		},
		update: (cache, {data: {acceptAmendment, rejectAmendment}}) => {
			const amendment = acceptAmendment || rejectAmendment;
			const data = cache.readQuery({
				query: GET_PROJECT_DATA_WITH_TOKEN,
				variables: {
					projectId: this.props.match.params.projectId,
					token: this.props.match.params.customerToken,
				},
			});

			data.project = amendment;

			try {
				cache.writeQuery({
					query: GET_PROJECT_DATA_WITH_TOKEN,
					variables: {
						projectId: this.props.match.params.projectId,
						token: this.props.match.params.customerToken,
					},
					data,
				});
			}
			catch (e) {
				throw new Error(e);
			}
			toast.info(
				<div>
					<p>📬 Le prestataire a été notifié.</p>
				</div>,
				{
					position: toast.POSITION.TOP_RIGHT,
					autoClose: 3000,
				},
			);
			this.setState({apolloTriggerRenderTemporaryFix: true});
		},
	});

	acceptOrRejectProject = async (projectId, token, acceptOrRejectProject) => acceptOrRejectProject({
		variables: {
			projectId,
			token,
		},
		update: (cache, {data: {acceptProject, rejectProject}}) => {
			const project = acceptProject || rejectProject;

			const data = cache.readQuery({
				query: GET_PROJECT_DATA_WITH_TOKEN,
				variables: {
					projectId: this.props.match.params.projectId,
					token: this.props.match.params.customerToken,
				},
			});

			data.project.status = project.status;

			try {
				cache.writeQuery({
					query: GET_PROJECT_DATA_WITH_TOKEN,
					variables: {
						projectId: this.props.match.params.projectId,
						token: this.props.match.params.customerToken,
					},
					data,
				});
			}
			catch (e) {
				throw new Error(e);
			}
			toast.info(
				<div>
					<p>📬 Le prestataire a été notifié.</p>
				</div>,
				{
					position: toast.POSITION.TOP_RIGHT,
					autoClose: 3000,
				},
			);
			this.setState({apolloTriggerRenderTemporaryFix: true});
		},
	});

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
			const data = cache.readQuery({
				query: GET_PROJECT_DATA_WITH_TOKEN,
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
					query: GET_PROJECT_DATA_WITH_TOKEN,
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
		const {projectId, customerToken} = this.props.match.params;

		return (
			<Query
				query={GET_PROJECT_DATA_WITH_TOKEN}
				variables={{projectId, token: customerToken}}
				fetchPolicy="network-only"
			>
				{({
					loading, error, data, refetch,
				}) => {
					if (loading) return <Loading />;
					if (error) {
						throw new Error(error);
					}
					const {project} = data;

					const totalItems = project.sections.reduce(
						(sumItems, section) => sumItems + section.items.length,
						0,
					);

					const totalItemsFinished = project.sections.reduce(
						(sumItems, section) => sumItems
							+ section.items.filter(
								item => item.status === 'FINISHED',
							).length,
						0,
					);

					const timePlanned = project.sections.reduce(
						(timeSectionSum, section) => timeSectionSum
							+ section.items.reduce(
								(itemSum, item) => itemSum + item.unit,
								0,
							),
						0,
					);

					if (!this.state.isCrispLoggedIn && data.project.customer) {
						window.$crisp.push([
							'set',
							'user:email',
							[data.project.customer.email],
						]);
						window.$crisp.push([
							'set',
							'user:nickname',
							[
								`${data.project.customer.firstName} ${
									data.project.customer.lastName
								} (${data.project.customer.name})`,
							],
						]);
						window.$crisp.push([
							'set',
							'session:segments',
							[['customer']],
						]);
					}

					return (
						<div>
							<ToastContainer />
							<ProjectDisplay
								project={project}
								issuer={data.project.issuer}
								project={data.project}
								totalItems={totalItems}
								totalItemsFinished={totalItemsFinished}
								timePlanned={timePlanned}
								finishItem={this.finishItem}
								refetch={refetch}
								acceptOrRejectAmendment={
									this.acceptOrRejectAmendment
								}
								acceptOrRejectProject={
									this.acceptOrRejectProject
								}
								mode="see"
							/>
							<Route
								path="/app/projects/:projectId/view/:customerToken/items/:itemId"
								render={({match, history}) => (
									<Modal
										onDismiss={() => history.push(
											`/app/projects/${projectId}/view/${customerToken}`,
										)
										}
									>
										<ModalElem>
											<ItemView
												id={match.params.itemId}
												customerToken={customerToken}
												finishItem={this.finishItem}
												projectUrl={`/app/projects/${projectId}/view/${customerToken}`}
											/>
										</ModalElem>
									</Modal>
								)}
							/>
						</div>
					);
				}}
			</Query>
		);
	}
}

export default ProjectCustomerView;
