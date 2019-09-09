import styled from '@emotion/styled/macro';
import moment from 'moment';
import React, {useEffect, useState} from 'react';
import {useMutation} from 'react-apollo-hooks';
import {withRouter} from 'react-router-dom';

import fbt from '../../fbt/fbt.macro';
import {REMINDER_TYPES_DATA} from '../../utils/constants';
import {formatName} from '../../utils/functions';
import {CANCEL_REMINDER} from '../../utils/mutations';
import {
	accentGrey,
	Button,
	mediumGrey,
	primaryBlack,
	primaryGrey,
} from '../../utils/new/design-system';
import IconButton from '../IconButton';
import ReminderTestEmailButton from '../ReminderTestEmailButton';
import Tooltip from '../Tooltip';

const ReminderList = styled('div')`
	margin-bottom: 2rem;
	margin-top: 1rem;
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
	align-items: center;
`;

const statuses = ['PENDING', 'SENT', 'CANCELED', 'ERRORED'];

function TaskRemindersList({
	reminders = [], small, baseUrl, history, noLink,
}) {
	const [, setLastUpdatedAt] = useState(new Date());
	const [cancelReminder] = useMutation(CANCEL_REMINDER);

	useEffect(() => {
		const id = setInterval(() => {
			setLastUpdatedAt(new Date());
		}, 60 * 1000);

		return () => clearInterval(id);
	}, []);

	return (
		<ReminderList>
			{reminders
				.sort((a, b) => {
					if (statuses.indexOf(a.status) < statuses.indexOf(b.status)) return -1;
					if (statuses.indexOf(a.status) > statuses.indexOf(b.status)) return 1;

					return new Date(a.sendingDate) - new Date(b.sendingDate);
				})
				.map((reminder) => {
					const {linkedCustomer} = reminder.item;
					const text = REMINDER_TYPES_DATA[reminder.type].text(
						linkedCustomer
							&& `${linkedCustomer.name} (${formatName(
								linkedCustomer.firstName,
								linkedCustomer.lastName,
							)})`,
					);

					const reminderText = (
						<ReminderText
							withLink={baseUrl}
							onClick={() => !noLink
								&& history.push(`${baseUrl}/${reminder.item.id}`)
							}
							small={small}
							canceled={reminder.status === 'CANCELED'}
							done={reminder.status === 'SENT'}
							noLink={noLink}
						>
							{text}
						</ReminderText>
					);

					return (
						<ReminderContainer>
							{noLink ? (
								reminderText
							) : (
								<Tooltip
									label={
										<fbt project="inyo" desc="open task">
											Ouvrir la tâche "<fbt:param name="taskName">
												{reminder.item.name}
											</fbt:param>"
										</fbt>
									}
								>
									{reminderText}
								</Tooltip>
							)}
							<ReminderLine />
							<ReminderActions>
								<Tooltip
									label={
										reminder.status === 'CANCELED'
											? undefined
											: moment(
												reminder.sendingDate,
											  ).format('DD/MM/YYYY [à] HH:mm')
									}
								>
									<ReminderDate small={small || undefined}>
										{reminder.status === 'PENDING'
											&& moment(
												reminder.sendingDate,
											).fromNow()}
										{reminder.status === 'CANCELED' && (
											<fbt project="inyo" desc="canceled">
												Annulé
											</fbt>
										)}
										{reminder.status === 'SENT' && (
											<fbt project="inyo" desc="sent">
												Envoyé
											</fbt>
										)}
									</ReminderDate>
								</Tooltip>
								{reminder.status === 'PENDING' && (
									<Tooltip
										label={
											<fbt
												project="inyo"
												desc="delete this reminder tooltip"
											>
												Supprimer cette action
												automatique
											</fbt>
										}
									>
										<div
											noLink={noLink}
											canceled={
												reminder.status === 'CANCELED'
											}
										>
											<Button
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
												<IconButton
													icon="cancel"
													size="tiny"
													danger
												/>
											</Button>
										</div>
									</Tooltip>
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
