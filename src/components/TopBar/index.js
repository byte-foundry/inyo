import styled from '@emotion/styled';
import {NavLink} from 'react-router-dom';
import {BREAKPOINTS} from '../../utils/constants';

import {
	Button,
	primaryNavyBlue,
	primaryWhite,
	gray50,
	H1,
} from '../../utils/content';

import {
	primaryPurple,
	primaryGrey,
	primaryBlack,
	accentGrey,
	lightGrey,
	mediumGrey,
} from '../../utils/new/design-system';
import Logo from '../../utils/icons/inyo-topbar-logo.svg';

export const TopBarLogo = styled('div')`
	background: url(${Logo});
	width: 26px;
	height: 26px;
	background-repeat: no-repeat;
	background-position: center;
	background-size: cover;
`;

export const TopBarMenu = styled('div')`
	display: flex;
	flex-flow: row nowrap;
	justify-content: flex-end;
	align-items: center;
`;

export const TopBarMenuLink = styled(NavLink)`
	text-decoration: none;
	margin-left: 2rem;
	color: ${accentGrey};
	position: relative;

	&:hover,
	&.active {
		color: ${primaryBlack};

		&::before {
			content: '';
			display: block;
			background: ${lightGrey};
			position: absolute;
			left: -0.7rem;
			top: -0.5rem;
			right: -0.7rem;
			bottom: -0.5rem;
			border-radius: 8px;
			z-index: -1;
		}
	}
`;

const TopBar = styled('div')`
	display: flex;
	flex-flow: row nowrap;
	justify-content: space-between;
	margin-bottom: 4rem;

	@media (max-width: ${BREAKPOINTS}px) {
		margin-bottom: 1rem;
	}
`;

export default TopBar;
