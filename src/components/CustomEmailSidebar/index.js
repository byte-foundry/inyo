import React from "react";

import CustomEmailSidebarCategory from "../CustomEmailSidebarCategory";

const CustomEmailSidebar = ({ categories }) => {
	return (
		<div>
			{categories.map((category, index) => (
				<CustomEmailSidebarCategory category={category} />
			))}
		</div>
	);
};

export default CustomEmailSidebar;
