import React from 'react';
import {useQuery} from 'react-apollo-hooks';

import {ArianneElem} from '../ArianneThread';

import {GET_ALL_PROJECTS} from '../../utils/queries';

const ProjectsDropdown = (props) => {
	const {data, errors} = useQuery(GET_ALL_PROJECTS);

	if (errors) throw errors;

	return <ArianneElem list={data.me.projects} {...props} />;
};

export default ProjectsDropdown;
