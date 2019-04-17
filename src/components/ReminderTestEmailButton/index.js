import React, {useState} from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';
import {useMutation} from 'react-apollo-hooks';

import {
	SEND_REMINDER_TEST_EMAIL,
	SEND_REMINDER_PREVIEW_TEST_EMAIL,
} from '../../utils/mutations';
import {Button} from '../../utils/new/design-system';

const Status = styled('span')`
	white-space: nowrap;
`;

const TestButton = styled(Button)`
	white-space: nowrap;
	padding-top: 0.1rem;
	padding-bottom: 0.2rem;
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
		return <Status>Envoyé ✔</Status>;
	}

	if (status === 'error') {
		return <Status>Erreur ❌</Status>;
	}

	return (
		<TestButton
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
			data-tip="Vous recevrez un email identique à celui que recevra votre client"
			disabled={!preview && reminder.status !== 'PENDING'}
			{...props}
		>
			S'envoyer un email test
		</TestButton>
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
