import React, {useContext} from 'react';
import styled from '@emotion/styled';
import {useQuery} from 'react-apollo-hooks';
import {css} from '@emotion/core';

import Task from '../TasksList/task';

import {GET_PROJECT_DATA_WITH_TOKEN} from '../../utils/queries';
import {CustomerContext} from '../../utils/contexts';
import {LayoutMainElem, primaryBlack} from '../../utils/new/design-system';
import InlineEditable from '../InlineEditable';

import {BREAKPOINTS} from '../../utils/constants';

const TasksListContainer = styled(LayoutMainElem)`
	margin-top: 0;
`;

const SectionTitle = styled(InlineEditable)`
	margin: 3rem 14px 2rem;
	font-weight: 500;
	color: ${primaryBlack};
	border: 1px solid transparent;
	cursor: text;
	position: relative;
	padding: 0.5rem 0;
	display: block;

	&:first-child {
		margin-top: 0;
	}

	@media (max-width: ${BREAKPOINTS}px) {
		margin: 0.5rem 0 0 0;
	}
`;

const placeholderCss = css`
	font-style: italic;
	padding: 0;
	display: block;
	line-height: 1.5;
`;

const nameCss = css`
	padding: 0;
	display: block;
	line-height: 1.5;
`;

function ProjectTasksList({items, projectId, sectionId}) {
	const customerToken = useContext(CustomerContext);
	const token = customerToken === 'preview' ? undefined : customerToken;
	const {data, error} = useQuery(GET_PROJECT_DATA_WITH_TOKEN, {
		variables: {projectId, token},
		suspend: true,
	});

	if (error) throw error;

	const {sections: sectionsInfos} = data.project;

	const sections = sectionsInfos.map((section) => {
		const itemsInSection = items.filter(i => i.section.id === section.id);

		itemsInSection.sort((a, b) => a.position - b.position);

		return {
			...section,
			items: itemsInSection,
		};
	});

	return (
		<TasksListContainer>
			{sections.map(section => (
				<>
					<SectionTitle
						disabled
						placeholder="Nom de la section"
						value={section.name}
						placeholderCss={placeholderCss}
						nameCss={nameCss}
					/>
					{section.items.map((task, itemIndex) => (
						<Task
							item={task}
							key={task.id}
							index={itemIndex}
							task={task}
							projectId={projectId}
							sectionId={sectionId}
							isDraggable
							customerToken={customerToken}
						/>
					))}
				</>
			))}
		</TasksListContainer>
	);
}

export default ProjectTasksList;
