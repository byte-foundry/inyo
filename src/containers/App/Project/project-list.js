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
	state = {
		customerFilter: null,
		dateFilter: null,
	};

	render() {
		const {dateFilter, customerFilter} = this.state;

		return (
			<Query query={GET_ALL_PROJECTS}>
				{({loading, error, data}) => {
					if (loading) return <Loading />;
					if (error) throw error;

					let {projects} = data.me.company;

					// order by creation date
					projects.sort(
						(a, b) => new Date(b.createdAt) - new Date(a.createdAt),
					);

					// filter with customer name
					if (customerFilter) {
						projects = projects.filter(
							project => project.customer.name === customerFilter,
						);
					}

					// filter between two dates
					if (dateFilter) {
						projects = projects.filter(
							project => (project.issuedAt
								? new Date(project.issuedAt)
								: new Date(project.createdAt))
									>= dateFilter.from
								&& (project.issuedAt
									? new Date(project.issuedAt)
									: new Date(project.createdAt))
									<= dateFilter.to,
						);
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
										baseProjects={projects}
										filterByCustomer={(value) => {
											this.setState({
												customerFilter:
													value === 'all'
														? null
														: value,
											});
										}}
										filterByDate={(from, to) => {
											this.setState({
												dateFilter: {
													from,
													to,
												},
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
