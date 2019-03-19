import React from 'react';

import TopBar, {
	TopBarMenu,
	TopBarLogo,
	TopBarMenuLink,
} from '../components/TopBar';

const withHeader = Component => (...args) => (
	<>
		<TopBar>
			<TopBarLogo />
			<TopBarMenu>
				<TopBarMenuLink
					data-tip="Tâches prioritaires"
					to="/app/dashboard"
				>
					Dashboard
				</TopBarMenuLink>
				<TopBarMenuLink data-tip="Toutes les tâches" to="/app/tasks">
					Tâches
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
