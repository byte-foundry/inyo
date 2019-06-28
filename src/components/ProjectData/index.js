import React, {Component} from 'react';

import {
	ProjectDataElem,
	ProjectDataLabel,
	ProjectDataMain,
} from '../../utils/content';

class ProjectData extends Component {
	render() {
		const {label, onClick, children} = this.props;

		return (
			<ProjectDataMain onClick={onClick}>
				<ProjectDataElem>
					<ProjectDataLabel>{label}</ProjectDataLabel>
					{children}
				</ProjectDataElem>
			</ProjectDataMain>
		);
	}
}

export default ProjectData;
