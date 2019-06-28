import React from 'react';
import {useMutation} from 'react-apollo-hooks';

import {UNFOCUS_TASK} from '../../utils/mutations';
import BistableButton from '../BistableButton';

const TaskActivationButton = ({
	customerToken,
	taskId,
	isActive,
	disabled,
	onCommit,
}) => {
	const unfocusItem = useMutation(UNFOCUS_TASK);

	return (
		<BistableButton
			id="task-activation-button"
			white={!isActive}
			value={isActive}
			disabled={disabled}
			trueLabel="Enlever cette tâche de mon programme du jour"
			trueTooltip="Cette tâche est prévue pour aujourd'hui"
			falseLabel="Je fais cette tâche aujourd'hui"
			falseTooltip="Ajouter cette tâche à mon programme du jour"
			commit={onCommit}
			reverse={() => unfocusItem({variables: {itemId: taskId, token: customerToken}})
			}
		/>
	);
};

export default TaskActivationButton;
