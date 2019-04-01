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
	lightGrey,
	Button,
} from '../../utils/new/design-system';
import {CANCEL_REMINDER} from '../../utils/mutations';
import {ReactComponent as TrashIcon} from '../../utils/icons/trash-icon.svg';

const ReminderList = styled('div')`
	margin-bottom: 2rem;
	margin-top: 1rem;
`;

const ReminderContainer = styled('div')`
	color: ${primaryGrey};
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

	&:before {
		content: '';
		display: block;
		background: ${lightGrey};
		position: absolute;
		left: -1rem;
		top: -1rem;
		right: -1rem;
		bottom: -1rem;
		border-radius: 8px;
		z-index: -1;
	}
`;

const ReminderText = styled('div')`
	cursor: pointer;
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
	cursor: default;
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
								onClick={() => history.push(
									`${baseUrl}/${reminder.item.id}`,
								)
								}
								small={small}
								canceled={reminder.status === 'CANCELED'}
								done={reminder.status === 'SENT'}
								data-tip={`Ouvrir la tâche "${
									reminder.item.name
								}"`}
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
								data-tip="Supprimer cette action automatique"
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
