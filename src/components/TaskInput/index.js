import PropTypes from 'prop-types';
import styled from '@emotion/styled';
import React, {useState, useRef} from 'react';
import useOnClickOutside from 'use-onclickoutside';

import TaskTypeDropdown from '../TaskTypeDropdown';

const Container = styled('div')`
	margin: 1rem 0;
	font-size: 14px;
`;

const InputContainer = styled('div')`
	display: flex;
	align-items: center;
	padding-left: 0.3rem;
`;

const Input = styled('input')`
	flex: 1;
	background-color: #f5f2fe;
	border: none;
	border-radius: 20px;
	padding: 0.5rem 1.2rem 0.5rem 4rem;
	margin-left: -2.1rem;
	color: #5020ee;
	font-size: 18px;
	border: 1px solid transparent;
	transition: all 400ms ease;

	&::placeholder {
		color: #888;
		font-size: 14px;
		font-style: italic;
	}

	&:focus {
		outline: none;
		outline: 0;
		box-shadow: none;
		background: #fff;
		border: 1px solid #f5f2fe;
		transition: all 400ms ease;
	}
`;

const Icon = styled('div')`
	display: flex;
	justify-content: center;
	align-items: center;
	background-color: #5020ee;
	color: #fff;
	border: 2px solid transparent;
	border-radius: 50%;
	min-width: 1.3rem;
	min-height: 1.3rem;
	width: 1.3rem;
	height: 1.3rem;
	z-index: 1;
	transition: all 400ms ease;
	cursor: pointer;

	&:hover {
		border: 2px solid #5020ee;
		color: #5020ee;
		background-color: #fff;
		transition: all 400ms ease;
	}
`;

const types = {
	DEFAULT: <span>🛃</span>,
	REMINDER: <span>⏰</span>,
	VALIDATION: <span>👍</span>,
};

const TaskInput = ({onCreateProject, onCreateTask, defaultValue}) => {
	const [value, setValue] = useState(defaultValue);
	const [type, setType] = useState(null);
	const [focus, setFocus] = useState(false);
	const ref = useRef();

	useOnClickOutside(ref, () => {
		setFocus(false);
	});

	return (
		<Container ref={ref}>
			<InputContainer>
				<Icon>{type ? types[type] || types.DEFAULT : '+'}</Icon>
				<Input
					type="text"
					onChange={e => setValue(e.target.value)}
					value={value}
					onFocus={() => setFocus(true)}
					onKeyDown={(e) => {
						if (!value.startsWith('/')) {
							if (e.key === 'ArrowUp') {
								onCreateProject({
									name: value,
								});
								setValue('');
							}
							else if (e.key === 'Enter') {
								onCreateTask({
									name: value,
									type,
								});
								setValue('');
							}
						}
					}}
					placeholder={
						focus
							? 'Taper / pour choisir un type de tâche'
							: 'Ajouter une tâche'
					}
				/>
			</InputContainer>
			{value.startsWith('/')
				&& focus && (
				<TaskTypeDropdown
					filter={value.substr(1)}
					onSelectCommand={({type: selectedType}) => {
						setType(selectedType);
						setValue('');
					}}
				/>
			)}
		</Container>
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
