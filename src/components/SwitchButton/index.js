import React from 'react';
import styled from 'react-emotion';

const SwitchContainer = styled('span')`
	width: 80px;
	height: 40px;
	border-radius: 50%;
`;

const SwitchToggle = styled('span')``;

export default function SwitchButton({
	left, right, value, ...rest
}) {
	return (
		<div>
			<span>{left.label}</span>
			<span />
			<span>{right.label}</span>
		</div>
	);
}
