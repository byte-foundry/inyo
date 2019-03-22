import React from 'react';
import styled from '@emotion/styled';

import CustomerTasks from '../../screens/Customer/Tasks/tasks';
import {BREAKPOINTS} from '../../utils/constants';

const Container = styled('div')`
	padding: 3rem;

	@media (max-width: ${BREAKPOINTS}px) {
		padding: 1rem;
	}
`;

const StaticCustomerView = ({projectId}) => (
	<Container>
		<CustomerTasks
			projectId={projectId}
			customerToken="preview"
			style={{pointerEvents: 'none', minHeight: 'auto'}}
		/>
	</Container>
);

export default StaticCustomerView;
