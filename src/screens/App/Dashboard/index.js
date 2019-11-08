import React, {Suspense} from 'react';

import CreateTask from '../../../components/CreateTask';
import HelpButton from '../../../components/HelpButton';
import PendingActionsTray from '../../../components/PendingActionsTray';
import {Container, Content, Main} from '../../../utils/new/design-system';
import Tasks from './tasks';

function Dashboard() {
	return (
		<Container style={{minHeight: '100vh'}}>
			<HelpButton />
			<Main>
				<Content>
					<CreateTask withProject />
					<Tasks />
				</Content>
				<Suspense fallback={null}>
					<PendingActionsTray />
				</Suspense>
			</Main>
		</Container>
	);
}

export default Dashboard;
