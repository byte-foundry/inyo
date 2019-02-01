import PropTypes from 'prop-types';
import React from 'react';
import styled from '@emotion/styled';

const Dropdown = styled('div')`
	background: white;
	box-shadow: 0 0 5px solid black;
	position: absolute;
	z-index: 1; /* do a portal instead */
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

	return (
		<Dropdown>
			<ul>
				{filteredTypes.map(({icon, name, description}, index) => (
					<li onClick={e => onSelectCommand(filteredTypes[index])}>
						{icon}
						{name}
						<br />
						{description}
					</li>
				))}
			</ul>
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
