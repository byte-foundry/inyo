import styled from '@emotion/styled';
import React from 'react';
import {useQuery} from 'react-apollo-hooks';

import {BREAKPOINTS} from '../../utils/constants';
import {Loading} from '../../utils/content';
import {isCustomerTask} from '../../utils/functions';
import {Label, primaryBlack, primaryRed} from '../../utils/new/design-system';
import {templates} from '../../utils/project-templates';
import {GET_PROJECT_DATA} from '../../utils/queries';

const Column = styled('div')``;

const InfoNoSections = styled(Column)`
	font-style: italic;
	margin-left: 1rem;
`;

const TemplateColumnLabel = styled(Label)`
	font-size: 12px;
	margin-left: 1rem;
	margin-bottom: 0.8rem;
`;

const SectionList = styled('ul')`
	color: ${primaryBlack};
	list-style-type: none;
	font-weight: 500;
	padding: 10px 0;
	margin-left: 1rem;
	margin-top: 0;
`;

const SectionItemList = styled('ul')`
	list-style: none;
	font-weight: 400;
	padding: 20px 0;

	li {
		padding: 0;
		padding-left: 1rem;
		position: relative;
		margin-bottom: 5px;

		&::before {
			content: '•';
			position: absolute;
			top: -4px;
			left: 0;
			font-size: 1.2rem;
		}
	}
`;

const Li = styled('li')`
	${props => isCustomerTask(props.type)
		&& `
		&::before {
			color: ${primaryRed};
		}
	`}
`;

const Container = styled('div')`
	display: flex;
	flex-direction: column;
	position: absolute;
	top: 0;
	background: white;
	left: 100%;
	width: 20vw;
	padding: 2rem;
	margin-left: 3rem;

	@media (max-width: ${BREAKPOINTS}px) {
		position: static;
		width: initial;
		margin: 0;
	}
`;

function TemplateTaskList({selectedTemplate}) {
	return (
		!!selectedTemplate
		&& !!selectedTemplate.sections
		&& (selectedTemplate.sections.length === 0 ? (
			<InfoNoSections>
				Il n'y a pas de tâche dans ce projet
			</InfoNoSections>
		) : (
			<Column>
				<SectionList>
					{selectedTemplate.sections.map(section => (
						<li key={section.name}>
							{section.name}
							<SectionItemList>
								{section.items.map(item => (
									<Li type={item.type} key={item.name}>
										{item.name}
									</Li>
								))}
							</SectionItemList>
						</li>
					))}
				</SectionList>
			</Column>
		))
	);
}

const CreateProjectModalViewContent = ({content}) => {
	console.log(content);
	const selectedTemplate = templates.find(tplt => tplt.name === content);

	const isTemplate = !!selectedTemplate;
	const {data, loading} = useQuery(GET_PROJECT_DATA, {
		variables: {
			projectId: content,
		},
		skip: isTemplate,
	});

	if (!isTemplate && !loading) {
		return (
			<Container>
				<TemplateColumnLabel>Contenu du projet</TemplateColumnLabel>
				{loading ? (
					<Loading />
				) : (
					<TemplateTaskList selectedTemplate={data.project} />
				)}
			</Container>
		);
	}

	return (
		<Container>
			<TemplateColumnLabel>Contenu du modèle</TemplateColumnLabel>
			<TemplateTaskList selectedTemplate={selectedTemplate} />
		</Container>
	);
};

export default CreateProjectModalViewContent;
