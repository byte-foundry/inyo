import styled from '@emotion/styled';
import {NavLink} from 'react-router-dom';
import {BREAKPOINTS} from '../../utils/constants';

import {primaryWhite} from '../../utils/content';

import {primaryPurple, primaryGrey} from '../../utils/new/design-system';
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
	color: ${primaryGrey};
	position: relative;

	&:hover,
	&.active {
		color: ${primaryWhite};

		&::before {
			content: '';
			display: block;
			background: ${primaryPurple};
			position: absolute;
			left: -0.7rem;
			top: -0.5rem;
			right: -0.7rem;
			bottom: -0.5rem;
			border-radius: 8px;
			z-index: -1;
		}
	}

	@media (max-width: ${BREAKPOINTS}px) {
		margin-left: 1.2rem;
	}
`;

const TopBar = styled('div')`
	display: flex;
	flex-flow: row nowrap;
	justify-content: space-between;
	margin-bottom: 4rem;

	@media (max-width: ${BREAKPOINTS}px) {
		justify-content: space-between;
		margin-bottom: 1rem;
	}
`;

export default TopBar;
