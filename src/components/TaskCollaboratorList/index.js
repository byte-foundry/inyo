import Portal from '@reach/portal';
import React, {
	useCallback, useEffect, useRef, useState,
} from 'react';

import fbt from '../../fbt/fbt.macro';
import {useQuery} from '../../utils/apollo-hooks';
import {formatName} from '../../utils/functions';
import {accentGrey, TaskIconText} from '../../utils/new/design-system';
import {GET_PROJECT_COLLAB_LINK} from '../../utils/queries';
import useOnClickOutside from '../../utils/useOnClickOutside';
import CollaboratorDropdown from '../CollaboratorDropdown';
import MaterialIcon from '../MaterialIcon';
import Tooltip from '../Tooltip';

function TaskCollaboratorList({projectId, taskId, assignee}) {
	const [editCollab, setEditCollab] = useState(false);
	const [dropdownStyle, setDropdownStyle] = useState(false);
	const onClickElem = useCallback(() => {
		setEditCollab(true);
	}, [setEditCollab]);
	const containerRef = useRef();
	const {data, error} = useQuery(GET_PROJECT_COLLAB_LINK, {
		variables: {
			id: projectId,
		},
		suspend: true,
	});
	const {linkedCollaborators} = data.project;

	useOnClickOutside(containerRef, () => {
		setEditCollab(false);
	});

	useEffect(() => {
		if (editCollab && containerRef.current) {
			const pos = containerRef.current.getBoundingClientRect();

			setDropdownStyle({
				position: 'absolute',
				top: `${pos.bottom + window.scrollY}px`,
				left: `${pos.left}px`,
			});
		}
	}, [editCollab]);

	return (
		<TaskIconText
			ref={containerRef}
			icon={
				<Tooltip
					label={
						<fbt project="inyo" desc="assigned task to">
							Tâche assigné à
						</fbt>
					}
				>
					<MaterialIcon icon="face" size="tiny" color={accentGrey} />
				</Tooltip>
			}
			content={
				<>
					<div onClick={onClickElem}>
						{(assignee
							&& formatName(
								assignee.firstName,
								assignee.lastName,
							)) || <>&mdash;</>}
					</div>
					{editCollab && (
						<Portal>
							<div ref={containerRef} style={dropdownStyle}>
								<CollaboratorDropdown
									collaborators={linkedCollaborators}
									assignee={assignee}
									taskId={taskId}
								/>
							</div>
						</Portal>
					)}
				</>
			}
		/>
	);
}

export default TaskCollaboratorList;
