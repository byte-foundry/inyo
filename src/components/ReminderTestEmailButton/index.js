import React, {useState} from 'react';
import styled from '@emotion/styled';
import {useMutation} from 'react-apollo-hooks';

import {SEND_REMINDER_TEST_EMAIL} from '../../utils/mutations';
import {Button} from '../../utils/new/design-system';

const TestButton = styled(Button)``;

const ReminderTestEmailButton = ({reminder}) => {
	const [status, setStatus] = useState();
	const sendReminderTestEmail = useMutation(SEND_REMINDER_TEST_EMAIL);

	if (status === 'loading') {
		return <>Envoi...</>;
	}

	if (status === 'done') {
		return <>Envoyé ✔</>;
	}

	if (status === 'error') {
		return <>Erreur ❌</>;
	}

	return (
		<TestButton
			onClick={async () => {
				setStatus('loading');

				const {
					data: {sent},
				} = await sendReminderTestEmail({
					variables: {id: reminder.id},
				});

				setStatus(sent ? 'done' : 'error');
			}}
			data-tip="Vous recevrez un email identique à celui que recevra votre client"
			disabled={reminder.status !== 'PENDING'}
		>
			S'envoyer un email test
		</TestButton>
	);
};

export default ReminderTestEmailButton;
