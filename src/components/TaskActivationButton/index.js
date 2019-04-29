import React from 'react';
import {useMutation} from 'react-apollo-hooks';

import BistableButton from '../BistableButton';

import {UNFOCUS_TASK} from '../../utils/mutations';

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
