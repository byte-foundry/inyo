import React from 'react';
import {useMutation} from 'react-apollo-hooks';

import BistableButton from '../BistableButton';

import {FINISH_ITEM, UNFINISH_ITEM} from '../../utils/mutations';

const TaskStatusButton = ({
	customerToken,
	taskId,
	isFinished,
	disabled,
	white,
	primary,
}) => {
	const finishItem = useMutation(FINISH_ITEM);
	const unfinishItem = useMutation(UNFINISH_ITEM);

	return (
		<BistableButton
			value={isFinished}
			disabled={disabled}
			trueLabel="Fait"
			trueTooltip="Ré-ouvrir la tâche"
			falseLabel="Marquer comme fait"
			falseTooltip="Cliquer si cette tâche a été réalisée"
			commit={finishItem}
			reverse={unfinishItem}
			variables={{itemId: taskId, token: customerToken}}
			white={white}
			primary={primary}
		/>
	);
};

export default TaskStatusButton;
