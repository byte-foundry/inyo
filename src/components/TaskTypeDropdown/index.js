import styled from '@emotion/styled/macro';
import PropTypes from 'prop-types';
import React, {useEffect, useState} from 'react';

import fbt from '../../fbt/fbt.macro';
import {BREAKPOINTS} from '../../utils/constants';
import {gray30, gray50, gray80} from '../../utils/content';
import {
	lightGrey,
	TaskInputDropdown,
	TaskInputDropdownHeader,
} from '../../utils/new/design-system';

const List = styled('ul')`
	display: flex;
	flex-direction: column;
	margin: 0;
	padding: 0;
	list-style: none;
`;

const ListItemIcon = styled('div')`
	margin: 0.2rem auto;
	svg {
		transform: scale(0.6);
	}
`;

const ListItemTitle = styled('div')`
	padding-top: 0.2rem;
	font-weight: 500;
	color: ${gray80};
`;

const ListItemDescription = styled('div')`
	grid-column-start: 2;
	color: ${gray30};
`;

const ListItem = styled('li')`
	display: grid;
	grid-template-columns: 4rem 1fr;
	border-top: 1px solid ${lightGrey};
	cursor: pointer;
	padding: 0.5em;

	${props => props.focused
		&& `
		background: #f2f2f2;

		${ListItemDescription} {
			color: ${gray50};
		}
	`} &:hover, &:focus {
		background: #f2f2f2;

		${ListItemDescription} {
			color: ${gray50};
		}
	}

	@media (max-width: ${BREAKPOINTS}px) {
		grid-template-columns: 2.5rem 1fr;
	}
`;

const TaskTypeDropdown = ({types, filter, onSelectCommand}) => {
	const lowercaseFilter = filter.toLocaleLowerCase();

	const filteredTypes = types.filter(
		({name, description}) => lowercaseFilter === ''
			|| name.toLocaleLowerCase().includes(lowercaseFilter)
			|| description.toLocaleLowerCase().includes(lowercaseFilter),
	);

	const [focusedItemIndex, setFocusedItemIndex] = useState(0);

	const arrowNavigationListener = (e) => {
		if (e.key === 'ArrowUp') {
			setFocusedItemIndex(
				(focusedItemIndex - 1 + types.length) % types.length,
			);
		}
		else if (e.key === 'ArrowDown') {
			setFocusedItemIndex(
				(focusedItemIndex + 1 + types.length) % types.length,
			);
		}
		else if (e.key === 'Enter') {
			onSelectCommand(filteredTypes[focusedItemIndex]);
		}
	};

	useEffect(() => {
		document.addEventListener('keydown', arrowNavigationListener);

		return () => {
			document.removeEventListener('keydown', arrowNavigationListener);
		};
	});

	useEffect(() => {
		setFocusedItemIndex(0);
	}, [filter]);

	return (
		<TaskInputDropdown>
			<TaskInputDropdownHeader>
				<fbt project="inyo" desc="task type dropdown heading">
					Tâches automatiques et/ou prédéfinies
				</fbt>
			</TaskInputDropdownHeader>
			<List id="task-dropdown-list">
				{filteredTypes.map(({icon, name, description}, index) => (
					<ListItem
						key={name}
						tabIndex="0"
						onMouseEnter={() => setFocusedItemIndex(index)}
						onClick={() => onSelectCommand(filteredTypes[index])}
						focused={index === focusedItemIndex}
					>
						<ListItemIcon>{icon}</ListItemIcon>
						<div>
							<ListItemTitle>{name}</ListItemTitle>
							<ListItemDescription>
								{description}
							</ListItemDescription>
						</div>
					</ListItem>
				))}
			</List>
		</TaskInputDropdown>
	);
};

TaskTypeDropdown.defaultProps = {
	filter: '',
	onSelectCommand: () => {},
};

TaskTypeDropdown.propTypes = {
	filter: PropTypes.string,
	onSelectCommand: PropTypes.func,
};

export default TaskTypeDropdown;
