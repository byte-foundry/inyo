import PropTypes from 'prop-types';
import React, {useState, useRef} from 'react';
import useOnClickOutside from 'use-onclickoutside';

import TaskTypeDropdown from '../TaskTypeDropdown';

const types = {
	DEFAULT: <p>🛃</p>,
	REMINDER: <p>⏰</p>,
	VALIDATION: <p>👍</p>,
};

const TaskInput = ({onCreateProject, onCreateTask, defaultValue}) => {
	const [value, setValue] = useState(defaultValue);
	const [type, setType] = useState('DEFAULT');
	const [focus, setFocus] = useState(false);
	const ref = useRef();

	useOnClickOutside(ref, () => {
		setFocus(false);
	});

	return (
		<div ref={ref}>
			{types[type] || types.DEFAULT}
			<input
				type="text"
				onChange={e => setValue(e.target.value)}
				value={value}
				onFocus={() => setFocus(true)}
				onKeyDown={(e) => {
					if (e.key === 'ArrowUp') {
						onCreateProject({
							name: value,
						});
						setValue('');
					}
					if (e.key === 'Enter') {
						onCreateTask({
							name: value,
							type,
						});
						setValue('');
					}
				}}
				placeholder={
					focus
						? 'Taper / pour choisir un type de tâche'
						: 'Ajouter une tâche'
				}
			/>
			{value.startsWith('/')
				&& focus && (
				<TaskTypeDropdown
					filter={value.substr(1)}
					onSelectCommand={({type}) => {
						console.log('selected', type);
						setType(type);
						setValue('');
					}}
				/>
			)}
		</div>
	);
};

TaskInput.defaultProps = {
	defaultValue: '',
	onCreateTask: () => {},
	onCreateProject: () => {},
};

TaskInput.propTypes = {
	defaultValue: PropTypes.string,
	onCreateTask: PropTypes.func,
	onCreateProject: PropTypes.func,
};

export default TaskInput;
