import React, {Component} from 'react';
import styled from 'react-emotion';
import {Query} from 'react-apollo';
import {withRouter} from 'react-router-dom';
import {GET_ALL_PROJECTS} from '../../../utils/queries';
import {
	H1,
	Button,
	primaryNavyBlue,
	primaryWhite,
	Loading,
} from '../../../utils/content';

import {ReactComponent as AccountIcon} from '../../../utils/icons/user.svg';

import SearchProjectForm from '../../../components/SearchProjectForm';
import ProjectList from '../../../components/ProjectList';

const ListProjectsMain = styled('div')`
	background-color: #fbfbfb;
	min-height: 100vh;
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

const TopBarTitle = styled(H1)`
	color: ${primaryNavyBlue};
`;

const ActionRow = styled('div')`
	display: flex;
	flex-flow: row nowrap;
	justify-content: flex-end;
	align-items: center;
`;

export const projectState = {
	DRAFT: 0,
	ONGOING: 1,
	FINISHED: 2,
};

class ListProjects extends Component {
	constructor(props) {
		super(props);
		this.state = {
			projects: undefined,
		};
	}

	createNewProject = () => {
		this.props.history.push('/app/projects/create');
	};

	render() {
		const {projects, baseProjects} = this.state;

		return (
			<Query query={GET_ALL_PROJECTS}>
				{({loading, error, data}) => {
					if (loading) return <Loading />;
					if (error) {
						throw new Error(error);
					}
					if (!projects) {
						this.setState({
							projects: data.me.company.projects,
							baseProjects: data.me.company.projects,
						});
					}

					return (
						<ListProjectsMain>
							<ListProjectsTopBar>
								<TopBarTitle>Vos projets</TopBarTitle>
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
							{projects && (
								<div>
									<SearchProjectForm
										baseProjects={baseProjects}
										sortByCustomer={(value) => {
											this.setState({
												projects:
													value === 'all'
														? baseProjects
														: baseProjects.filter(
															e => e.customer
																.name
																	=== value,
														  ),
											});
										}}
										sortByDate={(from, to) => {
											this.setState({
												projects: baseProjects.filter(
													project => (project.issuedAt
														? new Date(
															project.issuedAt,
															  )
														: new Date(
															project.createdAt,
															  )) >= from
														&& (project.issuedAt
															? new Date(
																project.issuedAt,
															  )
															: new Date(
																project.createdAt,
															  )) <= to,
												),
											});
										}}
									/>
									<ProjectList projects={projects} />
								</div>
							)}
						</ListProjectsMain>
					);
				}}
			</Query>
		);
	}
}

export default withRouter(ListProjects);
