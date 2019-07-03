import React, {useCallback, useState} from 'react';

import {accentGrey, TaskIconText} from '../../utils/new/design-system';
import MaterialIcon from '../MaterialIcon';
import Tooltip from '../Tooltip';

function TaskCollaboratorList() {
	const [editCollab, setEditCollab] = useState(false);
	const onClickElem = useCallback(() => {
		setEditCollab(true);
	}, [setEditCollab]);

	return (
		<Tooltip label="Tâche assigné à">
			<TaskIconText
				icon={
					<MaterialIcon
						icon="people"
						size="tiny"
						color={accentGrey}
					/>
				}
				content={
					editCollab ? (
						'prout'
					) : (
						<div onClick={onClickElem}>&mdash;</div>
					)
				}
			/>
		</Tooltip>
	);
}

export default TaskCollaboratorList;
