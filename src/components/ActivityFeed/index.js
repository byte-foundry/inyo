import styled from '@emotion/styled';
import {Link} from '@reach/router';
import React from 'react';

import fbt from '../../fbt/fbt.macro';
import {useQuery} from '../../utils/apollo-hooks';
import {LoadingLogo} from '../../utils/content';
import {GET_PROJECT_ACTIVITY} from '../../utils/queries';

const Feed = styled('div')`
	flex: 1;
`;

const ActivityFeed = ({projectId}) => {
	const {data, loading, error} = useQuery(GET_PROJECT_ACTIVITY, {
		variables: {projectId},
		fetchPolicy: 'cache-and-network',
	});

	if (error) throw error;
	if (!data && loading) return <LoadingLogo />;

	return (
		<Feed>
			<ul>
				{data.activity.map(event => (
					<li key={event.id}>
						{event.from.firstName} {event.type} {event.object.id}
					</li>
				))}
			</ul>
		</Feed>
	);
};

export default ActivityFeed;
