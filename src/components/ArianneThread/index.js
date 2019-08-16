import styled from '@emotion/styled';
import React, {useMemo} from 'react';
import {useQuery} from 'react-apollo-hooks';
import {withRouter} from 'react-router-dom';
import Select, {components} from 'react-select';
import Creatable from 'react-select/creatable';

import fbt from '../../fbt/fbt.macro';
import {BREAKPOINTS} from '../../utils/constants';
import {formatName} from '../../utils/functions';
import {
	lightGrey,
	primaryPurple,
	primaryRed,
	primaryWhite,
} from '../../utils/new/design-system';
import {
	GET_ALL_CUSTOMERS,
	GET_ALL_PROJECTS,
	GET_USER_TAGS,
} from '../../utils/queries';

const ArianneContainer = styled('div')`
	display: flex;
	${props => props.marginBottom && 'margin-bottom: 2rem;'}
	${props => props.marginTop && 'margin-top: 2rem;'}
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
		<ArianneElemMain id={`${id}-filter`}>
			<Select
				placeholder={children}
				options={options}
				styles={customSelectStyles({...rest})}
				isSearchable
				value={selectedItem}
				hideSelectedOptions
				noOptionsMessage={() => (
					<fbt project="inyo" desc="arianne elem no option message">
						Aucune option
					</fbt>
				)}
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
		<ArianneElemMain long={long} id={`${id}-filter`}>
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
				noOptionsMessage={() => (
					<fbt
						project="inyo"
						desc="arianne elem with create no option message"
					>
						Aucune option
					</fbt>
				)}
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
	marginTop,
	marginBottom,
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
		data: {
			me: {tags},
		},
		errors: errorsTags,
	} = useQuery(GET_USER_TAGS, {suspend: true});

	const projects = projectsUnfiltered.filter(
		project => (!linkedCustomerId
				|| (project.customer
					&& project.customer.id === linkedCustomerId))
			&& project.status === 'ONGOING',
	);

	const filters = [
		{
			id: 'PENDING',
			name: (
				<fbt project="inyo" desc="tasks to do filter label">
					Tâches à faire
				</fbt>
			),
		},
		{
			id: 'FINISHED',
			name: (
				<fbt project="inyo" desc="tasks done filter label">
					Tâches faites
				</fbt>
			),
		},
		{
			id: 'ALL',
			name: (
				<fbt project="inyo" desc="all tasks filter label">
					Toutes les tâches
				</fbt>
			),
		},
	];

	const customersList = useMemo(
		() => customers.map(customer => ({
			...customer,
			name: `${customer.name} (${formatName(
				customer.firstName,
				customer.lastName,
			)})`,
		})),
		[customers],
	);

	if (errorsProject) throw errorsProject;
	if (errorsTags) throw errorsTags;
	if (errorsCustomers) throw errorsCustomers;

	return (
		<ArianneContainer marginBottom={marginBottom} marginTop={marginTop}>
			{selectCustomer && (
				<ArianneElem
					id="clients"
					list={customersList}
					onChange={selectCustomer}
					isClearable
					selectedId={linkedCustomerId}
				>
					Tous les clients
				</ArianneElem>
			)}
			{selectProjects && (
				<ArianneElem
					id="projects"
					list={projects}
					onChange={selectProjects}
					isClearable
					selectedId={projectId}
				>
					Tous les projets
				</ArianneElem>
			)}
			{selectFilter && (
				<ArianneElem
					id="filter"
					list={filters}
					onChange={selectFilter}
					selectedId={filterId}
					placeholder={
						<fbt project="inyo" desc="tasks filter placeholder">
							Toutes les tâches
						</fbt>
					}
				/>
			)}
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
								search: location.search,
								state: {
									prevLocation: location,
									prevSearch:
										location.search
										|| (location.state
											&& location.state.prevSearch),
								},
							});
						}}
					>
						Gérer les tags
					</ManageTagOption>
				}
				placeholder={
					<fbt project="inyo" desc="filter by tag placeholder">
						Chercher par tags
					</fbt>
				}
			/>
		</ArianneContainer>
	);
}

export default withRouter(ArianneThread);
