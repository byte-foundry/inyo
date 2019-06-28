import styled from '@emotion/styled';
import React, {Component} from 'react';

import {
	H4,
	primaryNavyBlue,
	ProjectDataElem,
	ProjectDataLabel,
	ProjectDataMain,
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
