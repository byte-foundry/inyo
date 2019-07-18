import Portal from '@reach/portal';
import React, {useEffect, useRef, useState} from 'react';
import useOnClickOutside from 'use-onclickoutside';

import {formatFullName} from '../../utils/functions';
import {Meta, MetaLabel, MetaText} from '../../utils/new/design-system';
import CollaboratorDropdown from '../CollaboratorDropdown';
import MaterialIcon from '../MaterialIcon';
import Tooltip from '../Tooltip';

function ItemViewAssigneeInput({
	customerToken,
	assignee,
	collabLinkToProject,
	taskId,
}) {
	const [editAssignee, setEditAssignee] = useState(false);
	const [dropdownStyle, setDropdownStyle] = useState(false);
	const containerRef = useRef();
	const dropdownRef = useRef();

	useOnClickOutside(dropdownRef, () => {
		setEditAssignee(false);
	});

	useEffect(() => {
		if (editAssignee) {
			const pos = containerRef.current.getBoundingClientRect();

			setDropdownStyle({
				position: 'absolute',
				top: `${pos.bottom + window.scrollY}px`,
				left: `${pos.left}px`,
			});
		}
	}, [editAssignee]);

	return (
		<>
			<Tooltip label="Personne assigné a la tâche">
				<Meta>
					<MaterialIcon icon="face" size="tiny" />
					<MetaLabel>Assigné à</MetaLabel>
					<MetaText
						ref={containerRef}
						onClick={
							customerToken
								? undefined
								: () => setEditAssignee(true)
						}
					>
						{(assignee
							&& formatFullName(
								undefined,
								assignee.firstName,
								assignee.lastName,
							)) || <>&mdash;</>}
					</MetaText>
				</Meta>
			</Tooltip>
			{!customerToken && editAssignee && (
				<Portal>
					<div ref={dropdownRef} style={dropdownStyle}>
						<CollaboratorDropdown
							assignee={assignee}
							taskId={taskId}
							collaborators={collabLinkToProject}
						/>
					</div>
				</Portal>
			)}
		</>
	);
}

export default ItemViewAssigneeInput;
