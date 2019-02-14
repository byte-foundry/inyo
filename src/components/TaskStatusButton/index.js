import React from 'react';
import {useMutation} from 'react-apollo-hooks';

import {Button} from '../../utils/new/design-system';

import {FINISH_ITEM, UNFINISH_ITEM} from '../../utils/mutations';

const TaskStatusButton = () => {
	const finishItem = useMutation(FINISH_ITEM);
	const unfinishItem = useMutation(UNFINISH_ITEM);

	return (
		<Button
			white
			onClick={() => {
				// if (finishable) {
				// 	finishItem({variables: {itemId}});
				// }
				// if (unfinishable) {
				// 	unfinishItem({variables: {itemId}});
				// }
			}}
		>
			Marquer comme fait
		</Button>
	);
};

export default TaskStatusButton;
