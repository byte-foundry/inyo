import 'medium-draft/lib/index.css';

import React from 'react';

import fbt from '../../fbt/fbt.macro';
import {useMutation, useQuery} from '../../utils/apollo-hooks';
import {UPDATE_PROJECT_PERSONAL_NOTES} from '../../utils/mutations';
import {SubHeading} from '../../utils/new/design-system';
import {GET_PROJECT_PERSONAL_NOTES} from '../../utils/queries';
import ProjectNotes from '../ProjectNotes';

const ProjectPersonalNotes = ({projectId}) => {
	const {data, error} = useQuery(GET_PROJECT_PERSONAL_NOTES, {
		variables: {id: projectId},
		suspend: true,
	});
	const [updateNotes] = useMutation(UPDATE_PROJECT_PERSONAL_NOTES);

	if (error) throw error;

	return (
		<ProjectNotes
			notes={data.project.personalNotes}
			updateNotes={updateNotes}
			projectId={projectId}
		>
			<SubHeading>
				<fbt project="inyo" desc="Project personal notes heading">
					Ces notes sont personnelles. Votre client ne peut pas les
					voir.
				</fbt>
			</SubHeading>
		</ProjectNotes>
	);
};

export default ProjectPersonalNotes;
