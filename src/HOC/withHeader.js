import React, {Component} from 'react';

const withHeader = Component => (...args) => (
	<>
		<TopBar>
			<ReactTooltip effect="solid" delayShow={TOOLTIP_DELAY} />
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
