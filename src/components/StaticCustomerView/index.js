import styled from '@emotion/styled';
import React, {Suspense} from 'react';

import CustomerTasks from '../../screens/Customer/Tasks/tasks';
import {BREAKPOINTS} from '../../utils/constants';
import {Loading} from '../../utils/content';
import {CustomerContext} from '../../utils/contexts';

const Container = styled('div')`
	padding: 3rem;

	@media (max-width: ${BREAKPOINTS.mobile}px) {
		padding: 1rem;
	}
`;

const StaticCustomerView = ({projectId}) => (
	<CustomerContext.Provider value="preview">
		<Container>
			<Suspense fallback={<Loading />}>
				<CustomerTasks
					projectId={projectId}
					style={{pointerEvents: 'none', minHeight: 'auto'}}
				/>
			</Suspense>
		</Container>
	</CustomerContext.Provider>
);

export default StaticCustomerView;
