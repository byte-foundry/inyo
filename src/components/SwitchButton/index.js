import React from 'react';
import styled from 'react-emotion';

import {pastelGreen, gray80, primaryWhite} from '../../utils/content';

const SwitchButtonMain = styled('div')`
	display: flex;
	margin: 0 10px 10px;
	justify-content: center;
	width: 100%;
`;

const SwitchContainer = styled('div')`
	margin: 0 15px;
	width: 50px;
	height: 26px;
	border-radius: 13px;
	background: ${gray80};
`;

const SwitchToggle = styled('div')`
	height: 20px;
	width: 20px;
	background: ${props => (props.checked ? pastelGreen : primaryWhite)};
	border-radius: 50%;
	margin: 3px;
	position: relative;
	left: ${props => (props.checked ? '24px' : '0px')};
	transition: background 0.1s ease, left 0.1s ease;
`;

export default function SwitchButton({
	left,
	right,
	value,
	setFieldValue,
	name,
}) {
	return (
		<SwitchButtonMain>
			<span onClick={() => setFieldValue(name, left.value)}>
				{left.label}
			</span>
			<SwitchContainer
				onClick={() => {
					value === left.value
						? setFieldValue(name, right.value)
						: setFieldValue(name, left.value);
				}}
			>
				<SwitchToggle checked={value === right.value} />
			</SwitchContainer>
			<span onClick={() => setFieldValue(name, right.value)}>
				{right.label}
			</span>
		</SwitchButtonMain>
	);
}
