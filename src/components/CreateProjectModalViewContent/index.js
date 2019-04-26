import React from 'react';
import styled from '@emotion/styled';
import {useQuery} from 'react-apollo-hooks';

import FormSelect from '../FormSelect';

import {templates} from '../../utils/project-templates';
import {
	Button,
	DateContainer,
	BigNumber,
	Label,
	InputLabel,
	SubHeading,
} from '../../utils/new/design-system';
import {GET_PROJECT_DATA} from '../../utils/queries';

export default function ({...props}) {
	const {data, loading, error} = useQuery(GET_PROJECT_DATA);

	let content;

	if (props.values.source === 'MODELS') {
		content = templates.find(
			tplt => tplt.name === props.values.modelTemplate,
		);
	}

	return (
		<>
			<SubHeading>Choisir un de nos modèles</SubHeading>
			<div>
				<FormSelect
					{...props}
					name="modelTemplate"
					label="Titre du modèle"
					options={templates.map(template => ({
						value: template.name,
						label: template.label,
					}))}
				/>
				<Button>Choisir ce modèle</Button>
			</div>
			<div>
				{content
					&& content.sections.map(section => (
						<div>
							{section.name}
							{section.items.map(item => (
								<div>{item.name}</div>
							))}
						</div>
					))}
			</div>
		</>
	);
}
