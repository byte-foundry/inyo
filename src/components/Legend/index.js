import styled from '@emotion/styled/macro';
import React from 'react';

const LegendList = styled('ul')`
	padding: 0;
	margin: 0;
`;

const LegendRow = styled('li')`
	display: flex;
	align-items: baseline;
	list-style-item: none;
	margin-bottom: 0.2rem;
`;

const Label = styled('span')`
	display: inline-block;
	min-width: 10px;
	min-height: 10px;
	border-radius: 50%;
	background-color: ${props =>
		props.colorScale ? props.colorScale : 'grey'};
	margin-right: 0.5rem;
	font-size: 0.8rem;
`;

function Legend({list, colorScale}) {
	return (
		<LegendList>
			{list.map((item, index) => (
				<LegendRow>
					<Label colorScale={colorScale[index]} />
					{item.x}
				</LegendRow>
			))}
		</LegendList>
	);
}

export default Legend;
