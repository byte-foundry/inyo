import React, {useEffect} from 'react';
import styled from '@emotion/styled';
import {useQuery} from 'react-apollo-hooks';

import FormSelect from '../FormSelect';

import {templates} from '../../utils/project-templates';
import {
	Button,
	Label,
	SubHeading,
	primaryPurple,
	primaryBlack,
	primaryRed,
	BackButton,
} from '../../utils/new/design-system';
import {GET_PROJECT_DATA} from '../../utils/queries';
import {Loading} from '../../utils/content';

const TemplateSubHeading = styled(SubHeading)`
	margin-bottom: 1.5rem;
`;

const TemplateContent = styled('div')`
	display: flex;
	margin-left: -1rem;
`;

const Column = styled('div')`
	margin-bottom: 2rem;
`;

const InfoNoSections = styled(Column)`
	font-style: italic;
	margin-left: 1rem;
`;

const TemplateButton = styled(Button)`
	margin-top: 1rem;
`;

const TemplateColumnSmall = styled('div')`
	flex: 0.6;
`;

const TemplateColumn = styled('div')`
	flex: 1;
	font-size: 13px;
	position: relative;
	margin-left: 0.5rem;
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

const isCustomerTask = type => ['CUSTOMER', 'CONTENT_ACQUISITION', 'VALIDATION'].includes(type);

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

export default function ({back, optionsProjects, ...props}) {
	const {
		data: {project},
		loading,
		error,
	} = useQuery(GET_PROJECT_DATA, {
		variables: {
			projectId:
				props.values.modelProjectTemp || props.values.modelProject,
		},
	});

	let content;

	const type = props.values.source;

	useEffect(() => {
		props.setFieldValue('modelTemplateTemp', props.values.modelTemplate);
		props.setFieldValue('modelProjectTemp', props.values.modelProject);
	}, []);

	if (type === 'MODELS') {
		content = templates.find(
			tplt => tplt.name === props.values.modelTemplateTemp,
		);
	}
	else if (type === 'PROJECTS') {
		content = project;
	}

	return (
		<Container>
			<BackButton withMargin grey type="button" link onClick={back}>
				Retour
			</BackButton>
			{type === 'MODELS' && (
				<>
					<TemplateSubHeading>
						Choisir un de nos modèles
					</TemplateSubHeading>
					<TemplateContent>
						<TemplateColumnSmall>
							<FormSelect
								{...props}
								name="modelTemplateTemp"
								label="Titre du modèle"
								big
								options={templates.map(template => ({
									value: template.name,
									label: template.label,
								}))}
							/>
							<TemplateButton
								onClick={() => {
									props.setFieldValue(
										'modelTemplate',
										props.values.modelTemplateTemp,
									);
									back();
								}}
							>
								Choisir ce modèle
							</TemplateButton>
						</TemplateColumnSmall>
						<TemplateColumn>
							<TemplateColumnLabel>
								Contenu du modèle
							</TemplateColumnLabel>
							<TemplateTaskList selectedTemplate={content} />
						</TemplateColumn>
					</TemplateContent>
				</>
			)}
			{type === 'PROJECTS' && (
				<>
					<TemplateSubHeading>
						Choisir un de vos projets
					</TemplateSubHeading>
					<TemplateContent>
						<TemplateColumnSmall>
							<FormSelect
								{...props}
								name="modelProjectTemp"
								label="Titre du projet"
								big
								options={optionsProjects}
							/>
							<TemplateButton
								onClick={() => {
									props.setFieldValue(
										'modelProject',
										props.values.modelProjectTemp,
									);
									back();
								}}
							>
								Choisir ce projet
							</TemplateButton>
						</TemplateColumnSmall>
						<TemplateColumn>
							<TemplateColumnLabel>
								Contenu du projet
							</TemplateColumnLabel>
							{loading ? (
								<Loading />
							) : (
								<TemplateTaskList selectedTemplate={content} />
							)}
						</TemplateColumn>
					</TemplateContent>
				</>
			)}
		</Container>
	);
}
