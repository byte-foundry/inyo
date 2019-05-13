import styled from '@emotion/styled';
import {NavLink} from 'react-router-dom';
import {BREAKPOINTS} from '../../utils/constants';

import {primaryWhite} from '../../utils/content';

import {primaryPurple, primaryGrey} from '../../utils/new/design-system';
import Logo from '../../utils/icons/inyo-topbar-logo.svg';

export const TopBarLogo = styled(NavLink)`
	background: url(${Logo});
	width: 26px;
	height: 26px;
	background-repeat: no-repeat;
	background-position: center;
	background-size: cover;
	display: block;
`;

export const TopBarMenu = styled('div')`
	display: flex;
	flex-flow: row nowrap;
	justify-content: flex-end;
	align-items: center;
`;

export const TopBarLogoNotif = styled(TopBarMenu)`
	margin-right: 20px;
	justify-content: space-between;
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
		margin-left: 0;
		margin-right: 1.2rem;
		font-size: 0.8rem;

		&:first-of-type {
			margin-left: 0.7rem;
		}
	}
`;

const TopBar = styled('div')`
	display: flex;
	flex-flow: row nowrap;
	justify-content: space-between;
	margin-bottom: 4rem;

	@media (max-width: ${BREAKPOINTS}px) {
		align-items: center;
		margin-bottom: 1rem;
		height: 6rem;
		width: 100%;
		overflow-x: auto;
		padding-right: 1rem;
		display: grid;
		grid-auto-rows: 1fr;
	}
`;

export default TopBar;
