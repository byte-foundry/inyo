import styled from '@emotion/styled';
import React, {forwardRef} from 'react';
import {NavLink} from 'react-router-dom';

import {BREAKPOINTS} from '../../utils/constants';
import Logo from '../../utils/icons/inyo-topbar-logo.svg';
import {
	darkGrey,
	primaryBlack,
	primaryGrey,
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

	@media (max-width: ${BREAKPOINTS.mobile}px) {
		background: none;
		background-color: ${primaryGrey};
		mask-image: url(${Logo});
		mask-repeat: no-repeat;
		mask-position: center;
		mask-size: 20px;
	}
`;

export const TopBarMenu = styled('div')`
	display: flex;
	flex-flow: column nowrap;

	@media (max-width: ${BREAKPOINTS.mobile}px) {
		display: grid;
		grid-template-columns: 30% 30% 30%;
		padding: 0 5%;
		width: 90%;
		grid-auto-rows: 120px;
	}
`;

export const TopBarLogoNotif = styled(TopBarMenu)`
	justify-content: space-between;

	@media (max-width: ${BREAKPOINTS.mobile}px) {
		display: flex;
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

	i {
		margin-right: 12px;
	}

	&:hover,
	&.active {
		color: ${primaryBlack};
		background-color: ${primaryWhite};
	}

	@media (max-width: ${BREAKPOINTS.mobile}px) {
		flex-direction: column;
		color: ${darkGrey};
		min-width: auto;
		padding: 0;
		margin: 0;

		i {
			margin: 0 0 10px 0;
			font-size: 40px !important;
		}

		&:hover,
		&.active {
			color: ${primaryGrey};
		}
	}
`;

export const Label = styled('span')``;

const TopBar = styled('div')`
	flex-flow: column nowrap;
	flex: ${props => (props.visible ? '0 0 auto' : '0 0 50px')};
	overflow-x: hidden;

	position: relative;
	top: 0;
	bottom: 0;
	right: 0;

	margin-left: 2rem;
	padding-top: 0.8rem;

	background-color: ${darkGrey};
	color: ${primaryWhite};

	span {
		display: ${props => (props.visible ? 'inline' : 'none')};
	}

	a {
		padding-right: ${props => (props.visible ? '1rem' : '0')};
	}

	@media (max-width: ${BREAKPOINTS.mobile}px) {
		display: ${props => (props.visible ? 'flex' : 'none !important')};
		position: fixed;
		left: 0;
		top: 0;
		right: 0;
		bottom: 65px;

		background-color: ${primaryWhite};
	}
`;

export default TopBar;
