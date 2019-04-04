import React from 'react';
import {useQuery} from 'react-apollo-hooks';
import styled from '@emotion/styled';
import Select from 'react-select';

import {
	primaryPurple,
	primaryWhite,
	lightGrey,
	primaryRed,
} from '../../utils/new/design-system';
import {GET_ALL_CUSTOMERS, GET_ALL_PROJECTS} from '../../utils/queries';
import {BREAKPOINTS} from '../../utils/constants';

const ArianneContainer = styled('div')`
	display: flex;
	margin-bottom: 60px;
	@media (max-width: ${BREAKPOINTS}px) {
		flex-direction: column;
		margin-bottom: 1rem;
	}
`;

const ArianneElemMain = styled('div')`
	flex: 0 0 170px;
	margin-right: 1rem;
	position: relative;

	&:hover {
		cursor: text;

		&:before {
			content: '';
			display: block;
			background: ${lightGrey};
			position: absolute;
			left: -0.5rem;
			top: -0.5rem;
			right: -0.5rem;
			bottom: -0.5rem;
			border-radius: 8px;
			z-index: -1;
		}
	}
	@media (max-width: ${BREAKPOINTS}px) {
		flex: 1;
		margin: 0.25rem 0;
	}
`;

const customSelectStyles = {
	dropdownIndicator: styles => ({
		...styles,
		color: primaryPurple,
		padding: 0,
		marginRight: '.5rem',
		marginTop: '-2px',
		transform: 'scale(.7)',
	}),
	clearIndicator: styles => ({
		...styles,
		color: primaryWhite,
		padding: 0,
		paddingBottom: 0,
		background: primaryPurple,
		borderRadius: '50%',
		transform: 'scale(.7)',

		':hover, :active, :focus': {
			background: primaryRed,
			color: primaryWhite,
		},
	}),
	option: (styles, state) => ({
		...styles,
		backgroundColor: state.isSelected ? primaryPurple : primaryWhite,
		color: state.isSelected ? primaryWhite : primaryPurple,

		':hover, :active, :focus': {
			color: primaryWhite,
			backgroundColor: primaryPurple,
			cursor: 'pointer',
		},
	}),
	placeholder: styles => ({
		...styles,
		color: primaryPurple,
	}),
	singleValue: styles => ({
		...styles,
		color: primaryPurple,
	}),
	input: styles => ({
		...styles,
		padding: 0,
	}),
	control: styles => ({
		...styles,
		border: 'none',
		boxShadow: 'none',
		minHeight: 'auto',
		':hover, :focus, :active': {
			border: 'none',
			boxShadow: 'none',
			cursor: 'pointer',
		},
		fontSize: '14px',
		overflow: 'hidden',
		textOverflow: 'ellipsis',
		backgroundColor: 'transparent',
	}),
	indicatorSeparator: () => ({
		backgroundColor: 'transparent',
	}),
	menu: styles => ({
		...styles,
		width: '300px',
		fontSize: '14px',
	}),
	valueContainer: styles => ({
		...styles,
		padding: 0,
	}),
	container: styles => ({
		...styles,
		padding: 0,
		backgroundColor: 'transparent',
	}),
};

export function ArianneElem({
	children, id, list, selectedId, ...rest
}) {
	const options = list.map(item => ({value: item.id, label: item.name}));
	const selectedItem = options.find(item => item.value === selectedId);

	return (
		<ArianneElemMain>
			<Select
				placeholder={children}
				options={options}
				styles={customSelectStyles}
				isSearchable
				value={selectedItem}
				hideSelectedOptions
				noOptionsMessage={() => 'Aucune option'}
				{...rest}
			/>
		</ArianneElemMain>
	);
}

function ArianneThread({
	selectCustomer,
	selectProjects,
	selectFilter,
	linkedCustomerId,
	projectId,
	filterId = 'PENDING',
}) {
	const {
		data: {
			me: {customers},
		},
		errors: errorsCustomers,
	} = useQuery(GET_ALL_CUSTOMERS);
	const {
		data: {
			me: {projects: projectsUnfiltered},
		},
		errors: errorsProject,
	} = useQuery(GET_ALL_PROJECTS);

	const projects = projectsUnfiltered.filter(
		project => !linkedCustomerId
			|| (project.customer && project.customer.id === linkedCustomerId),
	);

	const filters = [
		{id: 'PENDING', name: 'Tâches à faire'},
		{id: 'FINISHED', name: 'Tâches faites'},
		{id: 'ALL', name: 'Toutes les tâches'},
	];

	if (errorsProject) throw errorsProject;
	if (errorsCustomers) throw errorsCustomers;

	return (
		<ArianneContainer>
			<ArianneElem
				id="clients"
				list={customers}
				onChange={selectCustomer}
				isClearable
				selectedId={linkedCustomerId}
			>
				Tous les clients
			</ArianneElem>
			<ArianneElem
				id="projects"
				list={projects}
				onChange={selectProjects}
				isClearable
				selectedId={projectId}
			>
				Tous les projets
			</ArianneElem>
			<ArianneElem
				id="filter"
				list={filters}
				onChange={selectFilter}
				selectedId={filterId}
				placeholder={'Toutes les tâches'}
			/>
		</ArianneContainer>
	);
}

export default ArianneThread;
