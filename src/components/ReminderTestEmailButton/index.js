import React, {useState} from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';
import {useMutation} from 'react-apollo-hooks';

import {
	SEND_REMINDER_TEST_EMAIL,
	SEND_REMINDER_PREVIEW_TEST_EMAIL,
} from '../../utils/mutations';
import {Button} from '../../utils/new/design-system';
import {ReactComponent as EyeIcon} from '../../utils/icons/eye.svg';

const Eye = styled(EyeIcon)`
	vertical-align: middle;
	width: 16px;
	height: 16px;
	margin: 0 10px;
`;

const Status = styled('span')`
	white-space: nowrap;
`;

const TestButton = styled(Button)`
	white-space: nowrap;
	height: 18px;
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
		return <Status>Test Envoyé ✔</Status>;
	}

	if (status === 'error') {
		return <Status>Erreur ❌</Status>;
	}

	return (
		<TestButton
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
			data-tip="S'envoyer un email test"
			disabled={!preview && reminder.status !== 'PENDING'}
			{...props}
		>
			<Eye />
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
