import styled from '@emotion/styled/macro';
import React, {Suspense} from 'react';

import CreateTask from '../../../components/CreateTask';
import HelpButton from '../../../components/HelpButton';
import PendingActionsTray from '../../../components/PendingActionsTray';
import {BREAKPOINTS} from '../../../utils/constants';
import {Container, Content, Main} from '../../../utils/new/design-system';
import Tasks from './tasks';

const Desktop = styled('div')`
	@media (max-width: ${BREAKPOINTS.mobile}px) {
		display: none;
	}
`;

function Dashboard() {
	return (
		<Container style={{minHeight: '100vh'}}>
			<HelpButton />
			<Main>
				<Content>
					<Desktop>
						<CreateTask withProject />
					</Desktop>
					<Tasks />
				</Content>
				<Suspense fallback={false}>
					<PendingActionsTray />
				</Suspense>
			</Main>
		</Container>
	);
}

export default Dashboard;
