import React from 'react';
import styled from '@emotion/styled';

import {primaryBlue, gray30, primaryWhite} from '../../utils/content';

const SwitchButtonMain = styled('div')`
	display: flex;
	flex: auto;
	margin: 0 0 10px 0;
	font-size: 14px;
`;

const SwitchContainer = styled('div')`
	margin: 0 15px;
	width: 50px;
	height: 22px;
	border-radius: 11px;
	background: ${gray30};
`;

const SwitchToggle = styled('div')`
	height: 16px;
	width: 16px;
	background: ${props => (props.checked ? primaryBlue : primaryWhite)};
	border-radius: 50%;
	margin: 3px;
	position: relative;
	left: ${props => (props.checked ? '28px' : '0px')};
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
