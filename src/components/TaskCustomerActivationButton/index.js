import React from 'react';
import {useMutation} from 'react-apollo-hooks';

import BistableButton from '../BistableButton';

import {FOCUS_TASK, UNFOCUS_TASK} from '../../utils/mutations';

const TaskActivationButton = ({
	taskId, isActive, disabled, customerName,
}) => {
	const focusItem = useMutation(FOCUS_TASK);
	const unfocusItem = useMutation(UNFOCUS_TASK);

	return (
		<BistableButton
			white={!isActive}
			value={isActive}
			disabled={disabled}
			trueLabel="Edwige s'occupe de faire réaliser cette tâche"
			trueTooltip="Enlever la tâche des choses à faire aujourd'hui"
			falseLabel={`Charger Edwige de faire réaliser cette tâche à ${customerName}`}
			falseTooltip="Ajouter la tâche aux choses à faire aujourd'hui"
			commit={focusItem}
			reverse={unfocusItem}
			variables={{itemId: taskId}}
		/>
	);
};

export default TaskActivationButton;
