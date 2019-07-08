import Portal from '@reach/portal';
import React, {
	useCallback, useEffect, useRef, useState,
} from 'react';
import useOnClickOutside from 'use-onclickoutside';

import {accentGrey, TaskIconText} from '../../utils/new/design-system';
import CollaboratorDropdown from '../CollaboratorDropdown';
import MaterialIcon from '../MaterialIcon';
import Tooltip from '../Tooltip';

function TaskCollaboratorList() {
	const [editCollab, setEditCollab] = useState(false);
	const [dropdownStyle, setDropdownStyle] = useState(false);
	const onClickElem = useCallback(() => {
		setEditCollab(true);
	}, [setEditCollab]);
	const containerRef = useRef();

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
					<div ref={containerRef} onClick={onClickElem}>
						&mdash;
					</div>
					{editCollab && (
						<Portal>
							<div style={dropdownStyle}>
								<CollaboratorDropdown
									collaborators={[
										{
											email: 'francois.poizat@gmail.com',
											name: 'zboub',
											collaborationStatus:
												'COLLABORATION_ACCEPTED',
										},
										{
											email: 'barack@obama.org',
											name: '2zboub',
											collaborationStatus:
												'WAITING_FOR_CONFIRMATION',
										},
										{
											email: 'donald@trump.com',
											name: '3zboub',
											collaborationStatus:
												'COLLABORATION_REJECTED',
										},
									]}
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
