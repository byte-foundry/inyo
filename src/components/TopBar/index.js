import styled from '@emotion/styled';
import {Link} from 'react-router-dom';

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

export const TopBarMenuLink = styled(Link)`
	text-decoration: none;
	margin-left: 1.5rem;
	color: ${accentGrey};
	position: relative;

	&:hover {
		&::before {
			content: '';
			display: block;
			background: ${lightGrey};
			position: absolute;
			left: -0.5rem;
			top: -0.5rem;
			right: -0.5rem;
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
`;

export default TopBar;
