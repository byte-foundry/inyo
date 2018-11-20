import React, {Component} from 'react';
import styled from 'react-emotion';
import {Query} from 'react-apollo';
import {Redirect, withRouter} from 'react-router-dom';

import CreateProjectForm from './create-project-form';
import {GET_USER_CUSTOMERS} from '../../../utils/queries';
import {gray50, Button, Loading} from '../../../utils/content';

const CreateProjectMain = styled('div')`
	margin-left: 40px;
	margin-right: 40px;
`;

const BackButton = styled(Button)`
	padding: 10px 5px;
	font-size: 11px;
	margin: 10px 0 10px 0;
	color: ${gray50};
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
								<BackButton
									theme="Link"
									size="XSmall"
									onClick={() => this.props.history.push('/app/projects')
									}
								>
									Retour à la liste des projets
								</BackButton>
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
