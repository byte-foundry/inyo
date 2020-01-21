import styled from '@emotion/styled/macro';
import React, {Suspense} from 'react';

import CreateTask from '../../../components/CreateTask';
import HelpAndTooltip from '../../../components/HelpAndTooltip';
import HelpButton from '../../../components/HelpButton';
import PendingActionsTray from '../../../components/PendingActionsTray';
import {BREAKPOINTS} from '../../../utils/constants';
import {
	Container,
	Content,
	Main,
	primaryPurple,
} from '../../../utils/new/design-system';
import Tasks from './tasks';

const Desktop = styled('div')`
	@media (max-width: ${BREAKPOINTS.mobile}px) {
		display: none;
	}
`;

const Mobile = styled('div')`
	display: none;
	width: 60px;
	height: 60px;
	position: fixed;
	right: 20px;
	bottom: 60px;
	background-color: ${primaryPurple};
	z-index: 100;
	border-radius: 50%;
	align-items: center;
	justify-content: center;

	@media (max-width: ${BREAKPOINTS.mobile}px) {
		display: flex;
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
					<Mobile>
						<HelpAndTooltip icon="add" color="white">
							<CreateTask popinTask withProject />
						</HelpAndTooltip>
					</Mobile>
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
