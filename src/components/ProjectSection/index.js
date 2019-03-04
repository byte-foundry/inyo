import React, {Component} from 'react';
import styled from '@emotion/styled';

import InlineEditable from '../InlineEditable';
import TasksList from '../TasksList';
import {H5, FlexRow, primaryNavyBlue} from '../../utils/content';

const SectionTitle = styled(H5)`
	color: ${primaryNavyBlue};
	margin: 50px 0 25px;
`;

class ProjectSection extends Component {
	render() {
		const {data, projectId} = this.props;

		return (
			<div>
				<FlexRow justifyContent="space-between">
					<SectionTitle>
						<InlineEditable
							value={data.name}
							type="text"
							placeholder="Nom de la section"
							disabled
						/>
					</SectionTitle>
				</FlexRow>
				<TasksList
					items={data.items}
					projectId={projectId}
					sectionId={data.id}
				/>
			</div>
		);
	}
}

export default ProjectSection;
