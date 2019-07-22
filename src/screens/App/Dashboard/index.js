import React from 'react';
import {withRouter} from 'react-router-dom';

import CreateTask from '../../../components/CreateTask';
import HelpButton from '../../../components/HelpButton';
import {Container, Content, Main} from '../../../utils/new/design-system';
import Tasks from './tasks';

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
			<HelpButton />
			<Main>
				<Content>
					<CreateTask setProjectSelected={setProjectSelected} />
					<Tasks />
				</Content>
			</Main>
		</Container>
	);
}

export default withRouter(Dashboard);
