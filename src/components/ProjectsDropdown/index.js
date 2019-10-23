import React from 'react';

import {useQuery} from '../../utils/apollo-hooks';
import {GET_ALL_PROJECTS} from '../../utils/queries';
import {ArianneElem} from '../ArianneThread';

const ProjectsDropdown = (props) => {
	const {data, error} = useQuery(GET_ALL_PROJECTS, {suspend: true});

	if (error) throw error;

	return (
		<ArianneElem
			list={data.me.projects.filter(p => p.status === 'ONGOING')}
			{...props}
		/>
	);
};

export default ProjectsDropdown;
