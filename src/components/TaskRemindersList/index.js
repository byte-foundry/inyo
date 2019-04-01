import React from 'react';
import {useMutation} from 'react-apollo-hooks';
import {withRouter} from 'react-router-dom';
import styled from '@emotion/styled';
import moment from 'moment';

import {REMINDER_TYPES_DATA} from '../../utils/constants';
import {
	primaryGrey,
	primaryBlack,
	primaryPurple,
	primaryRed,
	accentGrey,
	Button,
} from '../../utils/new/design-system';
import {CANCEL_REMINDER} from '../../utils/mutations';
import {ReactComponent as TrashIcon} from '../../utils/icons/trash-icon.svg';

const ReminderList = styled('div')`
	margin-bottom: 12px;
	margin-top: 10px;
`;

const ReminderContainer = styled('div')`
	color: ${accentGrey};
	font-size: 12px;
	margin-bottom: 5px;
	display: flex;
	align-items: center;

	overflow: hidden;

	&:hover {
		color: ${primaryBlack};
		svg {
			opacity: 1;
			margin-right: 0;
			transition: all 300ms ease;
		}
	}
`;

const ReminderText = styled('div')`
	color: ${primaryGrey};
	${props => props.small
		&& `
		width:250px;
		text-overflow: ellipsis;
		overflow: hidden;
		white-space: nowrap;
	`}
`;
const ReminderDate = styled('div')`
	font-size: 10px;
	margin: 0 10px;
	${props => props.small
		&& `
		width:85px;
		text-overflow: ellipsis;
		overflow: hidden;
		white-space: nowrap;
	`}
`;

const DeleteIcon = styled(TrashIcon)`
	opacity: 0.25;

	path {
		fill: ${accentGrey};
	}
	&:hover {
		path {
			fill: ${primaryRed};
		}
	}
`;

const ReminderCancel = styled('div')``;

function TaskRemindersList({
	reminders = [], small, baseUrl, history,
}) {
	const cancelReminder = useMutation(CANCEL_REMINDER);

	return (
		<ReminderList>
			{reminders
				.sort(
					(a, b) => new Date(a.sendingDate) - new Date(b.sendingDate),
				)
				.filter(
					reminder => reminder.status === 'PENDING'
						|| (reminder.status === 'CANCELED'
							&& moment(reminder.sendingDate).diff(
								moment(),
								'hours',
							) > -12),
				)
				.map((reminder) => {
					const text = REMINDER_TYPES_DATA[reminder.type].text(
						reminder.item.linkedCustomer
							&& reminder.item.linkedCustomer.name,
					);

					return (
						<ReminderContainer>
							<ReminderText
								withLink={baseUrl}
								onClick={() => {
									debugger;
									history.push(
										`${baseUrl}/${reminder.item.id}`,
									);
								}}
								small={small}
								canceled={reminder.status === 'CANCELED'}
								done={reminder.status === 'SENT'}
								data-tip={`${text} - ${reminder.item.name}`}
							>
								{text}
							</ReminderText>
							<ReminderDate
								small={small}
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
										link
										small
										onClick={() => {
											cancelReminder({
												variables: {
													id: reminder.id,
												},
											});
										}}
									>
										<DeleteIcon />
									</Button>
								)}
							</ReminderCancel>
						</ReminderContainer>
					);
				})}
		</ReminderList>
	);
}

export default withRouter(TaskRemindersList);
