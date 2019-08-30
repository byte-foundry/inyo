import React from 'react';

import NotificationTrayButton from '../components/NotificationTrayButton';
import Tooltip from '../components/Tooltip';
import TopBar, {
	TopBarLogo,
	TopBarLogoNotif,
	TopBarMenu,
	TopBarMenuLink,
} from '../components/TopBar';
import fbt from '../fbt/fbt.macro';

const withHeader = Component => (...args) => (
	<>
		<TopBar>
			<TopBarLogoNotif>
				<TopBarLogo to="/app/dashboard" />
				<NotificationTrayButton mobile />
			</TopBarLogoNotif>
			<TopBarMenu>
				<NotificationTrayButton desktop />
				<Tooltip
					label={
						<fbt project="inyo" desc="dashboard tooltip">
							Planning et liste de tâches
						</fbt>
					}
				>
					<TopBarMenuLink to="/app/dashboard">
						<fbt project="inyo" desc="dashboard">
							Dashboard
						</fbt>
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
						<fbt project="inyo" desc="Projets">
							Projets
						</fbt>
					</TopBarMenuLink>
				</Tooltip>
				<Tooltip
					label={
						<fbt project="inyo" desc="contacts tooltip">
							Tous les contacts
						</fbt>
					}
				>
					<TopBarMenuLink to="/app/customers">
						<fbt project="inyo" desc="Contacts">
							Contacts
						</fbt>
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
						<fbt project="inyo" desc="Statistiques">
							Statistiques
						</fbt>
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
						<fbt project="inyo" desc="Réglages">
							Réglages
						</fbt>
					</TopBarMenuLink>
				</Tooltip>
			</TopBarMenu>
		</TopBar>
		<Component {...args} />
	</>
);

export default withHeader;
