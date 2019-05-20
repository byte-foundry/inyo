import React from 'react';
import {useQuery} from 'react-apollo-hooks';

import TagForm from '../TagForm';

import {GET_USER_TAGS} from '../../utils/queries';
import {Loading} from '../../utils/content';

function TagListForm() {
	const {data, loading, error} = useQuery(GET_USER_TAGS);

	if (loading) return <Loading />;
	if (error) throw error;

	return (
		<div>
			{data.me.tags.map(tag => (
				<TagForm tag={tag} />
			))}
		</div>
	);
}

export default TagListForm;
