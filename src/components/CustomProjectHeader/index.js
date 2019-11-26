import styled from '@emotion/styled';
import React from 'react';

import {useQuery} from '../../utils/apollo-hooks';
import {BREAKPOINTS} from '../../utils/constants';
import {primaryBlack} from '../../utils/new/design-system';
import {GET_PROJECT_INFOS} from '../../utils/queries';
import TasksProgressBar from '../TasksProgressBar';

const Container = styled('div')`
	background: url(${props => props.backgroundUrl});
	background-size: cover;
	padding: 7rem;
	margin: -3rem -3rem 4rem -3rem;

	@media (max-width: ${BREAKPOINTS.mobile}px) {
		margin-bottom: 1rem;
	}
`;

const ContentContainer = styled('div')`
	max-width: 1280px;
	margin: auto;
`;

const Heading = styled('span')`
	color: ${primaryBlack};
	font-size: 2rem;
	margin-bottom: 1rem;
	background: rgba(255, 255, 255, 0.8);
	padding: 0 5px;
	display: inline-block;
	border-radius: 10px;

	@media (max-width: ${BREAKPOINTS.mobile}px) {
		font-size: 1rem;
	}
`;

const CustomProjectHeader = ({projectId, customerToken}) => {
	const token = customerToken === 'preview' ? undefined : customerToken;
	const {data, error} = useQuery(GET_PROJECT_INFOS, {
		variables: {projectId, token},
		suspend: true,
	});

	if (error) throw error;

	const {project} = data;

	return (
		<Container
			backgroundUrl={project.issuer.banner && project.issuer.banner.url}
		>
			<ContentContainer>
				<Heading>{project.name}</Heading>
				<TasksProgressBar
					project={project}
					customerToken={customerToken}
				/>
			</ContentContainer>
		</Container>
	);
};

export default CustomProjectHeader;
