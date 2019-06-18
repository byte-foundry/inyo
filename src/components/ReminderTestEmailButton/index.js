import React, {useState} from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';
import {useMutation} from 'react-apollo-hooks';

import {
	SEND_REMINDER_TEST_EMAIL,
	SEND_REMINDER_PREVIEW_TEST_EMAIL,
} from '../../utils/mutations';
import {Button} from '../../utils/new/design-system';
import IconButton from '../../utils/new/components/IconButton';
import Tooltip from '../Tooltip';

const Status = styled('span')`
	white-space: nowrap;
	margin: 0 5px;
`;

const ReminderTestEmailButton = ({
	reminder, taskId, preview, ...props
}) => {
	const [status, setStatus] = useState();
	const sendReminderTestEmail = useMutation(SEND_REMINDER_TEST_EMAIL);
	const sendReminderPreviewTestEmail = useMutation(
		SEND_REMINDER_PREVIEW_TEST_EMAIL,
	);

	if (status === 'loading') {
		return <Status>Envoi...</Status>;
	}

	if (status === 'done') {
		return <Status>Test Envoyé</Status>;
	}

	if (status === 'error') {
		return <Status error>Erreur</Status>;
	}

	return (
		<Tooltip label="S'envoyer un email test">
			<Button
				link
				onClick={async () => {
					setStatus('loading');

					let sent = false;

					if (preview) {
						({
							data: {sent},
						} = await sendReminderPreviewTestEmail({
							variables: {type: reminder.type, taskId},
						}));
					}
					else {
						({
							data: {sent},
						} = await sendReminderTestEmail({
							variables: {id: reminder.id},
						}));
					}

					setStatus(sent ? 'done' : 'error');
				}}
				disabled={!preview && reminder.status !== 'PENDING'}
				{...props}
			>
				<IconButton icon="info" size="tiny" />
			</Button>
		</Tooltip>
	);
};

ReminderTestEmailButton.defaultProps = {
	preview: false,
};

ReminderTestEmailButton.propTypes = {
	reminder: PropTypes.shape({
		id: PropTypes.string,
		type: PropTypes.string.isRequired,
	}),
	taskId: PropTypes.string.isRequired,
	preview: PropTypes.bool,
};

export default ReminderTestEmailButton;
