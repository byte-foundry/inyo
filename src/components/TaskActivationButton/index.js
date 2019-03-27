import React from 'react';
import {useMutation} from 'react-apollo-hooks';

import BistableButton from '../BistableButton';

import {FINISH_ITEM, UNFINISH_ITEM} from '../../utils/mutations';

const TaskActivationButton = ({
	customerToken, taskId, isActive, disabled,
}) => {
	const finishItem = useMutation(FINISH_ITEM);
	const unfinishItem = useMutation(UNFINISH_ITEM);

	return (
		<BistableButton
			value={isActive}
			disabled={disabled}
			trueLabel="Tâche déjà activé"
			trueTooltip="Ré-ouvrir la tâche"
			falseLabel="Activé la tâche"
			falseTooltip="Cliquer si cette tâche a été réalisée"
			commit={finishItem}
			reverse={unfinishItem}
			variables={{itemId: taskId, token: customerToken}}
		/>
	);
};

export default TaskActivationButton;
