import React from 'react';
import {useMutation} from 'react-apollo-hooks';

import BistableButton from '../BistableButton';

import {FOCUS_TASK, UNFOCUS_TASK} from '../../utils/mutations';

const TaskActivationButton = ({
	customerToken, taskId, isActive, disabled,
}) => {
	const focusItem = useMutation(FOCUS_TASK);
	const unfocusItem = useMutation(UNFOCUS_TASK);

	return (
		<BistableButton
			white={!isActive}
			value={isActive}
			disabled={disabled}
			trueLabel="Enlever cette tâche de mon programme du jour"
			trueTooltip="Cette tâche est prévue pour aujourd'hui"
			falseLabel="Je fais cette tâche aujourd'hui"
			falseTooltip="Ajouter cette tâche à mon programme du jour"
			commit={focusItem}
			reverse={unfocusItem}
			variables={{itemId: taskId, token: customerToken}}
		/>
	);
};

export default TaskActivationButton;
