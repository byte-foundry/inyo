import styled from '@emotion/styled/macro';
import PropTypes from 'prop-types';
import React from 'react';

import {mediumGrey} from '../../utils/colors';
import {BREAKPOINTS, TAG_COLOR_PALETTE} from '../../utils/constants';
import Tooltip from '../Tooltip';

function hashCode(str) {
	let hash = 0;

	for (let i = 0; i < str.length; i++) {
		// eslint-disable-next-line no-bitwise
		hash = str.charCodeAt(i) + ((hash << 5) - hash);
	}

	return hash;
}

function intToRGB(i) {
	// eslint-disable-next-line no-bitwise
	const c = (i & 0x00ffffff).toString(16).toUpperCase();

	return `#${'00000'.substring(0, 6 - c.length)}${c}`;
}

const Container = styled('div')`
	display: flex;
	background: ${mediumGrey};
	border-radius: 5px;
	height: 8px;
`;

const Bar = styled('div')`
	background: ${props => props.color};
	position: relative;
	height: 8px;
	width: ${props => props.width}%;
	border: 1px solid ${props => props.color};
	border-radius: 5px;
	z-index: 0;

	& + ${() => Bar} {
		margin-left: 5px;
	}
`;

const Legend = styled('ul')`
	list-style-type: none;
	padding: 0;
	display: grid;
	grid-template-columns: repeat(3, auto);

	@media (max-width: ${BREAKPOINTS}px) {
		display: flex;
		flex-direction: column;
	}
`;

const LegendRow = styled('li')`
	@media (max-width: ${BREAKPOINTS}px) {
		margin: 0;
	}

	:before {
		content: '';
		background: ${props => props.color};
		height: 8px;
		width: 8px;
		display: inline-block;
		vertical-align: middle;
		border-radius: 50%;
		margin: 10px;
		margin-left: 0;
	}
`;

const SingleBarChart = ({entries = [], max = 8}) => {
	const sortedEntries = [...entries];

	sortedEntries.sort((a, b) => b.value - a.value);

	const others = sortedEntries.splice(max - 1);

	if (others.length) {
		sortedEntries.push(
			others.reduce((acc, current) => {
				acc.value += current.value;

				return acc;
			}),
			{id: 'others', label: `Autres (${others.length})`, value: 0},
		);
	}

	const getColor = index => (index >= TAG_COLOR_PALETTE.length
		? null
		: TAG_COLOR_PALETTE[index].map(
			color => `#${color
				.map(p => p.toString(16).padStart(2, '0'))
				.join('')}`,
			  )[0]);

	return (
		<>
			<Container>
				{sortedEntries.map(({
					id, label, value, color,
				}, index) => (
					<Tooltip
						key={id}
						label={`${label} (${Math.round(value)}%)`}
					>
						<Bar
							width={value}
							color={
								color
								|| getColor(index)
								|| intToRGB(hashCode(id))
							}
						/>
					</Tooltip>
				))}
			</Container>
			<Legend>
				{sortedEntries.map(({id, label, color}, index) => (
					<LegendRow
						key={id}
						color={
							color || getColor(index) || intToRGB(hashCode(id))
						}
					>
						{label}
					</LegendRow>
				))}
			</Legend>
		</>
	);
};

SingleBarChart.propTypes = {
	entries: PropTypes.arrayOf(
		PropTypes.shape({
			id: PropTypes.string,
			label: PropTypes.string,
			value: PropTypes.number,
			color: PropTypes.string,
		}),
	),
	max: PropTypes.number,
};

export default SingleBarChart;
