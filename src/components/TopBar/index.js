import styled from '@emotion/styled';

import {
	Button, primaryNavyBlue, primaryWhite, H1,
} from '../../utils/content';

export const TopBarButton = styled(Button)`
	height: 60px;

	svg {
		width: 60px;
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
