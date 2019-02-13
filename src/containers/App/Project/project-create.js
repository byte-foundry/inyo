import React, {Component} from 'react';
import styled from '@emotion/styled';
import {Query} from 'react-apollo';
import {Redirect, withRouter} from 'react-router-dom';

import CreateProjectForm from './create-project-form';
import {GET_USER_CUSTOMERS} from '../../../utils/queries';
import TopBar, {TopBarMenu, TopBarLogo} from '../../../components/TopBar';
import {Loading} from '../../../utils/content';
import {ReactComponent as FoldersIcon} from '../../../utils/icons/folders.svg';
import {ReactComponent as DashboardIcon} from '../../../utils/icons/dashboard.svg';
import {ReactComponent as SettingsIcon} from '../../../utils/icons/settings.svg';

const CreateProjectMain = styled('div')`
	background-color: #fbfbfb;
	min-height: 100vh;
`;

const Content = styled('div')`
	margin-left: 40px;
	margin-right: 40px;
`;

class CreateProject extends Component {
	render() {
		const {history} = this.props;

		return (
			<Query query={GET_USER_CUSTOMERS}>
				{({loading, data}) => {
					if (loading) return <Loading />;
					if (data && data.me) {
						const {customers} = data.me.company;

						return (
							<CreateProjectMain>
								<TopBar>
									<TopBarLogo>Créer votre projet</TopBarLogo>
									<TopBarMenu />
								</TopBar>

								<Content>
									<CreateProjectForm
										customers={customers}
										onCreate={(newProject) => {
											history.push(
												`/app/projects/${
													newProject.id
												}/edit`,
											);
										}}
									/>
								</Content>
							</CreateProjectMain>
						);
					}

					return <Redirect to="/auth" />;
				}}
			</Query>
		);
	}
}

export default withRouter(CreateProject);
