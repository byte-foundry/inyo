import React from 'react';
import styled from '@emotion/styled';

import CustomerTasks from '../../containers/App/CustomerTasks/tasks';

const Container = styled('div')`
	padding: 3rem;
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
