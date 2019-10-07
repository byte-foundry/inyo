import React from 'react';

import fbt from '../../fbt/fbt.macro';
import {useMutation, useQuery} from '../../utils/apollo-hooks';
import {UNFOCUS_TASK} from '../../utils/mutations';
import {GET_USER_INFOS} from '../../utils/queries';
import BistableButton from '../BistableButton';

const TaskActivationButton = ({
	taskId,
	isActive,
	disabled,
	customerName,
	onCommit,
}) => {
	const [unfocusItem] = useMutation(UNFOCUS_TASK);

	const {
		data: {me},
		loading,
	} = useQuery(GET_USER_INFOS);

	if (loading) return false;

	return (
		<BistableButton
			id="task-customer-activation-button"
			white={!isActive}
			value={isActive}
			disabled={disabled}
			trueLabel={
				<fbt project="inyo" desc="task customer cancelation label">
					Ne plus rappeler à{' '}
					<fbt:param name="customerName">{customerName}</fbt:param> de
					faire cette tâche
				</fbt>
			}
			trueTooltip={
				<fbt project="inyo" desc="task customer cancelation tooltip">
					<fbt:param name="assistantName">
						{me.settings.assistantName}
					</fbt:param>{' '}
					s'occupe de faire réaliser cette tâche
				</fbt>
			}
			falseLabel={
				<fbt project="inyo" desc="task customer activation label">
					Charger{' '}
					<fbt:param name="assitantName">
						{me.settings.assistantName}
					</fbt:param>{' '}
					de faire réaliser cette tâche à{' '}
					<fbt:param name="customerName">{customerName}</fbt:param>
				</fbt>
			}
			falseTooltip={
				<fbt project="inyo" desc="task customer activation tooltip">
					Ajouter la tâche aux choses à faire aujourd'hui
				</fbt>
			}
			commit={onCommit}
			reverse={() => unfocusItem({variables: {itemId: taskId}})}
		/>
	);
};

export default TaskActivationButton;
