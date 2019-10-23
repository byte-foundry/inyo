import styled from '@emotion/styled';
import React, {useState} from 'react';

import AssistantActions from '../components/AssistantActions';
import MaterialIcon from '../components/MaterialIcon';
import NotificationTrayButton from '../components/NotificationTrayButton';
import Tooltip from '../components/Tooltip';
import TopBar, {
	TopBarLogo,
	TopBarLogoNotif,
	TopBarMenu,
	TopBarMenuLink,
} from '../components/TopBar';
import fbt from '../fbt/fbt.macro';
import {BREAKPOINTS} from '../utils/constants';
import {LeftMenu} from '../utils/new/design-system';
import useLocalStorage from '../utils/useLocalStorage';

export const ToggleMenu = styled('div')`
	padding: 0.5rem 1rem;
	display: flex;
	flex-direction: column;
	align-self: baseline;
	cursor: pointer;
	margin-bottom: 1rem;

	@media (max-width: ${BREAKPOINTS.mobile}px) {
		padding: 3px 10px;
	}
`;

const TogglingTopBar = () => {
	const [visible, toggleMenu] = useLocalStorage('visibleMenu', false);

	return (
		<TopBar visible={visible}>
			<TopBarMenu>
				<ToggleMenu onClick={() => toggleMenu(!visible)}>
					<Tooltip
						label={
							<fbt project="inyo" desc="toggle menu">
								Masquer / afficher le menu
							</fbt>
						}
					>
						<MaterialIcon
							icon={visible ? 'chevron_right' : 'chevron_left'}
							size="tiny"
							color="inherit"
						/>
					</Tooltip>
				</ToggleMenu>
				<Tooltip
					label={
						<fbt project="inyo" desc="dashboard tooltip">
							Planning et liste de tâches
						</fbt>
					}
				>
					<TopBarMenuLink to="/app/dashboard">
						<MaterialIcon
							icon="event"
							size="tiny"
							color="inherit"
						/>
						<span>
							<fbt project="inyo" desc="dashboard">
								Dashboard
							</fbt>
						</span>
					</TopBarMenuLink>
				</Tooltip>
				<Tooltip
					label={
						<fbt project="inyo" desc="projects tooltip">
							Toutes les projets
						</fbt>
					}
				>
					<TopBarMenuLink to="/app/projects">
						<MaterialIcon
							icon="folder_open"
							size="tiny"
							color="inherit"
						/>
						<span>
							<fbt project="inyo" desc="Projets">
								Projets
							</fbt>
						</span>
					</TopBarMenuLink>
				</Tooltip>
				<Tooltip
					label={
						<fbt project="inyo" desc="clients tooltip">
							Tous les clients
						</fbt>
					}
				>
					<TopBarMenuLink to="/app/customers">
						<MaterialIcon
							icon="person"
							size="tiny"
							color="inherit"
						/>
						<span>
							<fbt project="inyo" desc="Clients">
								Clients
							</fbt>
						</span>
					</TopBarMenuLink>
				</Tooltip>
				<Tooltip
					label={
						<fbt project="inyo" desc="collaborators tooltip">
							Tous les collaborateurs
						</fbt>
					}
				>
					<TopBarMenuLink to="/app/collaborators">
						<MaterialIcon icon="face" size="tiny" color="inherit" />
						<span>
							<fbt project="inyo" desc="Collaborators">
								Collaborateurs
							</fbt>
						</span>
					</TopBarMenuLink>
				</Tooltip>
				<Tooltip
					label={
						<fbt project="inyo" desc="stats tooltip">
							Rapports de votre activité
						</fbt>
					}
				>
					<TopBarMenuLink to="/app/stats">
						<MaterialIcon
							icon="equalizer"
							size="tiny"
							color="inherit"
						/>
						<span>
							<fbt project="inyo" desc="Statistiques">
								Statistiques
							</fbt>
						</span>
					</TopBarMenuLink>
				</Tooltip>
				<Tooltip
					label={
						<fbt project="inyo" desc="settings tooltip">
							Profil, jours travaillés, etc.
						</fbt>
					}
				>
					<TopBarMenuLink to="/app/account">
						<MaterialIcon
							icon="account_circle"
							size="tiny"
							color="inherit"
						/>
						<span>
							<fbt project="inyo" desc="Réglages">
								Réglages
							</fbt>
						</span>
					</TopBarMenuLink>
				</Tooltip>
			</TopBarMenu>
		</TopBar>
	);
};

const withHeader = Component => (...args) => (
	<>
		<LeftMenu>
			<TopBarLogoNotif>
				<TopBarLogo to="/app/dashboard" />
				<NotificationTrayButton mobile />
				<AssistantActions mobile />
			</TopBarLogoNotif>
			<NotificationTrayButton desktop />
			<AssistantActions />
		</LeftMenu>
		<Component {...args} />
		<TogglingTopBar />
	</>
);

export default withHeader;
