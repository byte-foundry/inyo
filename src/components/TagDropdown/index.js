import React from 'react';
import {useQuery} from 'react-apollo-hooks';

import {ArianneElemCreatable} from '../ArianneThread';

import {GET_USER_TAGS} from '../../utils/queries';

const TagDropdown = (props) => {
	const {data, errors} = useQuery(GET_USER_TAGS, {suspend: true});

	if (errors) throw errors;

	return <ArianneElemCreatable list={data.me.tags} isMulti {...props} />;
};

export default TagDropdown;
