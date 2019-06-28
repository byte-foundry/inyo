import React from 'react';
import {useMutation, useQuery} from 'react-apollo-hooks';

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
	const unfocusItem = useMutation(UNFOCUS_TASK);

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
			trueLabel={`Ne plus rappeler à ${customerName} de faire cette tâche`}
			trueTooltip={`${me.settings.assistantName} s'occupe de faire réaliser cette tâche`}
			falseLabel={`Charger ${me.settings.assistantName} de faire réaliser cette tâche à ${customerName}`}
			falseTooltip="Ajouter la tâche aux choses à faire aujourd'hui"
			commit={onCommit}
			reverse={() => unfocusItem({variables: {itemId: taskId}})}
		/>
	);
};

export default TaskActivationButton;
