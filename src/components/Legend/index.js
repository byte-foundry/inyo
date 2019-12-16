import styled from '@emotion/styled/macro';
import React from 'react';

const LegendList = styled('ul')`
	padding: 0;
	margin: 0;
`;

const Ratio = styled('span')`
	opacity: 0.5;
	margin-left: 1rem;
	font-size: 0.75rem;
`;

const LegendRow = styled('li')`
	display: grid;
	grid-template-columns: 10px 1fr 30px;
	grid-gap: 8px;
	align-items: baseline;
	list-style-item: none;
	margin-bottom: 0.2rem;

	&:hover {
		${Ratio} {
			opacity: 1;
		}
	}
`;

const Label = styled('span')`
	display: inline-block;
	min-width: 10px;
	min-height: 10px;
	border-radius: 50%;
	background-color: ${props => (props.colorScale ? props.colorScale : 'grey')};
	font-size: 0.8rem;
`;

function Legend({list, colorScale}) {
	return (
		<LegendList>
			{list.map((item, index) => (
				<LegendRow>
					<Label colorScale={colorScale[index]} />
					{item.x} <Ratio>{(item.y * 100).toFixed(1)}%</Ratio>
				</LegendRow>
			))}
		</LegendList>
	);
}

export default Legend;
