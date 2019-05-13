import React from 'react';

import TopBar, {
	TopBarMenu,
	TopBarLogo,
	TopBarMenuLink,
} from '../components/TopBar';
import NotificationTrayButton from '../components/NotificationTrayButton';

const withHeader = Component => (...args) => (
	<>
		<TopBar>
			<TopBarLogo to="/app/dashboard" />
			<TopBarMenu>
				<NotificationTrayButton />
				<TopBarMenuLink
					data-tip="Tâches prioritaires"
					to="/app/dashboard"
				>
					Dashboard
				</TopBarMenuLink>
				<TopBarMenuLink data-tip="Toutes les tâches" to="/app/tasks">
					Tâches
				</TopBarMenuLink>
				<TopBarMenuLink
					data-tip="Toutes les projets"
					to="/app/projects"
				>
					Projets
				</TopBarMenuLink>
				<TopBarMenuLink data-tip="Tous les clients" to="/app/customers">
					Clients
				</TopBarMenuLink>
				<TopBarMenuLink
					data-tip="Profil, jours travaillés, etc."
					to="/app/account"
				>
					Réglages
				</TopBarMenuLink>
			</TopBarMenu>
		</TopBar>
		<Component {...args} />
	</>
);

export default withHeader;
