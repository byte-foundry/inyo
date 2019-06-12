import React from 'react';
import {withRouter} from 'react-router-dom';

import 'react-toastify/dist/ReactToastify.css';
import Tasks from './tasks';
import CreateTask from '../../../components/CreateTask';
import SidebarDashboardInfos from '../../../components/SidebarDashboardInfos';
import Tooltip from '../../../components/Tooltip';

import {
	Main, Container, Content, Help,
} from '../../../utils/new/design-system';

function Dashboard({history}) {
	const setProjectSelected = (selected, removeCustomer) => {
		const newQuery = new URLSearchParams();

		if (selected) {
			const {value: selectedProjectId} = selected;

			newQuery.set('projectId', selectedProjectId);
		}
		else if (newQuery.has('projectId')) {
			newQuery.delete('projectId');
		}

		if (removeCustomer) {
			newQuery.delete('customerId');
		}

		history.push(`/app/tasks?${newQuery.toString()}`);
	};

	return (
		<Container>
			<Tooltip label="Instructions pour utiliser l'interface">
				<Help
					customerToken
					onClick={() => history.push('/app/tasks?openHelpModal=true')
					}
					id="help-button"
				>
					?
				</Help>
			</Tooltip>
			<Main>
				<Content>
					<CreateTask setProjectSelected={setProjectSelected} />
					<Tasks />
				</Content>
				<SidebarDashboardInfos baseUrl="app/dashboard" />
			</Main>
		</Container>
	);
}

export default withRouter(Dashboard);
