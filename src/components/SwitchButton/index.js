import React from 'react';
import styled from 'react-emotion';

import {primaryBlue, gray30, primaryWhite} from '../../utils/content';

const SwitchButtonMain = styled('div')`
	display: flex;
	margin: 0 10px 10px;
`;

const SwitchContainer = styled('div')`
	margin: 0 15px;
	width: 50px;
	height: 26px;
	border-radius: 13px;
	background: ${gray30};
`;

const SwitchToggle = styled('div')`
	height: 20px;
	width: 20px;
	background: ${props => (props.checked ? primaryBlue : primaryWhite)};
	border-radius: 50%;
	margin: 3px;
	position: relative;
	left: ${props => (props.checked ? '24px' : '0px')};
	transition: background 0.1s ease, left 0.1s ease;
`;

export default function SwitchButton({
	left, right, value, onChange,
}) {
	return (
		<SwitchButtonMain>
			<span onClick={() => onChange(left.value)}>{left.label}</span>
			<SwitchContainer
				onClick={() => {
					const selectedValue
						= value === left.value ? right.value : left.value;

					onChange(selectedValue);
				}}
			>
				<SwitchToggle checked={value === right.value} />
			</SwitchContainer>
			<span onClick={() => onChange(right.value)}>{right.label}</span>
		</SwitchButtonMain>
	);
}

SwitchButton.defaultProps = {
	onChange: () => {},
};
