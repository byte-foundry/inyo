import React from 'react';

import NotificationTrayButton from '../components/NotificationTrayButton';
import Tooltip from '../components/Tooltip';
import TopBar, {
	TopBarLogo,
	TopBarLogoNotif,
	TopBarMenu,
	TopBarMenuLink,
} from '../components/TopBar';

const withHeader = Component => (...args) => (
	<>
		<TopBar>
			<TopBarLogoNotif>
				<TopBarLogo to="/app/dashboard" />
				<NotificationTrayButton mobile />
			</TopBarLogoNotif>
			<TopBarMenu>
				<NotificationTrayButton desktop />
				<Tooltip label="Tâches prioritaires">
					<TopBarMenuLink to="/app/dashboard">
						Dashboard
					</TopBarMenuLink>
				</Tooltip>
				<Tooltip label="Toutes les tâches">
					<TopBarMenuLink to="/app/tasks">Tâches</TopBarMenuLink>
				</Tooltip>
				<Tooltip label="Toutes les projets">
					<TopBarMenuLink to="/app/projects">Projets</TopBarMenuLink>
				</Tooltip>
				<Tooltip label="Tous les clients">
					<TopBarMenuLink to="/app/customers">Clients</TopBarMenuLink>
				</Tooltip>
				<Tooltip label="Rapports de votre activité">
					<TopBarMenuLink to="/app/stats">
						Statistiques
					</TopBarMenuLink>
				</Tooltip>
				<Tooltip label="Profil, jours travaillés, etc.">
					<TopBarMenuLink to="/app/account">Réglages</TopBarMenuLink>
				</Tooltip>
			</TopBarMenu>
		</TopBar>
		<Component {...args} />
	</>
);

export default withHeader;
