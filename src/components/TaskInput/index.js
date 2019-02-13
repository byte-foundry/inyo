import PropTypes from 'prop-types';
import styled from '@emotion/styled';
import React, {useState, useRef} from 'react';
import useOnClickOutside from 'use-onclickoutside';

import TaskTypeDropdown from '../TaskTypeDropdown';

const Container = styled('div')`
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

const types = [
	{
		icon: '🔵',
		type: 'DEFAULT',
		name: 'Tâche par défaut',
		description: 'Une tâche dont vous êtes responsable',
	},
	{
		icon: '🔴',
		type: 'CUSTOMER',
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
		description: 'Demander à votre client une validation',
	},
	{
		icon: '🔔',
		type: 'PERSONAL_REMINDER',
		name: 'Rappel personnel',
		description: 'Programmer un rappel (visible seulement par vous)',
	},
	{
		icon: '📝',
		type: 'MEETING_NOTES',
		name: 'Réunion client',
		description: 'Assembler et partager les notes de réunion',
	},
	{
		icon: '📁',
		type: 'CONTENT_ACQUISITION',
		name: 'Récupération contenu',
		description: 'Lister et récupérer les contenus nécessaires',
	},
	{
		icon: '🌳',
		type: 'SUBTASKS',
		name: 'Tâche et sous-tâches',
		description: "Lister les sous-tâches d'une tâche parente",
	},
	{
		icon: '💰',
		type: 'PAYMENT',
		name: 'Paiement par le client',
		description: 'Demander et relancer pour un paiement',
	},
	{
		icon: '📆',
		type: 'SCHEDULE_MEETING',
		name: 'Programmation de RDV client',
		description: 'Programmer automatiquement une réunion',
	},
	{
		icon: '⭕',
		type: 'PERSONAL',
		name: 'Tâche personnelle',
		description: 'Créer une tâche uniquement visible par vous',
	},
];

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
		icon = types.find(t => t.type === type).icon;
	}
	else if (!value.startsWith('/') && value.length > 0) {
		icon = types.find(t => t.type === 'DEFAULT').icon;
	}

	return (
		<Container ref={ref}>
			<InputContainer>
				<Icon onClick={() => setFocusByClick(true)}>{icon}</Icon>
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
