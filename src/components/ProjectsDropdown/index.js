import React from 'react';
import {useQuery} from 'react-apollo-hooks';

import {GET_ALL_PROJECTS} from '../../utils/queries';
import {ArianneElem} from '../ArianneThread';

const ProjectsDropdown = (props) => {
	const {data, errors} = useQuery(GET_ALL_PROJECTS, {suspend: true});

	if (errors) throw errors;

	return (
		<ArianneElem
			list={data.me.projects.filter(p => p.status === 'ONGOING')}
			{...props}
		/>
	);
};

export default ProjectsDropdown;
