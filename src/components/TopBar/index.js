import styled from '@emotion/styled';
import React, {forwardRef} from 'react';
import {NavLink} from 'react-router-dom';

import {BREAKPOINTS} from '../../utils/constants';
import Logo from '../../utils/icons/inyo-topbar-logo.svg';
import {
	darkGrey,
	primaryBlack,
	primaryWhite,
} from '../../utils/new/design-system';

const ForwardedRefNavLink = forwardRef((props, ref) => (
	<NavLink {...props} innerRef={ref} />
));

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
	flex-flow: column nowrap;
`;

export const TopBarLogoNotif = styled(TopBarMenu)`
	justify-content: space-between;

	@media (max-width: ${BREAKPOINTS.mobile}px) {
		justify-content: start;
		flex-direction: row;

		a {
			margin-right: 1rem;
		}
	}
`;

export const TopBarMenuLink = styled(ForwardedRefNavLink)`
	text-decoration: none;
	color: ${primaryWhite};
	position: relative;
	display: flex;
	flex-direction: columns;
	transition: all 400ms ease;
	padding: 0.5rem 1rem;
	min-width: 170px;

	i {
		margin-right: 12px;
	}

	&:hover,
	&.active {
		color: ${primaryBlack};
		background-color: ${primaryWhite};
	}

	@media (max-width: ${BREAKPOINTS.mobile}px) {
		margin-left: 0;
		margin-right: 1.2rem;
		font-size: 0.8rem;

		&:first-of-type {
			margin-left: 0.7rem;
		}
	}
`;

export const Label = styled('span')``;

const TopBar = styled('div')`
	display: flex;
	flex-flow: column nowrap;
	width: ${props => (props.visible ? 'auto' : '50px')};
	max-width: ${props => (props.visible ? 'auto' : '50px')};
	overflow-x: hidden;

	position: relative;
	top: 0;
	bottom: 0;
	right: 0;

	margin-left: 2rem;
	padding-top: 0.8rem;

	background-color: ${darkGrey};

	@media (max-width: ${BREAKPOINTS.mobile}px) {
		align-items: center;
		margin-bottom: 1rem;
		height: 6rem;
		width: 100%;
		overflow-x: auto;
		padding-right: 1rem;
		display: grid;
		grid-auto-rows: 1fr;
	}

	span {
		display: ${props => (props.visible ? 'inline' : 'none')};
	}
`;

export default TopBar;
