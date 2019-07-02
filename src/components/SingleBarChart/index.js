import styled from '@emotion/styled/macro';
import PropTypes from 'prop-types';
import React from 'react';

import {mediumGrey} from '../../utils/colors';
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
`;

const LegendRow = styled('li')`
	:before {
		content: '';
		background: ${props => props.color};
		height: 8px;
		width: 8px;
		display: inline-block;
		vertical-align: middle;
		border-radius: 50%;
		margin: 10px;
	}
`;

const SingleBarChart = ({entries = []}) => (
	<>
		<Container>
			{entries.map(({label, value}, index) => (
				<Tooltip key={index} label={`${label} (${value}%)`}>
					<Bar width={value} color={intToRGB(hashCode(label))} />
				</Tooltip>
			))}
		</Container>
		<Legend>
			{entries.map(({label}, index) => (
				<LegendRow key={index} color={intToRGB(hashCode(label))}>
					{label}
				</LegendRow>
			))}
		</Legend>
	</>
);

SingleBarChart.propTypes = {
	entries: PropTypes.arrayOf(
		PropTypes.shape({
			label: PropTypes.string,
			value: PropTypes.number,
		}),
	),
};

export default SingleBarChart;
