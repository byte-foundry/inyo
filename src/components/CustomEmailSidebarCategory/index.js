import styled from '@emotion/styled';
import React, {useState} from 'react';
import {Link, useParams} from 'react-router-dom';

import {CATEGORY_NAMES, EMAIL_NAME_BY_TYPE} from '../../utils/constants';
import {
	primaryBlack,
	primaryGrey,
	primaryPurple,
} from '../../utils/new/design-system';
import MaterialIcon from '../MaterialIcon';

const CategoryWrap = styled('div')`
	margin-bottom: 1rem;
`;

const CategoryHeader = styled('div')`
	text-transform: uppercase;
	font-size: 12px;
	font-weight: 500;
	letter-spacing: 0.03rem;
	display: flex;
	flex-direction: row;
	align-items: baseline;

	i {
		margin-right: 10px;
	}

	&:hover {
		color: ${primaryPurple};
		cursor: pointer;
	}
`;

const TypesContainer = styled('div')`
	padding: ${props => (props.opened ? '1rem 0 1rem 1rem' : 0)};
	height: ${props => (props.opened ? 'auto' : 0)};
	overflow: hidden;
	box-sizing: border-box;
`;

const TypeElem = styled(Link)`
	text-decoration: none;
	padding: 5px 16px 5px 12px;
	border-radius: 20px;
	color: inherit;
	display: inline-flex;
	flex-direction: row;

	i {
		margin-right: 8px;
		transform: scale(0.75);
		color: ${props => (props.active ? primaryBlack : '')} !important;
	}

	&:hover {
		i {
			color: ${primaryBlack} !important;
		}
	}

	&:visited:hover,
	&:hover,
	&:focused {
		text-decoration: none;
		background: red !important;
		color: ${primaryPurple};
	}

	${props => (props.active
		? `
		background: #F1F3F4;
	`
		: '')}
`;

const CustomEmailSidebarCategory = ({category, opened}) => {
	const [open, openCategory] = useState();
	const {category: categoryParam, type: typeParam} = useParams();

	return (
		<CategoryWrap>
			<CategoryHeader onClick={() => openCategory(!open)}>
				<MaterialIcon
					icon={open ? 'keyboard_arrow_down' : 'keyboard_arrow_right'}
					size="tiny"
				/>
				{CATEGORY_NAMES[category.name].text()}
			</CategoryHeader>
			<TypesContainer opened={open || categoryParam === category.name}>
				{category.types.map(type => (
					<TypeElem
						active={
							typeParam === type.name
							&& categoryParam === category.name
						}
						to={`/app/emails/${category.name}/${type.name}`}
					>
						<MaterialIcon
							icon="email"
							size="tiny"
							color={primaryGrey}
						/>
						{EMAIL_NAME_BY_TYPE[type.name].text()}
					</TypeElem>
				))}
			</TypesContainer>
		</CategoryWrap>
	);
};

export default CustomEmailSidebarCategory;
