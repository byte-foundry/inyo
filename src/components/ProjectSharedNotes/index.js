import 'medium-draft/lib/index.css';

import styled from '@emotion/styled';
import React from 'react';
import {useMutation, useQuery} from 'react-apollo-hooks';

import fbt from '../../fbt/fbt.macro';
import {UPDATE_PROJECT_SHARED_NOTES} from '../../utils/mutations';
import {primaryRed, SubHeading} from '../../utils/new/design-system';
import {GET_PROJECT_SHARED_NOTES} from '../../utils/queries';
import ProjectNotes from '../ProjectNotes';

const SubHeadingRed = styled(SubHeading)`
	color: ${primaryRed};
`;

const ProjectSharedNotes = ({projectId, customerToken}) => {
	const {data, error} = useQuery(GET_PROJECT_SHARED_NOTES, {
		variables: {id: projectId, token: customerToken},
		suspend: true,
	});
	const [updateNotes] = useMutation(UPDATE_PROJECT_SHARED_NOTES);

	if (error) throw error;

	return (
		<ProjectNotes
			notes={data.project.sharedNotes}
			updateNotes={updateNotes}
			customerToken={customerToken}
			projectId={projectId}
		>
			<SubHeadingRed>
				<fbt project="inyo" desc="shared notes placeholder">
					Ces notes sont partagées avec votre{' '}
					<fbt:param name="otherUserName">
						{customerToken ? (
							<fbt project="inyo" desc="contractor">
								prestataire
							</fbt>
						) : (
							<fbt project="inyo" desc="customer">
								client
							</fbt>
						)}
					</fbt:param>.
				</fbt>
			</SubHeadingRed>
		</ProjectNotes>
	);
};

export default ProjectSharedNotes;
