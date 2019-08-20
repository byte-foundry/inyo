import React from 'react';

import {TaskInfosItemLink} from '../../utils/new/design-system';
import IconButton from '../IconButton';
import Tooltip from '../Tooltip';

const TaskDescription = ({
	taskUrlPrefix, baseUrl, item, locationSearch,
}) => {
	if (!item.description) return null;

	return (
		<TaskInfosItemLink
			to={{
				pathname: `${taskUrlPrefix}/${baseUrl}/${item.id}`,
				state: {prevSearch: locationSearch},
			}}
		>
			<Tooltip
				key={`label-task-comment-${item.id}`}
				label="Lire la description de cette tâche"
			>
				<IconButton icon="assignment" size="tiny" />
			</Tooltip>
		</TaskInfosItemLink>
	);
};

export default TaskDescription;
