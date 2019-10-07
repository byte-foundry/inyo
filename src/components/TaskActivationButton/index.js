import React from 'react';

import fbt from '../../fbt/fbt.macro';
import {useMutation} from '../../utils/apollo-hooks';
import {UNFOCUS_TASK} from '../../utils/mutations';
import BistableButton from '../BistableButton';

const TaskActivationButton = ({
	customerToken,
	taskId,
	isActive,
	disabled,
	onCommit,
}) => {
	const [unfocusItem] = useMutation(UNFOCUS_TASK);

	return (
		<BistableButton
			id="task-activation-button"
			white={!isActive}
			value={isActive}
			disabled={disabled}
			trueLabel={
				<fbt project="inyo" desc="remove task from day">
					Enlever cette tâche de mon programme du jour
				</fbt>
			}
			trueTooltip={
				<fbt project="inyo" desc="remove task from day tooltip">
					Cette tâche est prévue pour aujourd'hui
				</fbt>
			}
			falseLabel={
				<fbt project="inyo" desc="add task to day">
					Je fais cette tâche aujourd'hui
				</fbt>
			}
			falseTooltip={
				<fbt project="inyo" desc="add task to day tooltip">
					Ajouter cette tâche à mon programme du jour
				</fbt>
			}
			commit={onCommit}
			reverse={() => unfocusItem({variables: {itemId: taskId, token: customerToken}})
			}
		/>
	);
};

export default TaskActivationButton;
