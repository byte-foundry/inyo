import React from 'react';

import Tag from '../Tag';

function TagList({tags}) {
	return (
		<div>
			{tags.map(tag => (
				<Tag tag={tag} />
			))}
		</div>
	);
}

export default TagList;
