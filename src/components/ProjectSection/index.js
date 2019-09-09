import styled from '@emotion/styled';
import React, {Component} from 'react';

import fbt from '../../fbt/fbt.macro';
import {FlexRow, H5, primaryNavyBlue} from '../../utils/content';
import InlineEditable from '../InlineEditable';
import TasksList from '../TasksList';

const SectionTitle = styled(H5)`
	color: ${primaryNavyBlue};
	margin: 50px 0 25px;
`;

class ProjectSection extends Component {
	render() {
		const {data, projectId, customerToken} = this.props;

		return (
			<div>
				<FlexRow justifyContent="space-between">
					<SectionTitle>
						<InlineEditable
							value={data.name}
							type="text"
							placeholder={
								<fbt project="inyo" desc="notification message">
									Nom de la section
								</fbt>
							}
							disabled
						/>
					</SectionTitle>
				</FlexRow>
				<TasksList
					customerToken={customerToken}
					items={data.items}
					projectId={projectId}
					sectionId={data.id}
				/>
			</div>
		);
	}
}

export default ProjectSection;
