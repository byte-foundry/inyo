import React, {useState} from 'react';
import styled from '@emotion/styled';
import {useMutation} from 'react-apollo-hooks';

import {SEND_REMINDER_TEST_EMAIL} from '../../utils/mutations';
import {Button} from '../../utils/new/design-system';

const Status = styled('span')`
	white-space: nowrap;
`;

const TestButton = styled(Button)`
	white-space: nowrap;
	padding-top: 0.1rem;
	padding-bottom: 0.2rem;
`;

const ReminderTestEmailButton = ({reminder, ...props}) => {
	const [status, setStatus] = useState();
	const sendReminderTestEmail = useMutation(SEND_REMINDER_TEST_EMAIL);

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

				const {
					data: {sent},
				} = await sendReminderTestEmail({
					variables: {id: reminder.id},
				});

				setStatus(sent ? 'done' : 'error');
			}}
			data-tip="Vous recevrez un email identique à celui que recevra votre client"
			disabled={reminder.status !== 'PENDING'}
			{...props}
		>
			S'envoyer un email test
		</TestButton>
	);
};

export default ReminderTestEmailButton;
