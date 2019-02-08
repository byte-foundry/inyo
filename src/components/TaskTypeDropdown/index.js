import PropTypes from 'prop-types';
import React, {useState, useEffect} from 'react';
import styled from '@emotion/styled';

const Dropdown = styled('div')`
	background: white;
	box-shadow: 0 0 5px #e1e1e1;
	position: absolute;
	z-index: 1; /* do a portal instead */
`;

const List = styled('ul')`
	display: flex;
	flex-direction: column;
	margin: 0;
	padding: 0;
	list-style: none;
`;

const ListItem = styled('li')`
	cursor: pointer;
	padding: 10px;

	${props => props.focused && 'background: #e1e1e1;'} &:hover, &:focus {
		background: #e1e1e1;
	}
`;

const TaskTypeDropdown = ({filter, onSelectCommand}) => {
	const types = [
		{
			icon: '🛃',
			type: 'DEFAULT',
			name: 'Tâche attribuée au client',
			description: 'Une tâche à réaliser par votre client',
		},
		{
			icon: '⏰',
			type: 'REMINDER',
			name: 'Relance client générique',
			description: 'Programmer des relances client',
		},
		{
			icon: '👍',
			type: 'VALIDATION',
			name: 'Validation client',
			description: '',
		},
	];

	const lowercaseFilter = filter.toLocaleLowerCase();

	const filteredTypes = types.filter(
		({name, description}) => lowercaseFilter === ''
			|| name.toLocaleLowerCase().includes(lowercaseFilter)
			|| description.toLocaleLowerCase().includes(lowercaseFilter),
	);

	const [focusedItemIndex, setFocusedItemIndex] = useState(0);

	useEffect(() => {
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

		document.addEventListener('keydown', arrowNavigationListener);

		return () => {
			document.removeEventListener('keydown', arrowNavigationListener);
		};
	});

	useEffect(
		() => {
			setFocusedItemIndex(0);
		},
		[filter],
	);

	return (
		<Dropdown>
			<List>
				{filteredTypes.map(({icon, name, description}, index) => (
					<ListItem
						tabIndex="0"
						onMouseEnter={() => setFocusedItemIndex(index)}
						onClick={() => onSelectCommand(filteredTypes[index])}
						focused={index === focusedItemIndex}
					>
						{icon}
						{name}
						<br />
						{description}
					</ListItem>
				))}
			</List>
		</Dropdown>
	);
};

TaskTypeDropdown.propTypes = {
	filter: '',
	onSelectCommand: () => {},
};

TaskTypeDropdown.propTypes = {
	filter: PropTypes.string,
	onSelectCommand: PropTypes.func,
};

export default TaskTypeDropdown;
