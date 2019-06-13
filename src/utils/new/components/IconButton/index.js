import React from 'react';
import styled from '@emotion/styled';

import MaterialIcon from '../../../../components/MaterialIcon';

import {
	mediumGrey,
	primaryRed,
	primaryPurple,
	lightRed,
} from '../../design-system';

const IconWrap = styled('div')`
  width: ${(props) => {
		if (props.size === 'micro') {
			return '1.2rem';
		}
		if (props.size === 'tiny') {
			return '1.75rem';
		}
		if (props.size === 'small') {
			return '2rem';
		}
		if (props.size === 'medium') {
			return '3rem';
		}
		if (props.size === 'large') {
			return '4rem';
		}
		return '1.75rem';
	}};

  height: ${(props) => {
		if (props.size === 'micro') {
			return '1.2rem';
		}
		if (props.size === 'tiny') {
			return '1.75rem';
		}
		if (props.size === 'small') {
			return '2rem';
		}
		if (props.size === 'medium') {
			return '3rem';
		}
		if (props.size === 'large') {
			return '4rem';
		}
		return '1.75rem';
	}};

	i {
		width: ${(props) => {
		if (props.size === 'micro') {
			return '12px';
		}
		if (props.size === 'tiny') {
			return '18px';
		}
		if (props.size === 'small') {
			return '24px';
		}
		if (props.size === 'medium') {
			return '36px';
		}
		if (props.size === 'large') {
			return '48px';
		}
		return '18px';
	}};
	}

  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 0;

  cursor: ${props => (props.inactive ? 'not-allowed' : 'pointer')};

  &:before,
	&:after {
    content: '';
    position: absolute;
    border-radius: 50%;
    transition: all 200ms ease;
    z-index: -1;
	}

	&:before {
		background: transparent;
		left: 50%;
		top: 50%;
		right: 50%;
		bottom: 50%;
		width: 0;
		height: 0;
  }

	${props => props.current
		&& `
		&:after {
			background: ${primaryPurple};
			left: 0;
      top: 0;
      right: 0;
      bottom: 0;
      width: 100%;
      height: 100%;
	  }
	`}

  &:hover {
    i {
			color: ${props => (props.danger ? primaryRed : primaryPurple)};
		}

    &:before {
      left: 0;
      top: 0;
      right: 0;
      bottom: 0;
      width: 100%;
      height: 100%;
      background: ${props => (props.danger ? lightRed : mediumGrey)};
    }
  }

	label {
		position: absolute;
    left: calc(100% + 10px);
    width: max-content;

		&:hover {
			color: color: ${props => (props.danger ? primaryRed : primaryPurple)};
			cursor: ${props => (props.inactive ? 'not-allowed' : 'pointer')};
		}
	}
`;

function IconButton({
	icon,
	size,
	invert,
	inactive,
	color,
	danger,
	label,
	current,
	...rest
}) {
	return (
		<IconWrap
			size={size}
			danger={danger}
			{...rest}
			inactive={inactive}
			current={current}
		>
			<MaterialIcon
				icon={icon}
				size={size}
				color={color}
				invert={invert}
				inactive={inactive}
			/>
			{label && <label>{label}</label>}
		</IconWrap>
	);
}

export default IconButton;
