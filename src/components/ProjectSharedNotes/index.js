import React from 'react';
import {useQuery, useMutation} from 'react-apollo-hooks';
import styled from '@emotion/styled';
import 'medium-draft/lib/index.css';

import ProjectNotes from '../ProjectNotes';

import {GET_PROJECT_SHARED_NOTES} from '../../utils/queries';
import {UPDATE_PROJECT_SHARED_NOTES} from '../../utils/mutations';
import {SubHeading, primaryRed} from '../../utils/new/design-system';

const SubHeadingRed = styled(SubHeading)`
	color: ${primaryRed};
`;

const ProjectSharedNotes = ({projectId, customerToken}) => {
	const {data, error} = useQuery(GET_PROJECT_SHARED_NOTES, {
		variables: {id: projectId, token: customerToken},
		suspend: true,
	});
	const updateNotes = useMutation(UPDATE_PROJECT_SHARED_NOTES);

	if (error) throw error;

	return (
		<ProjectNotes
			notes={data.project.sharedNotes}
			updateNotes={updateNotes}
			customerToken={customerToken}
			projectId={projectId}
		>
			<SubHeadingRed>
				Ces notes sont partagées avec votre{' '}
				{customerToken ? 'prestataire' : 'client'}.
			</SubHeadingRed>
		</ProjectNotes>
	);
};

export default ProjectSharedNotes;
