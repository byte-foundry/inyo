import React from 'react';
import {useMutation} from 'react-apollo-hooks';

import {Button} from '../../utils/new/design-system';

import {FINISH_ITEM, UNFINISH_ITEM} from '../../utils/mutations';

const TaskStatusButton = ({taskId, isFinished}) => {
	const finishItem = useMutation(FINISH_ITEM);
	const unfinishItem = useMutation(UNFINISH_ITEM);

	return (
		<Button
			data-tip={
				isFinished
					? 'Ré-ouvrir la tâche'
					: 'Cliquer si cette tâche a été réalisée'
			}
			icon={isFinished && '✓'}
			white={!isFinished}
			onClick={() => {
				if (isFinished) {
					unfinishItem({variables: {itemId: taskId}});
				}
				else {
					finishItem({variables: {itemId: taskId}});
				}
			}}
		>
			{isFinished ? 'Fait' : 'Marquer comme fait'}
		</Button>
	);
};

export default TaskStatusButton;
