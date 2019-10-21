import styled from '@emotion/styled';
import {Link} from '@reach/router';
import React from 'react';

import fbt from '../../fbt/fbt.macro';
import {useMutation, useQuery} from '../../utils/apollo-hooks';

const Feed = styled('div')`
	flex: 1;
`;

const ActivityFeed = ({projectId}) =>
// useQuery

	 (
		<Feed>
			<ul>
				<li>
					Jean-Michel Client a commenté la tâche{' '}
					<Link to="">direction artistique</Link>.
				</li>
				<li>Jean-Michel Client a consulté le projet.</li>
				<li>
					Vous avez fini la tâche <Link to="">faire les courses</Link>
					.
				</li>
				<li>Début du projet</li>
			</ul>
		</Feed>
	);

export default ActivityFeed;
