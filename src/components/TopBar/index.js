import styled from '@emotion/styled';
import {Link} from 'react-router-dom';

import {
	Button,
	primaryNavyBlue,
	primaryWhite,
	gray50,
	H1,
} from '../../utils/content';
import Logo from '../../utils/icons/inyo-topbar-logo.svg';

export const TopBarLogo = styled('div')`
	background: url(${Logo});
	width: 36px;
	height: 36px;
	background-repeat: no-repeat;
	background-position: center;
`;

export const TopBarMenu = styled('div')`
	display: flex;
	flex-flow: row nowrap;
	justify-content: flex-end;
	align-items: center;
`;

export const TopBarMenuLink = styled(Link)`
	text-decoration: none;
	margin-left: 10px;

	&:before {
		margin-right: 10px;
		content: '\\2014';
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
