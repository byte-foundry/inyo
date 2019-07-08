import React, {useCallback} from 'react';
import {withRouter} from 'react-router';

import {Help} from '../../utils/new/design-system';
import HelpModal from '../HelpModal';
import Tooltip from '../Tooltip';

const HelpButton = ({history, location}) => {
	const query = new URLSearchParams(location.search);
	const openHelpModal = query.get('openHelpModal');

	const openModal = useCallback(() => {
		query.set('openHelpModal', true);

		history.push({
			pathname: location.pathname,
			search: `?${query.toString()}`,
		});
	});

	const closeModal = useCallback(() => {
		query.delete('openHelpModal');

		history.push({
			pathname: location.pathname,
			search: `?${query.toString()}`,
		});
	});

	return (
		<>
			<Tooltip label="Instructions pour utiliser l'interface">
				<Help id="help-button" customerToken onClick={openModal}>
					?
				</Help>
			</Tooltip>
			{openHelpModal && <HelpModal onDismiss={closeModal} />}
		</>
	);
};

export default withRouter(HelpButton);
