import React from 'react';
import {useQuery, useMutation} from 'react-apollo-hooks';
import 'medium-draft/lib/index.css';

import ProjectNotes from '../ProjectNotes';

import {GET_PROJECT_PERSONAL_NOTES} from '../../utils/queries';
import {UPDATE_PROJECT_PERSONAL_NOTES} from '../../utils/mutations';
import {SubHeading} from '../../utils/new/design-system';

const ProjectPersonalNotes = ({projectId}) => {
	const {data, error} = useQuery(GET_PROJECT_PERSONAL_NOTES, {
		variables: {id: projectId},
		suspend: true,
	});
	const updateNotes = useMutation(UPDATE_PROJECT_PERSONAL_NOTES);

	if (error) throw error;

	return (
		<ProjectNotes
			notes={data.project.personalNotes}
			updateNotes={updateNotes}
			projectId={projectId}
		>
			<SubHeading>
				Ces notes sont personnelles. Votre client ne peut pas les voir.
			</SubHeading>
		</ProjectNotes>
	);
};

export default ProjectPersonalNotes;
