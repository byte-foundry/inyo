import React from 'react';
import {useMutation} from 'react-apollo-hooks';

import {FINISH_ITEM, UNFINISH_ITEM} from '../../utils/mutations';
import BistableButton from '../BistableButton';

const TaskStatusButton = ({
	item,
	customerToken,
	isFinished,
	disabled,
	white,
	primary,
}) => {
	const [finishItem] = useMutation(FINISH_ITEM);
	const [unfinishItem] = useMutation(UNFINISH_ITEM);

	return (
		<BistableButton
			value={isFinished}
			disabled={disabled}
			trueLabel="Fait"
			trueTooltip="Ré-ouvrir la tâche"
			falseLabel="Marquer comme fait"
			falseTooltip="Cliquer si cette tâche a été réalisée"
			commit={() => {
				if (customerToken) {
					finishItem({
						variables: {itemId: item.id, token: customerToken},
					});
				}
				else {
					finishItem({
						variables: {
							itemId: item.id,
							token: customerToken,
						},
						optimisticResponse: {
							finishItem: {
								...item,
								status: 'FINISHED',
							},
						},
					});
				}
			}}
			reverse={() => unfinishItem({
				variables: {itemId: item.id, token: customerToken},
			})
			}
			white={white}
			primary={primary}
		/>
	);
};

export default TaskStatusButton;
