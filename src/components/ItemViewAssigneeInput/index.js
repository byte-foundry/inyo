import Portal from '@reach/portal';
import React, {useEffect, useRef, useState} from 'react';
import useOnClickOutside from 'use-onclickoutside';

import {Meta, MetaLabel, MetaText} from '../../utils/new/design-system';
import CollaboratorDropdown from '../CollaboratorDropdown';
import MaterialIcon from '../MaterialIcon';
import Tooltip from '../Tooltip';

function ItemViewAssigneeInput({customerToken, assignee}) {
	const [editAssignee, setEditAssignee] = useState(false);
	const [dropdownStyle, setDropdownStyle] = useState(false);
	const containerRef = useRef();

	useOnClickOutside(containerRef, () => {
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
		<Tooltip label="Personne assigné a la tâche">
			<Meta>
				<MaterialIcon icon="face" size="tiny" />
				<MetaLabel>Assigné à</MetaLabel>
				<MetaText
					ref={containerRef}
					onClick={
						customerToken ? undefined : () => setEditAssignee(true)
					}
				>
					{assignee && assignee.name}
				</MetaText>
				{!customerToken && editAssignee && (
					<Portal>
						<div style={dropdownStyle}>
							<CollaboratorDropdown
								collaborators={[
									{
										email: 'francois.poizat@gmail.com',
										name: 'zboub',
									},
									{
										email: 'barack@obama.org',
										name: '2zboub',
									},
									{
										email: 'donald@trump.com',
										name: '3zboub',
									},
								]}
							/>
						</div>
					</Portal>
				)}
			</Meta>
		</Tooltip>
	);
}

export default ItemViewAssigneeInput;
