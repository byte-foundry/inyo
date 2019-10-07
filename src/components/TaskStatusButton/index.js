import React from 'react';

import fbt from '../../fbt/fbt.macro';
import {useMutation} from '../../utils/apollo-hooks';
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
			trueLabel={
				<fbt project="inyo" desc="Done">
					Fait
				</fbt>
			}
			trueTooltip={
				<fbt project="inyo" desc="done tooltip">
					Ré-ouvrir la tâche
				</fbt>
			}
			falseLabel={
				<fbt project="inyo" desc="mark as done">
					Marquer comme fait
				</fbt>
			}
			falseTooltip={
				<fbt project="inyo" desc="mark as done tooltip">
					Cliquer si cette tâche a été réalisée
				</fbt>
			}
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
