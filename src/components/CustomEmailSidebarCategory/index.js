import styled from "@emotion/styled";
import React, { useState } from "react";
import { Link, useParams } from "react-router-dom";

import { CATEGORY_NAMES, EMAIL_NAME_BY_TYPE } from "../../utils/constants";

const CategoryHeader = styled("div")`
	text-transform: uppercase;
`;

const TypesContainer = styled("div")`
	padding: ${props => (props.opened ? "1rem 0 1rem 1rem" : 0)};
	height: ${props => (props.opened ? "auto" : 0)};
	overflow: hidden;
	box-sizing: border-box;
`;

const TypeElem = styled(Link)`
	display: block;
	text-decoration: none;
	padding: 10px 18px;
	border-radius: 20px;
	color: inherit;

	${props =>
		props.active
			? `
		background: #F1F3F4;
	`
			: ""}

	&:visited {
		color: inherit;
		text-decoration: none;
	}

	&:hover,
	&:focused {
		text-decoration: none;
		background: #f1f3f4;
	}
`;

const CustomEmailSidebarCategory = ({ category, opened }) => {
	const [open, openCategory] = useState();
	const { category: categoryParam, type: typeParam } = useParams();

	return (
		<div>
			<CategoryHeader onClick={() => openCategory(!open)}>
				{CATEGORY_NAMES[category.name].text()}
			</CategoryHeader>
			<TypesContainer opened={open || categoryParam === category.name}>
				{category.types.map(type => (
					<TypeElem
						active={
							typeParam === type.name &&
							categoryParam === category.name
						}
						to={`/app/emails/${category.name}/${type.name}`}
					>
						{EMAIL_NAME_BY_TYPE[type.name].text()}
					</TypeElem>
				))}
			</TypesContainer>
		</div>
	);
};

export default CustomEmailSidebarCategory;
