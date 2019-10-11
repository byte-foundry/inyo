import styled from '@emotion/styled';
import PropTypes from 'prop-types';
import React, {useState} from 'react';

import fbt from '../../fbt/fbt.macro';
import {useQuery} from '../../utils/apollo-hooks';
import {BREAKPOINTS} from '../../utils/constants';
import {P} from '../../utils/content';
import Search from '../../utils/icons/search.svg';
import templateIllus from '../../utils/images/bermuda-order-completed.svg';
import {
	Button,
	FilterInput,
	Heading,
	primaryBlack,
	primaryGrey,
	primaryPurple,
	SubHeading,
} from '../../utils/new/design-system';
import {templates} from '../../utils/project-templates';
import {GET_ALL_PROJECTS, GET_PROJECT_DATA} from '../../utils/queries';
import useUserInfos from '../../utils/useUserInfos';

const Container = styled('div')`
	display: flex;
	margin: 50px 15px;

	@media (max-width: ${BREAKPOINTS}px) {
		flex-direction: column;
	}
`;

const ProjectFilterInput = styled(FilterInput)`
	width: 200px;
	margin-top: 1em;
	margin-bottom: 0;
`;

const Column = styled('div')`
	margin-bottom: 2rem;
`;

const TemplateList = styled('ul')`
	padding: 0;
	margin-bottom: 2rem;
	flex: 0 0 300px;
`;

const TemplateItem = styled('li')`
	list-style: none;
	&::before {
		content: '—';
		color: ${primaryPurple};
		margin-right: 0.5rem;
	}

	font-size: 18px;
	cursor: pointer;
	color: ${props => (props.selected ? primaryPurple : primaryGrey)};

	&:hover {
		color: ${primaryPurple};
	}

	${Button} {
		margin: 20px 0;
	}
`;

const SectionList = styled('ul')`
	color: ${primaryBlack};
	list-style-type: none;
	font-weight: 500;
	padding: 10px 0;
`;

const SectionItemList = styled('ul')`
	list-style: none;
	font-weight: 400;
	padding: 20px 0;

	li {
		padding: 0;
		&::before {
			content: '·';
			color: ${primaryPurple};
			margin-right: 0.5rem;
		}
	}
`;

const TemplateInfo = styled('div')`
	margin-left: 4rem;
	flex: 1;

	@media (max-width: ${BREAKPOINTS}px) {
		margin-left: 0;
	}
`;

const TemplateInfoHeader = styled(Heading)`
	display: flex;
	margin-top: -1rem;
	align-items: center;
`;

const TemplateInfoIcon = styled('span')`
	font-weight: 500;
	color: ${primaryPurple};
	font-size: 1.2rem;
	line-height: 1.5;
	border: solid 2px ${primaryPurple};
	border-radius: 50%;
	width: 1.8rem;
	height: 1.8rem;
	display: flex;
	justify-content: center;
	margin: 0 1rem -0.4rem 0;

	@media (max-width: ${BREAKPOINTS}px) {
		display: none;
	}
`;

function TemplateTaskList({selectedTemplate}) {
	return (
		!!selectedTemplate && (
			<Column>
				<SubHeading>Contenu du template</SubHeading>
				<SectionList>
					{selectedTemplate.sections.map(section => (
						<li key={section.name}>
							{section.name}
							<SectionItemList>
								{section.items.map(item => (
									<li key={item.name}>{item.name}</li>
								))}
							</SectionItemList>
						</li>
					))}
				</SectionList>
			</Column>
		)
	);
}

const PROJECT_LIST_BASE_SIZE = 10;

const TemplateAndProjectFiller = ({onChoose, projectId}) => {
	const {language} = useUserInfos();
	const [selected, setSelected] = useState(null);
	const [filter, setFilter] = useState('');
	const [showAll, setShowAll] = useState(false);
	const selectedTemplate = templates[language].find(t => t.name === selected);
	const {
		data: {
			me: {projects},
		},
	} = useQuery(GET_ALL_PROJECTS, {suspend: true});
	const sanitize = str => str
		.toLowerCase()
		.normalize('NFD')
		.replace(/[\u0300-\u036f]/g, '');
	const includesFilter = str => sanitize(str).includes(sanitize(filter));
	const filteredProjects = projects.filter(
		({name, id}) => includesFilter(name) && projectId !== id,
	);
	const selectedProject = filteredProjects.find(t => t.id === selected);
	const {data: selectedProjectData} = useQuery(GET_PROJECT_DATA, {
		variables: {
			projectId: selectedProject && selectedProject.id,
		},
		skip: !selectedProject,
	});

	const listSize = showAll ? filteredProjects.length : PROJECT_LIST_BASE_SIZE;

	return (
		<Container>
			<Column>
				<SubHeading>Choisir un modèle de projet prédéfini</SubHeading>
				<TemplateList>
					{templates[language].map(({name, label}) => (
						<TemplateItem
							key={name}
							tabIndex={selected === name ? '-1' : '0'}
							onFocus={() => setSelected(name)}
							selected={selected === name}
						>
							{label}
							<br />
							{selected === name && (
								<Button
									autoFocus
									onClick={() => {
										onChoose(selectedTemplate);
									}}
								>
									Utiliser ce modèle
								</Button>
							)}
						</TemplateItem>
					))}
				</TemplateList>
				{projects && projects.length > 0 && (
					<>
						<SubHeading>
							Ou utiliser un de vos projets existants
						</SubHeading>
						<ProjectFilterInput
							icon={Search}
							name="filter"
							placeholder="Rechercher un projet"
							type="text"
							value={filter}
							onChange={e => setFilter(e.target.value)}
						/>
						<TemplateList>
							{filteredProjects
								.slice(0, listSize)
								.map(({name, id}) => (
									<TemplateItem
										key={id}
										tabIndex={selected === id ? '-1' : '0'}
										onFocus={() => setSelected(id)}
										selected={selected === id}
									>
										{name}
										<br />
										{selected === id && (
											<Button
												autoFocus
												onClick={() => {
													const sections = selectedProjectData.project.sections.map(
														section => ({
															name: section.name,
															items: section.items.map(
																({
																	name: sectionName,
																	unit,
																	description,
																	type,
																	timeItTook,
																}) => ({
																	name: sectionName,
																	unit:
																		timeItTook
																		|| unit
																		|| 0,
																	description,
																	type,
																}),
															),
														}),
													);

													onChoose({sections});
												}}
											>
												Utiliser ce modèle
											</Button>
										)}
									</TemplateItem>
								))}
						</TemplateList>
						{!showAll && filteredProjects.length > listSize && (
							<Button onClick={() => setShowAll(true)}>
								<fbt
									project="inyo"
									desc="see other projects button"
								>
									Voir{' '}
									<fbt:plural
										name="projectsCountPrefix"
										count={
											filteredProjects.length
											- PROJECT_LIST_BASE_SIZE
										}
										many="les "
									>
										l'
									</fbt:plural>
									<fbt:plural
										count={
											filteredProjects.length
											- PROJECT_LIST_BASE_SIZE
										}
										name="projectsCount"
										showCount="ifMany"
										many="autres projets"
									>
										autre projet
									</fbt:plural>
								</fbt>
							</Button>
						)}
					</>
				)}
			</Column>
			{!selectedTemplate && !selectedProject && (
				<TemplateInfo>
					<TemplateInfoHeader>
						<TemplateInfoIcon>?</TemplateInfoIcon> Modèles
						prédéfinis
					</TemplateInfoHeader>
					<P>
						Les modèles sont composés d'un ensemble de tâches
						prédéfinies. Ils vous permettront de démarrer vos
						projets sur de bonnes bases.
					</P>
					<P>
						Nous les avons construits en collaboration avec des
						freelances expérimentés dans leurs domaines (design,
						développement etc.)
					</P>
					<img alt="" src={templateIllus} />
				</TemplateInfo>
			)}
			<TemplateTaskList selectedTemplate={selectedTemplate} />
			{selectedProjectData && (
				<TemplateTaskList
					selectedTemplate={selectedProjectData.project}
				/>
			)}
		</Container>
	);
};

TemplateAndProjectFiller.defaultProps = {
	onChoose: () => {},
};

TemplateAndProjectFiller.propTypes = {
	onChoose: PropTypes.func,
};

export default TemplateAndProjectFiller;
