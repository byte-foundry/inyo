import React from 'react';
import {useMutation, useQuery} from 'react-apollo-hooks';

import BistableButton from '../BistableButton';

import {UNFOCUS_TASK} from '../../utils/mutations';
import {GET_USER_INFOS} from '../../utils/queries';

const TaskActivationButton = ({
	taskId,
	isActive,
	disabled,
	customerName,
	onCommit,
}) => {
	const unfocusItem = useMutation(UNFOCUS_TASK);

	const {
		data: {me},
		loading,
	} = useQuery(GET_USER_INFOS);

	if (loading) return false;

	return (
		<BistableButton
			white={!isActive}
			value={isActive}
			disabled={disabled}
			trueLabel={`Ne plus rappeler à ${customerName} de faire cette tâche`}
			trueTooltip={`${
				me.settings.assistantName
			} s'occupe de faire réaliser cette tâche`}
			falseLabel={`Charger ${
				me.settings.assistantName
			} de faire réaliser cette tâche à ${customerName}`}
			falseTooltip="Ajouter la tâche aux choses à faire aujourd'hui"
			commit={onCommit}
			reverse={() => unfocusItem({itemId: taskId})}
		/>
	);
};

export default TaskActivationButton;
