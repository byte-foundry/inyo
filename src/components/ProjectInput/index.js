import React, {Component} from 'react';
import styled from '@emotion/styled';

import {
	H4,
	primaryNavyBlue,
	ProjectDataMain,
	ProjectDataElem,
	ProjectDataLabel,
} from '../../utils/content';

const TotalNumber = styled(H4)`
	color: ${primaryNavyBlue};
	margin: 0;
`;

class ProjectData extends Component {
	render() {
		const {
			sumDays, label, counter, onClick,
		} = this.props;

		return (
			<ProjectDataMain onClick={onClick}>
				<ProjectDataElem>
					<ProjectDataLabel>{label}</ProjectDataLabel>
					<TotalNumber>
						{sumDays} {counter}
					</TotalNumber>
				</ProjectDataElem>
			</ProjectDataMain>
		);
	}
}

export default ProjectData;
