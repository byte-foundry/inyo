import React from 'react';
import {useMutation} from 'react-apollo-hooks';
import {withRouter} from 'react-router-dom';
import styled from '@emotion/styled/macro';
import moment from 'moment';

import {REMINDER_TYPES_DATA} from '../../utils/constants';
import {
	primaryGrey,
	primaryBlack,
	primaryPurple,
	primaryRed,
	accentGrey,
	lightGrey,
	lightRed,
	primaryWhite,
	mediumGrey,
	Button,
} from '../../utils/new/design-system';
import ReminderTestEmailButton from '../ReminderTestEmailButton';
import {CANCEL_REMINDER} from '../../utils/mutations';

const ReminderList = styled('div')`
	margin-bottom: 2rem;
	margin-top: 1rem;
`;

const Delete = styled(Button)`
	color: ${primaryRed};
	width: 1.2rem;
	height: 1.2rem;
	transition: all 200ms ease;

	&:hover {
		color: ${primaryWhite};
		background-color: ${primaryRed};
	}
`;

const ReminderLine = styled('div')`
	border-bottom: 1px dotted ${mediumGrey};
	height: 1px;
	flex: 1;
	margin: 0 1%;
`;

const ReminderContainer = styled('div')`
	color: ${primaryGrey};
	font-size: 12px;
	height: 1.2rem;
	margin-bottom: 2px;
	display: flex;
	align-items: center;
	justify-content: space-between;

	&:hover {
		color: ${primaryBlack};
		svg {
			opacity: 1;
			margin-right: 0;
			transition: all 300ms ease;
		}
	}

	&:hover ${ReminderLine} {
		border-color: ${accentGrey};
	}
`;

const ReminderText = styled('div')`
	cursor: ${props => (props.noLink ? 'default' : 'pointer')};
	${props => props.small
		&& `
		flex: 1 0 200px;
		text-overflow: ellipsis;
		overflow: hidden;
		white-space: nowrap;
	`}
`;
const ReminderDate = styled('div')`
	font-size: 10px;
	margin: 0 10px;
	cursor: default;
	flex: 1 1 100px;
	${props => props.small
		&& `
		flex: 1 1 50px;
		text-overflow: ellipsis;
		overflow: hidden;
		white-space: nowrap;
	`}
`;

const ReminderActions = styled('div')`
	display: flex;
	text-align: right;
	justify-content: space-between;
	align-items: baseline;
`;

const ReminderCancel = styled('div')`
	${props => props.noLink && 'margin-right: 10px;'}
`;

function TaskRemindersList({
	reminders = [], small, baseUrl, history, noLink,
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

					const dataTipProps = {};

					if (!noLink) {
						dataTipProps['data-tip'] = `Ouvrir la tâche "${
							reminder.item.name
						}"`;
					}

					return (
						<ReminderContainer>
							<ReminderText
								withLink={baseUrl}
								onClick={() => !noLink
									&& history.push(
										`${baseUrl}/${reminder.item.id}`,
									)
								}
								small={small}
								canceled={reminder.status === 'CANCELED'}
								done={reminder.status === 'SENT'}
								{...dataTipProps}
								noLink={noLink}
							>
								{text}
							</ReminderText>
							<ReminderLine />
							<ReminderActions>
								<ReminderDate
									small={small}
									data-tip={
										reminder.status !== 'CANCELED'
											? moment(
												reminder.sendingDate,
											  ).format('DD/MM/YYYY [à] HH:mm')
											: undefined
									}
								>
									{reminder.status === 'PENDING'
										&& moment(reminder.sendingDate).fromNow()}
									{reminder.status === 'CANCELED' && 'Annulé'}
									{reminder.status === 'SENT' && 'Envoyé'}
								</ReminderDate>
								{reminder.status === 'PENDING' && (
									<ReminderCancel
										noLink={noLink}
										canceled={
											reminder.status === 'CANCELED'
										}
										data-tip="Supprimer cette action automatique"
									>
										<Delete
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
											&times;
										</Delete>
									</ReminderCancel>
								)}
								{noLink && reminder.status === 'PENDING' && (
									<ReminderTestEmailButton
										reminder={reminder}
									/>
								)}
							</ReminderActions>
						</ReminderContainer>
					);
				})}
		</ReminderList>
	);
}

export default withRouter(TaskRemindersList);
