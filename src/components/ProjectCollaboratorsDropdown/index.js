import React from 'react';

import {useQuery} from '../../utils/apollo-hooks';
import {formatName} from '../../utils/functions';
import {GET_PROJECT_COLLAB_LINK} from '../../utils/queries';
import {ArianneElem} from '../ArianneThread';

const ProjectCollaboratorsDropdown = ({projectId, ...props}) => {
	const {data, loading, errors} = useQuery(GET_PROJECT_COLLAB_LINK, {
		variables: {
			id: projectId,
		},
		skip: !projectId,
	});

	if (!projectId || loading) {
		return <ArianneElem list={[]} {...props} />;
	}

	if (errors) throw errors;

	const collaborators = data.project.linkedCollaborators.map(
		collaborator => ({
			...collaborator,
			name: formatName(collaborator.firstName, collaborator.lastName),
		}),
	);

	return <ArianneElem list={collaborators} {...props} />;
};

export default ProjectCollaboratorsDropdown;
