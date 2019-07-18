import styled from '@emotion/styled';
import React from 'react';

import {primaryBlue, primaryRed, primaryWhite} from '../../utils/colors';

const Pie = styled('div')`
	width: 16px;
	height: 16px;
	border-radius: 50%;
	background: ${props => (props.value <= 1
		? primaryWhite
		: props.value > 2
			? primaryRed
			: primaryBlue)};
	border: 2px solid ${primaryBlue};
	background-image: linear-gradient(
		to right,
		transparent 50%,
		currentColor 0
	);
	color: ${props => (props.value <= 1 ? primaryBlue : primaryRed)};

	::before {
		content: '';
		display: block;
		margin-left: 50%;
		height: 100%;
		border-radius: 0 100% 100% 0 / 50%;
		background-color: inherit;
		transform-origin: left;
		background: ${props => (props.value % 1 >= 0.5 || props.value > 2 ? 'currentColor' : '')};
		transform: rotate(
			${props => (props.value <= 2 ? props.value % 0.5 : 1)}turn
		);
	}
`;

const PieChart = props => <Pie {...props} />;

export default PieChart;
