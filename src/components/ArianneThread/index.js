import React from 'react';
import {withRouter} from 'react-router-dom';
import {useQuery} from 'react-apollo-hooks';
import styled from '@emotion/styled';
import Select, {components} from 'react-select';
import Creatable from 'react-select/lib/Creatable';

import {
	primaryPurple,
	primaryWhite,
	lightGrey,
	primaryRed,
} from '../../utils/new/design-system';
import {
	GET_ALL_CUSTOMERS,
	GET_ALL_PROJECTS,
	GET_USER_TAGS,
} from '../../utils/queries';
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
	flex: ${props => (props.long ? '0 0 280px' : '0 0 170px')};
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

const ManageTagOption = styled('div')`
	position: absolute;
	margin-top: 10px;
	background: white;
	padding: 10px;
	width: 100%;
	box-sizing: border-box;
	border-radius: 4px;
	box-shadow: 0 0 0 1px hsla(0, 0%, 0%, 0.1), 0 4px 11px hsla(0, 0%, 0%, 0.1);
	top: 100%;
	cursor: pointer;

	&:hover {
		background: ${primaryPurple};
		color: ${primaryWhite};
	}
`;

const customSelectStyles = props => ({
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
		color: primaryPurple,
		position: 'relative',
		':hover, :active, :focus': {
			color: state.data.colorText || primaryWhite,
			backgroundColor: state.data.colorBg || primaryPurple,
			cursor: 'pointer',
		},
		':before': {
			content: '""',
			position: 'absolute',
			borderRadius: '4px',
			right: '10px',
			display: 'block',
			backgroundColor: state.data.colorBg || 'transparent',
			top: 'calc(50% - 4px)',
			width: '30px',
			height: '8px',
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
		flex: 1,
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
		height: props.short ? '27px' : 'auto',
		overflow: 'auto',
	}),
	container: styles => ({
		...styles,
		padding: 0,
		backgroundColor: 'transparent',
	}),
	multiValue: (styles, {data}) => ({
		...styles,
		backgroundColor: data.colorBg,
		color: data.colorText,
	}),
	multiValueLabel: (styles, {data}) => ({
		...styles,
		color: data.colorText,
	}),
});

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
				styles={customSelectStyles({...rest})}
				isSearchable
				value={selectedItem}
				hideSelectedOptions
				noOptionsMessage={() => 'Aucune option'}
				{...rest}
			/>
		</ArianneElemMain>
	);
}

export function ArianneElemCreatable({
	children,
	id,
	list,
	selectedId,
	long,
	supplementaryOption,
	...rest
}) {
	const selectedString = selectedId || [];
	const options = list.map(item => ({
		value: item.id,
		label: item.name,
		colorBg: item.colorBg,
		colorText: item.colorText,
	}));
	const selectedItem = rest.isMulti
		? options.filter(item => selectedString.find(i => i === item.value))
		: options.find(item => item.value === selectedId);

	return (
		<ArianneElemMain long={long}>
			<Creatable
				placeholder={children}
				options={options}
				styles={customSelectStyles({...rest})}
				isSearchable
				value={selectedItem}
				hideSelectedOptions
				components={
					supplementaryOption && {
						MenuList: props => (
							<>
								<components.MenuList {...props}>
									{props.children}
								</components.MenuList>
								{supplementaryOption}
							</>
						),
					}
				}
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
	selectTag,
	linkedCustomerId,
	projectId,
	filterId = 'PENDING',
	tagsSelected = '',
	history,
	location,
}) {
	const {
		data: {
			me: {customers},
		},
		errors: errorsCustomers,
	} = useQuery(GET_ALL_CUSTOMERS, {suspend: true});
	const {
		data: {
			me: {projects: projectsUnfiltered},
		},
		errors: errorsProject,
	} = useQuery(GET_ALL_PROJECTS, {suspend: true});
	const {
		loading,
		data: {
			me: {tags},
		},
		errors: errorsTags,
	} = useQuery(GET_USER_TAGS, {suspend: false});

	const projects = projectsUnfiltered.filter(
		project => (!linkedCustomerId
				|| (project.customer
					&& project.customer.id === linkedCustomerId))
			&& project.status === 'ONGOING',
	);

	const filters = [
		{id: 'PENDING', name: 'Tâches à faire'},
		{id: 'FINISHED', name: 'Tâches faites'},
		{id: 'ALL', name: 'Toutes les tâches'},
	];

	if (errorsProject) throw errorsProject;
	if (errorsTags) throw errorsTags;
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
			<ArianneElemCreatable
				id="tags"
				list={tags}
				onChange={selectTag}
				selectedId={tagsSelected}
				isMulti
				long
				short
				supplementaryOption={
					<ManageTagOption
						onClick={() => {
							history.push({
								pathname: '/app/tags',
								state: {
									prevLocation: location,
									prevSearch:
										location.search
										|| location.state.prevSearch,
								},
							});
						}}
					>
						Gérer les tags
					</ManageTagOption>
				}
				placeholder={'Chercher par tags'}
			/>
		</ArianneContainer>
	);
}

export default withRouter(ArianneThread);
