import React, {Component} from 'react';
import styled from 'react-emotion';
import {Query} from 'react-apollo';
import {withRouter} from 'react-router-dom';

import {GET_ALL_PROJECTS} from '../../../utils/queries';
import TopBar, {
	TopBarNavigation,
	TopBarButton,
	TopBarTitle,
} from '../../../components/TopBar';
import {Loading} from '../../../utils/content';

import {ReactComponent as DashboardIcon} from '../../../utils/icons/dashboard.svg';
// import {ReactComponent as UsersIcon} from '../../../utils/icons/users.svg';
import {ReactComponent as SettingsIcon} from '../../../utils/icons/settings.svg';

import SearchProjectForm from '../../../components/SearchProjectForm';
import ProjectList from '../../../components/ProjectList';

const ListProjectsMain = styled('div')`
	background-color: #fbfbfb;
	min-height: 100vh;
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
							<TopBar>
								<TopBarTitle>Vos projets</TopBarTitle>
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
