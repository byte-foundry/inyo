import React from 'react';
import {useQuery} from 'react-apollo-hooks';
import styled from '@emotion/styled';
import Select from 'react-select';

import {
	LayoutMainElem,
	primaryPurple,
	primaryWhite,
} from '../../utils/new/design-system';
import {GET_ALL_CUSTOMERS, GET_ALL_PROJECTS} from '../../utils/queries';

const ArianneContainer = styled(LayoutMainElem)`
	display: flex;
	margin-bottom: 60px;
`;

const ArianneElemMain = styled('div')`
	flex: 0 0 170px;
`;

const ArianneArrow = styled('div')``;

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
	children,
	id,
	list,
	onChange,
	open,
	onBlur,
	defaultValue,
}) {
	return (
		<ArianneElemMain>
			<Select
				placeholder={children}
				options={list.map(item => ({value: item.id, label: item.name}))}
				onChange={onChange}
				onBlur={onBlur}
				styles={customSelectStyles}
				defaultValue={defaultValue}
				isSearchable
				isClearable
				defaultMenuIsOpen={open}
			/>
			<ArianneArrow />
		</ArianneElemMain>
	);
}

function ArianneThread({selectCustomer, selectProjects}) {
	const {
		data: {
			me: {customers},
		},
		errors: errorsCustomers,
	} = useQuery(GET_ALL_CUSTOMERS);
	const {
		data: {
			me: {
				company: {projects},
			},
		},
		errors: errorsProject,
	} = useQuery(GET_ALL_PROJECTS);

	if (errorsProject) throw errorsProject;
	if (errorsCustomers) throw errorsCustomers;

	return (
		<ArianneContainer>
			<ArianneElem
				id="clients"
				list={customers}
				onChange={selectCustomer}
			>
				Tous les clients
			</ArianneElem>
			<ArianneElem id="projects" list={projects}>
				Projets
			</ArianneElem>
			<ArianneElem list={customers}>Tags</ArianneElem>
		</ArianneContainer>
	);
}

export default ArianneThread;
