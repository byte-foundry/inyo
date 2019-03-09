import PropTypes from 'prop-types';
import React, {useState} from 'react';
import styled from '@emotion/styled/macro';

import {templates} from '../../utils/project-templates';
import {
	SubHeading,
	Button,
	primaryPurple,
	primaryGrey,
	primaryBlack,
} from '../../utils/new/design-system';

import {BREAKPOINTS} from '../../utils/constants';

const Container = styled('div')`
	display: flex;
	margin: 50px 15px;

	@media (max-width: ${BREAKPOINTS}px) {
		flex-direction: column;
	}
`;

const Column = styled('div')`
	flex: 1;
	margin-bottom: 2rem;
`;

const TemplateList = styled('ul')`
	padding: 0;
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

const TemplateFiller = ({onChoose}) => {
	const [selected, setSelected] = useState(null);
	const selectedTemplate = templates.find(t => t.name === selected);

	return (
		<Container>
			<Column>
				<SubHeading>Modèles de projet prédéfinis</SubHeading>
				<TemplateList>
					{templates.map(({name, label}) => (
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
									big
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
			</Column>

			{selectedTemplate && (
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
			)}
		</Container>
	);
};

TemplateFiller.defaultProps = {
	onChoose: () => {},
};

TemplateFiller.propTypes = {
	onChoose: PropTypes.func,
};

export default TemplateFiller;
