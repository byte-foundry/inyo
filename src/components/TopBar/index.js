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
	margin-left: 2rem;
	color: ${accentGrey};

	&:hover {
		color: ${primaryPurple};
	}
`;

const TopBar = styled('div')`
	display: flex;
	flex-flow: row nowrap;
	justify-content: space-between;
	background-color: ${primaryWhite};
	margin-bottom: 3rem;
`;

export default TopBar;
