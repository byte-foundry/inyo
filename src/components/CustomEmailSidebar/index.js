import styled from '@emotion/styled';
import React from 'react';

import CustomEmailSidebarCategory from '../CustomEmailSidebarCategory';

const CustomEmailSidebarContainer = styled('div')`
	flex: 0 0 250px;
	margin-right: 2rem;
	margin-top: 2rem;
`;

const CustomEmailSidebar = ({categories}) => (
	<CustomEmailSidebarContainer>
		{categories.map((category, index) => (
			<CustomEmailSidebarCategory category={category} />
		))}
	</CustomEmailSidebarContainer>
);

export default CustomEmailSidebar;
