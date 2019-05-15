import React from 'react';
import styled from '@emotion/styled';

const TagElem = styled('div')`
	background-color: ${props => props.bg};
	color: ${props => props.color};
	border-radius: 2px;
	padding: 3px 10px;
	margin-right: 5px;
	text-decoration: none;
	display: inline-block;

	&:hover {
		text-decoration: none;
	}
`;

function Tag({tag}) {
	return (
		<TagElem bg={tag.colorBg} color={tag.colorText}>
			{tag.name}
		</TagElem>
	);
}

export default Tag;
