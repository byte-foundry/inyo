import PropTypes from 'prop-types';
import React, {useState, useEffect} from 'react';
import styled from '@emotion/styled/macro';

import {
	gray20, gray30, gray50, gray80,
} from '../../utils/content';

const Dropdown = styled('div')`
	background: white;
	box-shadow: 0 0 5px ${gray20};
	position: absolute;
	z-index: 2; /* do a portal instead */
	width: 500px;
`;

const Header = styled('p')`
	text-transform: uppercase;
	color: ${gray30};
	margin: 1.5em 2em 0.5em 2em;
`;

const List = styled('ul')`
	display: flex;
	flex-direction: column;
	margin: 0;
	padding: 0;
	list-style: none;
`;

const ListItemIcon = styled('div')`
	margin: 0.15rem 1.5rem;
	svg {
		zoom: 0.7;
	}
`;

const ListItemTitle = styled('div')`
	color: ${gray80};
`;

const ListItemDescription = styled('div')`
	grid-column-start: 2;
	color: ${gray30};
`;

const ListItem = styled('li')`
	display: grid;
	grid-template-columns: auto 1fr;
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
		<Dropdown>
			<Header>Tâches automatiques et/ou prédéfinies</Header>
			<List>
				{filteredTypes.map(({icon, name, description}, index) => (
					<ListItem
						key={name}
						tabIndex="0"
						onMouseEnter={() => setFocusedItemIndex(index)}
						onClick={() => onSelectCommand(filteredTypes[index])}
						focused={index === focusedItemIndex}
					>
						<ListItemIcon>{icon}</ListItemIcon>
						<ListItemTitle>{name}</ListItemTitle>
						<ListItemDescription>{description}</ListItemDescription>
					</ListItem>
				))}
			</List>
		</Dropdown>
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
