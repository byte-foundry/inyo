import {css} from '@emotion/core';
import styled from '@emotion/styled';
import React from 'react';
import {useMutation, useQuery} from 'react-apollo-hooks';

import {BREAKPOINTS} from '../../utils/constants';
import Pencil from '../../utils/icons/pencil.svg';
import {UPDATE_PROJECT} from '../../utils/mutations';
import {
	accentGrey,
	lightGrey,
	lightRed,
	primaryBlack,
} from '../../utils/new/design-system';
import {GET_PROJECT_INFOS} from '../../utils/queries';
import InlineEditable from '../InlineEditable';
import TasksProgressBar from '../TasksProgressBar';

const ProjectHeaderContainer = styled('div')`
	margin-bottom: 4rem;

	@media (max-width: ${BREAKPOINTS}px) {
		margin-bottom: 1rem;
	}
`;

const ProjectHeading = styled(InlineEditable)`
	color: ${primaryBlack};
	font-size: 2rem;
	margin-bottom: 1rem;

	${props => props.missingTitle
		&& `
		&:before {
			content: '';
			display: block;
			background: ${lightRed};
			position: absolute;
			left: -1rem;
			top: 0;
			right: -0.5rem;
			bottom: 0;
			border-radius: 8px;
			z-index: -1;
		}
	`}

	${props => !props.disabled
		&& `
		&:hover {
			cursor: text;

			&:before {
				content: '';
				display: block;
				background: ${lightGrey};
				position: absolute;
				left: -1rem;
				top: 0;
				right: -0.5rem;
				bottom: 0;
				border-radius: 8px;
				z-index: -1;
			}
			&:after {
				content: '';
				display: block;
				background-color: ${accentGrey};
				mask-size: 35%;
				mask-position: center;
				mask-repeat: no-repeat;
				mask-image: url(${Pencil});
				position: absolute;
				top: 0;
				right: 0;
				bottom: 0;
				width: 50px;
			}
		}
	`}

	@media (max-width: ${BREAKPOINTS}px) {
		font-size: 1rem;
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

const editableCss = css`
	padding: 0;
	line-height: 1.5;
	display: block;
`;

export default function ProjectHeader({projectId, customerToken}) {
	const token = customerToken === 'preview' ? undefined : customerToken;
	const {data, error} = useQuery(GET_PROJECT_INFOS, {
		variables: {projectId, token},
		suspend: true,
	});
	const [updateProject] = useMutation(UPDATE_PROJECT);

	if (error) throw error;

	const {project} = data;

	return (
		<ProjectHeaderContainer>
			<ProjectHeading
				placeholder="Ajouter un titre à ce projet"
				value={project.name}
				placeholderCss={placeholderCss}
				nameCss={nameCss}
				editableCss={editableCss}
				disabled={customerToken}
				missingTitle={
					project.name === 'Nom du projet' || project.name === ''
				}
				onFocusOut={(value) => {
					if (value) {
						updateProject({
							variables: {
								projectId,
								name: value,
							},
						});
					}
				}}
			/>
			<TasksProgressBar project={project} customerToken={customerToken} />
		</ProjectHeaderContainer>
	);
}
