import styled from "@emotion/styled";
import React from "react";

import CustomEmailSidebarCategory from "../CustomEmailSidebarCategory";

const CustomEmailSidebarContainer = styled("div")`
	flex: 0 0 250px;
`;

const CustomEmailSidebar = ({ categories }) => {
	return (
		<CustomEmailSidebarContainer>
			{categories.map((category, index) => (
				<CustomEmailSidebarCategory category={category} />
			))}
		</CustomEmailSidebarContainer>
	);
};

export default CustomEmailSidebar;
