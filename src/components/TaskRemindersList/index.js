import React from 'react';
import {useMutation} from 'react-apollo-hooks';
import styled from '@emotion/styled';
import moment from 'moment';

import {REMINDER_TYPES_DATA} from '../../utils/constants';
import {
	primaryGrey,
	primaryBlack,
	primaryPurple,
	Button,
} from '../../utils/new/design-system';
import {CANCEL_REMINDER} from '../../utils/mutations';

const ReminderList = styled('div')`
	margin-bottom: 15px;
	margin-top: 10px;
`;

const ReminderContainer = styled('div')`
	color: ${primaryGrey};
	font-size: 14px;
	margin-bottom: 5px;
	display: flex;
	align-items: center;
	height: 25px;
`;

const ReminderText = styled('div')`
	color: ${primaryBlack};
`;
const ReminderDate = styled('div')`
	margin: 0 10px;
`;
const ReminderCancel = styled('div')``;

function TaskRemindersList({reminders}) {
	const cancelReminder = useMutation(CANCEL_REMINDER);

	return (
		<ReminderList>
			{reminders
				.sort(
					(a, b) => new Date(a.sendingDate) - new Date(b.sendingDate),
				)
				.filter(
					reminder => reminder.status === 'PENDING'
						|| reminder.status === 'CANCELED',
				)
				.map(reminder => (
					<ReminderContainer>
						<ReminderText
							canceled={reminder.status === 'CANCELED'}
							done={reminder.status === 'SENT'}
						>
							{REMINDER_TYPES_DATA[reminder.type].text(
								reminder.item.linkedCustomer
									&& reminder.item.linkedCustomer.name,
							)}
						</ReminderText>
						<ReminderDate
							data-tip={moment(reminder.sendingDate).format(
								'DD/MM/YYYY [à] HH:mm',
							)}
						>
							{moment(reminder.sendingDate).fromNow()}
						</ReminderDate>
						<ReminderCancel
							canceled={reminder.status === 'CANCELED'}
						>
							{reminder.status === 'CANCELED' && 'Annulé'}
							{reminder.status === 'SENT' && 'Envoyé'}
							{reminder.status !== 'CANCELED'
								&& reminder.status !== 'SENT' && (
								<Button
									red
									small
									onClick={() => {
										cancelReminder({
											variables: {
												id: reminder.id,
											},
										});
									}}
								>
										Annuler
								</Button>
							)}
						</ReminderCancel>
					</ReminderContainer>
				))}
		</ReminderList>
	);
}

export default TaskRemindersList;
