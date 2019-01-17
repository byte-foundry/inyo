import styled from '@emotion/styled';

import {
	Button,
	primaryNavyBlue,
	primaryWhite,
	gray50,
	H1,
} from '../../utils/content';

export const TopBarButton = styled(Button)`
	height: 60px;
	display: flex;
	justify-content: center;
	align-items: center;
	text-decoration: none;

	span {
		text-transform: uppercase;
		font-size: 10px;
		color: ${gray50};
	}

	svg {
		width: 45px;
		margin-left: 1em;
	}

	&:hover {
		span {
			color: ${primaryNavyBlue};
		}
	}
`;

export const TopBarTitle = styled(H1)`
	color: ${primaryNavyBlue};
`;

export const TopBarNavigation = styled('div')`
	display: flex;
	flex-flow: row nowrap;
	justify-content: flex-end;
	align-items: center;
`;

const TopBar = styled('div')`
	display: flex;
	flex-flow: row nowrap;
	justify-content: space-between;
	align-items: center;
	padding-left: 40px;
	padding-right: 40px;
	background-color: ${primaryWhite};
`;

export default TopBar;
