import React from 'react';
import {useQuery} from 'react-apollo-hooks';
import styled from '@emotion/styled';
import Select from 'react-select';

import {primaryPurple, primaryWhite} from '../../utils/new/design-system';
import {GET_ALL_CUSTOMERS, GET_ALL_PROJECTS} from '../../utils/queries';

const ArianneContainer = styled('div')`
	display: flex;
	margin-bottom: 60px;
`;

const ArianneElemMain = styled('div')`
	flex: 0 0 170px;
`;

const customSelectStyles = {
	dropdownIndicator: styles => ({
		...styles,
		color: primaryPurple,
		paddingTop: 0,
		paddingBottom: 0,
	}),
	clearIndicator: styles => ({
		...styles,
		color: primaryPurple,
		paddingTop: 0,
		paddingBottom: 0,
	}),
	option: (styles, state) => ({
		...styles,
		backgroundColor: state.isSelected ? primaryPurple : primaryWhite,
		color: state.isSelected ? primaryWhite : primaryPurple,

		':hover, :active, :focus': {
			color: primaryWhite,
			backgroundColor: primaryPurple,
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
		},
		fontSize: '14px',
		overflow: 'hidden',
		textOverflow: 'ellipsis',
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
				{...rest}
			/>
		</ArianneElemMain>
	);
}

function ArianneThread({
	selectCustomer,
	selectProjects,
	linkedCustomerId,
	projectId,
}) {
	const {
		data: {
			me: {customers},
		},
		errors: errorsCustomers,
	} = useQuery(GET_ALL_CUSTOMERS);
	const {
		data: {
			me: {
				company: {projects: projectsUnfiltered},
			},
		},
		errors: errorsProject,
	} = useQuery(GET_ALL_PROJECTS);

	const projects = projectsUnfiltered.filter(
		project => !linkedCustomerId || project.customer.id === linkedCustomerId,
	);

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
				Projets
			</ArianneElem>
			<ArianneElem list={customers}>Tags</ArianneElem>
		</ArianneContainer>
	);
}

export default ArianneThread;
