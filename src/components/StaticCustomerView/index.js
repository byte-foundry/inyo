import React from 'react';
import styled from '@emotion/styled';

import CustomerTasks from '../../screens/Customer/Tasks/tasks';
import {BREAKPOINTS} from '../../utils/constants';
import {CustomerContext} from '../../utils/contexts';

const Container = styled('div')`
	padding: 3rem;

	@media (max-width: ${BREAKPOINTS}px) {
		padding: 1rem;
	}
`;

const StaticCustomerView = ({projectId}) => (
	<CustomerContext.Provider value="preview">
		<Container>
			<CustomerTasks
				projectId={projectId}
				style={{pointerEvents: 'none', minHeight: 'auto'}}
			/>
		</Container>
	</CustomerContext.Provider>
);

export default StaticCustomerView;
