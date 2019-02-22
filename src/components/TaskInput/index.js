import PropTypes from 'prop-types';
import styled from '@emotion/styled';
import React, {useState, useRef} from 'react';
import useOnClickOutside from 'use-onclickoutside';

import TaskTypeDropdown from '../TaskTypeDropdown';

import {ITEM_TYPES} from '../../utils/constants';
import {Button} from '../../utils/new/design-system';

const Container = styled('div')`
	font-size: 14px;
`;

const InputContainer = styled('div')`
	display: flex;
	align-items: center;
	padding-left: 0.3rem;
	margin-left: -7px;
`;

const InputButtonWrapper = styled('div')`
	position: relative;
`;

const InputButtonContainer = styled('div')`
	position: absolute;
	display: flex;
	flex-flow: column nowrap;
	right: calc(-100% + 10px);
	top: -13px;
	width: 155px;

	button  {
		background: rgba(255, 255, 255, 0.5);
		margin-bottom: 0.75rem;
	}
`;

const Input = styled('input')`
	flex: 1;
	background-color: #f5f2fe;
	border: none;
	border-radius: 20px;
	padding: 0.5rem 1.2rem 0.5rem 4rem;
	margin-left: -2.2rem;
	color: #5020ee;
	font-size: 18px;
	border: 1px solid transparent;
	transition: all 400ms ease;

	&::placeholder {
		color: #888;
		font-size: 14px;
		font-style: italic;
		font-family: 'Work Sans', sans-serif;
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
	background-color: ${props => (props.active ? 'transparent' : '#5020ee')};
	color: #fff;
	border: 2px solid transparent;
	border-radius: 50%;
	width: 26px;
	height: 26px;
	z-index: 0;
	transition: all 400ms ease;
	cursor: pointer;

	&:hover {
		border: 2px solid ${props => (props.active ? 'transparent' : '#5020ee')};
		color: #5020ee;
		background-color: #fff;
		transition: all 400ms ease;
	}
`;

const types = ITEM_TYPES;

const TaskInput = ({onSubmitProject, onSubmitTask, defaultValue}) => {
	const [value, setValue] = useState(defaultValue);
	const [type, setType] = useState('');
	const [focus, setFocus] = useState(false);
	const [focusByClick, setFocusByClick] = useState(false);
	const ref = useRef();

	useOnClickOutside(ref, () => {
		setFocus(false);
		setFocusByClick(false);
	});

	let icon = '🔃';

	if (type) {
		({icon} = types.find(t => t.type === type));
	}
	else if (!value.startsWith('/') && value.length > 0) {
		({icon} = types.find(t => t.type === 'DEFAULT'));
	}

	return (
		<Container ref={ref}>
			<InputContainer>
				<Icon onClick={() => setFocusByClick(true)} active={type}>
					{icon}
				</Icon>
				<Input
					type="text"
					onChange={e => setValue(e.target.value)}
					value={value}
					onFocus={() => setFocus(true)}
					onKeyDown={(e) => {
						if (!value.startsWith('/')) {
							if (e.key === 'ArrowUp') {
								onSubmitProject({
									name: value,
								});
								setValue('');
							}
							else if (e.key === 'Enter') {
								onSubmitTask({
									name: value,
									type: type || 'DEFAULT',
								});
								setValue('');
							}
						}
						if (e.key === 'Escape') {
							setValue('');
							setFocusByClick(false);
						}
					}}
					placeholder={
						focus
							? 'Taper / pour choisir un type de tâche'
							: 'Ajouter une tâche ou créer un projet'
					}
				/>
				<InputButtonWrapper>
					<InputButtonContainer>
						<Button icon="↵" grey>
							Créer la tâche
						</Button>
						<Button
							icon="↑"
							onClick={() => onSubmitProject({name: value})}
						>
							Créer un projet
						</Button>
					</InputButtonContainer>
				</InputButtonWrapper>
			</InputContainer>
			{((value.startsWith('/') && focus) || focusByClick) && (
				<TaskTypeDropdown
					types={types}
					filter={value.substr(1)}
					onSelectCommand={({type: selectedType}) => {
						setType(selectedType);

						setValue('');
						setFocusByClick(false);
					}}
				/>
			)}
		</Container>
	);
};

TaskInput.defaultProps = {
	defaultValue: '',
	onSubmitTask: () => {},
	onSubmitProject: () => {},
};

TaskInput.propTypes = {
	defaultValue: PropTypes.string,
	onSubmitTask: PropTypes.func,
	onSubmitProject: PropTypes.func,
};

export default TaskInput;
