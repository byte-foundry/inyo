import React from 'react';

import {
	ProjectDataElem,
	ProjectDataLabel,
	ProjectDataMain,
} from '../../utils/content';

const ProjectData = ({label, onClick, children}) => (
	<ProjectDataMain onClick={onClick}>
		<ProjectDataElem>
			<ProjectDataLabel>{label}</ProjectDataLabel>
			{children}
		</ProjectDataElem>
	</ProjectDataMain>
);

export default ProjectData;
