import React, {Component} from 'react';
import {withRouter} from 'react-router-dom';
import {Query} from 'react-apollo';
import {ToastContainer, toast} from 'react-toastify';
import ReactGA from 'react-ga';

import {templates} from '../../../utils/project-templates';
import {GET_PROJECT_DATA, GET_ALL_PROJECTS} from '../../../utils/queries';
import {dateDiff} from '../../../utils/functions';
import {Loading} from '../../../utils/content';

import ProjectDisplay from '../../../components/ProjectDisplay';
import StartProjectConfirmModal from '../../../components/StartProjectConfirmModal';

class EditProject extends Component {
	constructor(props) {
		super(props);
		this.state = {
			apolloTriggerRenderTemporaryFix: false,
		};
	}

	toast = () => {
		toast.success(
			<div>
				<p>📬 Le projet a été envoyé !</p>
				<p>Retour au menu principal.</p>
			</div>,
			{
				position: toast.POSITION.TOP_RIGHT,
				autoClose: 3000,
				onClose: () => this.props.history.push(
					'/app/projects?action=project_sent',
				),
			},
		);
	};

	toastDelete = () => {
		toast.success(
			<div>
				<p>Le brouillon a été supprimé</p>
				<p>Retour au menu principal.</p>
			</div>,
			{
				position: toast.POSITION.TOP_RIGHT,
				autoClose: 1000,
				onClose: () => this.props.history.push(
					'/app/projects?action=project_removed',
				),
			},
		);
	};

	setProjectData = (templateName, EditItems) => {
		const templateData = templates.find(e => e.name === templateName);

		if (templateData) {
			const items = templateData.sections.flatMap(section => section.items.map(item => item.name));

			if (typeof EditItems === 'function') {
				EditItems({variables: {items}});
			}
		}
		else if (typeof EditItems === 'function') {
			EditItems({variables: {items: []}});
		}
	};

	startProject = (projectId, startProject, notifyCustomer) => {
		startProject({
			variables: {projectId, notifyCustomer},
			update: (cache, {data: {startProject: startedProject}}) => {
				let data;
				let updateCache = true;

				try {
					data = cache.readQuery({
						query: GET_ALL_PROJECTS,
					});
				}
				catch (e) {
					// cache does not all projects loaded so do nothing
					updateCache = false;
				}

				if (updateCache) {
					if (
						data.me
						&& data.me.company
						&& data.me.company.projects
					) {
						const updatedProject = data.me.company.projects.find(
							project => project.id === startedProject.id,
						);

						updatedProject.status = startedProject.status;
					}
				}

				const projectData = cache.readQuery({
					query: GET_PROJECT_DATA,
					variables: {projectId},
				});

				let totalItems = 0;
				let totalSections = 0;

				projectData.project.sections.forEach((section) => {
					totalSections += 1;
					section.items.forEach(() => {
						totalItems += 1;
					});
				});

				try {
					ReactGA.event({
						category: 'Project',
						action: 'Sent project',
					});
					window.$crisp.push([
						'set',
						'session:event',
						[
							[
								[
									'project_sent',
									{
										sectionsCount: totalSections,
										itemsCount: totalItems,
										elapsedTime: dateDiff(
											'd',
											new Date(
												projectData.project.createdAt,
											),
											new Date(),
										),
									},
									'blue',
								],
							],
						],
					]);

					this.toast();
					this.setState({
						showStartProjectConfirmModal: false,
					});

					if (updateCache) {
						cache.writeQuery({
							query: GET_ALL_PROJECTS,
							data,
						});
					}
				}
				catch (e) {
					throw new Error(e);
				}
			},
		});
	};

	editProjectTitle = (title, projectId, updateProject) => {
		updateProject({
			variables: {projectId, name: title},
			update: (cache, {data: {updateProject: updatedProject}}) => {
				const data = cache.readQuery({
					query: GET_PROJECT_DATA,
					variables: {projectId: this.props.match.params.projectId},
				});

				data.project.name = updatedProject.name;
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
					throw new Error(e);
				}
				this.setState({apolloTriggerRenderTemporaryFix: true});
			},
		});
	};

	addItem = (sectionId, addItemValues, addItem) => {
		const {
			name, unit, description, reviewer,
		} = addItemValues;

		addItem({
			variables: {
				sectionId,
				name,
				unit: parseFloat(unit),
				description,
				reviewer,
			},
			update: (cache, {data: {addItem: addedItem}}) => {
				const data = cache.readQuery({
					query: GET_PROJECT_DATA,
					variables: {projectId: this.props.match.params.projectId},
				});
				const section = data.project.sections.find(
					e => e.id === sectionId,
				);

				section.items.push(addedItem);
				try {
					cache.writeQuery({
						query: GET_PROJECT_DATA,
						variables: {
							projectId: this.props.match.params.projectId,
						},
						data,
					});
					window.$crisp.push([
						'set',
						'session:event',
						[[['item_added', {}, 'yellow']]],
					]);
				}
				catch (e) {
					throw new Error(e);
				}
				this.setState({apolloTriggerRenderTemporaryFix: true});
			},
		});
	};

	editItem = (itemId, sectionId, editData, updateItem) => {
		const {
			name, description, unit, reviewer,
		} = editData;

		updateItem({
			variables: {
				itemId,
				name,
				description,
				reviewer,
				unit: parseFloat(unit),
			},
			optimisticResponse: {
				__typename: 'Mutation',
				updateItem: {
					id: itemId,
					name,
					unit,
					reviewer,
					description,
					__typename: 'Item',
				},
			},
			update: (cache, {data: {updateItem: updatedItem}}) => {
				window.$crisp.push([
					'set',
					'session:event',
					[[['item_edited', {}, 'yellow']]],
				]);
				const data = cache.readQuery({
					query: GET_PROJECT_DATA,
					variables: {projectId: this.props.match.params.projectId},
				});
				const section = data.project.sections.find(
					e => e.id === sectionId,
				);
				const itemIndex = section.items.find(
					e => e.id === updatedItem.id,
				);

				section.items[itemIndex] = updatedItem;
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
					throw new Error(e);
				}
				this.setState({apolloTriggerRenderTemporaryFix: true});
			},
		});
	};

	removeItem = (itemId, sectionId, removeItem) => {
		window.$crisp.push([
			'set',
			'session:event',
			[[['item_removed', {}, 'yellow']]],
		]);
		removeItem({
			variables: {itemId},
			update: (cache, {data: {removeItem: removedItem}}) => {
				const data = cache.readQuery({
					query: GET_PROJECT_DATA,
					variables: {projectId: this.props.match.params.projectId},
				});
				const section = data.project.sections.find(
					e => e.id === sectionId,
				);
				const itemIndex = section.items.findIndex(
					e => e.id === removedItem.id,
				);

				section.items.splice(itemIndex, 1);
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
					throw new Error(e);
				}
				this.setState({apolloTriggerRenderTemporaryFix: true});
			},
		});
	};

	addSection = (projectId, addSection) => {
		addSection({
			variables: {projectId, name: 'Nouvelle section'},
			update: (cache, {data: {addSection: addedSection}}) => {
				window.$crisp.push([
					'set',
					'session:event',
					[[['section_added', {}, 'orange']]],
				]);
				const data = cache.readQuery({
					query: GET_PROJECT_DATA,
					variables: {projectId: this.props.match.params.projectId},
				});

				data.project.sections.push(addedSection);
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
					throw new Error(e);
				}
				this.setState({apolloTriggerRenderTemporaryFix: true});
			},
		});
	};

	editSectionTitle = (sectionId, name, updateSection) => {
		updateSection({
			variables: {sectionId, name},
			update: (cache, {data: {updateSection: updatedSection}}) => {
				window.$crisp.push([
					'set',
					'session:event',
					[[['section_edited', {}, 'orange']]],
				]);
				const data = cache.readQuery({
					query: GET_PROJECT_DATA,
					variables: {projectId: this.props.match.params.projectId},
				});
				const sectionIndex = data.project.sections.findIndex(
					e => e.id === sectionId,
				);

				data.project.sections[sectionIndex] = updatedSection;
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
					throw new Error(e);
				}
				this.setState({apolloTriggerRenderTemporaryFix: true});
			},
		});
	};

	removeSection = (sectionId, removeSection) => {
		removeSection({
			variables: {sectionId},
			update: (cache, {data: {removeSection: removedSection}}) => {
				window.$crisp.push([
					'set',
					'session:event',
					[[['section_removed', {}, 'orange']]],
				]);
				const data = cache.readQuery({
					query: GET_PROJECT_DATA,
					variables: {projectId: this.props.match.params.projectId},
				});
				const sectionIndex = data.project.sections.findIndex(
					e => e.id === removedSection.id,
				);

				data.project.sections.splice(sectionIndex, 1);
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
					throw new Error(e);
				}
				this.setState({apolloTriggerRenderTemporaryFix: true});
			},
		});
	};

	removeProject = (projectId, removeProject) => {
		window.$crisp.push([
			'set',
			'session:event',
			[[['project_removed', {}, 'blue']]],
		]);
		removeProject({
			variables: {projectId},
			update: (cache, {data: {removeProject: removedProject}}) => {
				const data = cache.readQuery({
					query: GET_ALL_PROJECTS,
				});

				if (data.me && data.me.company && data.me.company.projects) {
					const projectIndex = data.me.company.projects.findIndex(
						project => project.id === removedProject.id,
					);

					data.me.company.projects.splice(projectIndex, 1);
				}
				try {
					cache.writeQuery({
						query: GET_ALL_PROJECTS,
						data,
					});
					this.toastDelete();
				}
				catch (e) {
					throw new Error(e);
				}
				this.setState({apolloTriggerRenderTemporaryFix: true});
			},
		});
	};

	askForInfos = () => {
		this.setState({
			showInfoModal: true,
		});
		window.$crisp.push([
			'set',
			'session:event',
			[[['asked_for_customer_infos', {}, 'green']]],
		]);
	};

	openStartProjectModal = () => {
		this.setState({
			showStartProjectConfirmModal: true,
		});
	};

	closeStartProjectModal = () => {
		this.setState({
			showStartProjectConfirmModal: false,
		});
	};

	render() {
		const {projectId} = this.props.match.params;

		const projectTemplates = templates.map(template => ({
			value: template.name,
			label: template.label,
		}));

		projectTemplates.push({value: 'custom', label: 'Sans recommandation'});

		return (
			<Query query={GET_PROJECT_DATA} variables={{projectId}}>
				{({loading, error, data}) => {
					const fetchedData = {...data};

					if (loading || !fetchedData.project) {
						return <Loading />;
					}
					if (error) {
						throw new Error(error);
					}
					const {project} = fetchedData;

					if (this.state.apolloTriggerRenderTemporaryFix) {
						this.setState({
							apolloTriggerRenderTemporaryFix: false,
						});
					}

					const userSettings = project.issuer.owner.settings;
					const startProject = userSettings.askStartProjectConfirmation
						? this.openStartProjectModal
						: this.startProject;

					return (
						<div>
							<ToastContainer />
							<ProjectDisplay
								projectTemplates={projectTemplates}
								project={project}
								mode="edit"
								startProject={startProject}
								editProjectTitle={this.editProjectTitle}
								setProjectData={this.setProjectData}
								addItem={this.addItem}
								editItem={this.editItem}
								editSectionTitle={this.editSectionTitle}
								removeItem={this.removeItem}
								removeSection={this.removeSection}
								addSection={this.addSection}
								askForInfos={this.askForInfos}
								issuer={project.issuer}
								removeProject={this.removeProject}
								userSettings={userSettings}
							/>
							{this.state.showStartProjectConfirmModal && (
								<StartProjectConfirmModal
									askStartProject={
										project.issuer.owner.settings
											.askStartProjectConfirmation
									}
									projectId={project.id}
									startProject={this.startProject}
									closeModal={this.closeStartProjectModal}
								/>
							)}
						</div>
					);
				}}
			</Query>
		);
	}
}

export default withRouter(EditProject);
