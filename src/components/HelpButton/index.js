import React, {useCallback} from 'react';
import {withRouter} from 'react-router';

import {Help} from '../../utils/new/design-system';
import HelpModal from '../HelpModal';
import Tooltip from '../Tooltip';
import WelcomeModal from '../WelcomeModal';

const HelpButton = ({history, location}) => {
	const query = new URLSearchParams(location.search);
	const isHelpModalOpen = query.get('openHelpModal');
	const isWelcomeModalOpen = query.get('openWelcomeModal');

	const openHelpModal = useCallback(() => {
		query.set('openHelpModal', true);

		history.push({
			pathname: location.pathname,
			search: `?${query.toString()}`,
		});
	});

	const openWelcomeModal = useCallback(() => {
		query.set('openWelcomeModal', true);

		history.push({
			pathname: location.pathname,
			search: `?${query.toString()}`,
		});
	});

	const closeModal = useCallback(() => {
		query.delete('openHelpModal');
		query.delete('openWelcomeModal');

		history.push({
			pathname: location.pathname,
			search: `?${query.toString()}`,
		});
	});

	return (
		<>
			<Tooltip label="Instructions pour utiliser l'interface">
				<Help id="help-button" customerToken onClick={openHelpModal}>
					?
				</Help>
			</Tooltip>
			{!isWelcomeModalOpen && isHelpModalOpen && (
				<HelpModal
					openWelcomeModal={openWelcomeModal}
					onDismiss={closeModal}
				/>
			)}
			{isWelcomeModalOpen && <WelcomeModal onDismiss={closeModal} />}
		</>
	);
};

export default withRouter(HelpButton);
