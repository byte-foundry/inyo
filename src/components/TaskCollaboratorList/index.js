import Portal from '@reach/portal';
import React, {
	useCallback, useEffect, useRef, useState,
} from 'react';
import {useQuery} from 'react-apollo-hooks';
import useOnClickOutside from 'use-onclickoutside';

import {formatFullName} from '../../utils/functions';
import {accentGrey, TaskIconText} from '../../utils/new/design-system';
import {GET_PROJECT_COLLAB_LINK} from '../../utils/queries';
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
	const {collabLinkToProject} = data.project;

	useOnClickOutside(containerRef, () => {
		setEditCollab(false);
	});

	useEffect(() => {
		if (editCollab) {
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
				<Tooltip label="Tâche assigné à">
					<MaterialIcon
						icon="people"
						size="tiny"
						color={accentGrey}
					/>
				</Tooltip>
			}
			content={
				<>
					<div onClick={onClickElem}>
						{(assignee
							&& formatFullName(
								undefined,
								assignee.firstName,
								assignee.lastName,
							)) || <>&mdash;</>}
					</div>
					{editCollab && (
						<Portal>
							<div ref={containerRef} style={dropdownStyle}>
								<CollaboratorDropdown
									collaborators={collabLinkToProject}
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
