import styled from '@emotion/styled/macro';
import moment from 'moment';
import React, {useEffect, useState} from 'react';
import {withRouter} from 'react-router-dom';

import fbt from '../../fbt/fbt.macro';
import {useMutation} from '../../utils/apollo-hooks';
import {BREAKPOINTS, REMINDER_TYPES_DATA} from '../../utils/constants';
import {formatName} from '../../utils/functions';
import {CANCEL_REMINDER} from '../../utils/mutations';
import {
	accentGrey,
	Button,
	mediumGrey,
	P,
	primaryBlack,
	primaryGrey,
} from '../../utils/new/design-system';
import IconButton from '../IconButton';
import NoticeModal from '../NoticeModal';
import ReminderTestEmailButton from '../ReminderTestEmailButton';
import Tooltip from '../Tooltip';

const ReminderList = styled('div')`
	margin-bottom: 2rem;
	margin-top: 1rem;
`;

const ReminderLine = styled('div')`
	border-bottom: 1px dotted ${mediumGrey};
	height: 1px;
	flex: 0 1 20px;
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
		flex: 10 1 220px;
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
		flex: 1;
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
	flex: 1;
`;

const statuses = ['PENDING', 'SENT', 'CANCELED', 'ERRORED'];

function TaskRemindersList({
	reminders = [],
	small,
	baseUrl,
	history,
	noLink,
	onOpenSubPortal = () => {},
}) {
	const [showCustomerReportNotice, setShowCustomerReportNotice] = useState(
		false,
	);
	const [, setLastUpdatedAt] = useState(new Date());
	const [cancelReminder] = useMutation(CANCEL_REMINDER);

	useEffect(() => {
		const id = setInterval(() => {
			setLastUpdatedAt(new Date());
		}, 60 * 1000);

		return () => clearInterval(id);
	}, []);

	useEffect(() => {
		onOpenSubPortal(showCustomerReportNotice);
	}, [showCustomerReportNotice]);

	return (
		<ReminderList>
			{[...reminders]
				.sort((a, b) => {
					if (statuses.indexOf(a.status) < statuses.indexOf(b.status)) return -1;
					if (statuses.indexOf(a.status) > statuses.indexOf(b.status)) return 1;

					return new Date(a.sendingDate) - new Date(b.sendingDate);
				})
				.map((reminder) => {
					let {customer} = reminder;

					if (reminder.item) {
						customer = reminder.item.linkedCustomer;
					}

					const text = REMINDER_TYPES_DATA[reminder.type].text(
						customer
							&& `${customer.name} (${formatName(
								customer.firstName,
								customer.lastName,
							)})`,
					);

					const onClick
						= reminder.type === 'CUSTOMER_REPORT'
							? () => setShowCustomerReportNotice(true)
							: () => !noLink
									&& history.push(
										`${baseUrl}/${reminder.item.id}`,
									);

					const reminderText = (
						<ReminderText
							withLink={baseUrl}
							onClick={onClick}
							small={small}
							canceled={reminder.status === 'CANCELED'}
							done={reminder.status === 'SENT'}
							noLink={noLink}
						>
							{text}
						</ReminderText>
					);

					return (
						<ReminderContainer key={reminder.id}>
							{noLink || reminder.type === 'CUSTOMER_REPORT' ? (
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
								{reminder.status === 'PENDING'
									&& !reminder.id.includes('report') && (
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
												reminder.status
													=== 'CANCELED'
											}
											style={{flex: '0 0 28px'}}
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
			{showCustomerReportNotice && (
				<NoticeModal
					onDismiss={() => setShowCustomerReportNotice(false)}
				>
					<P>
						<fbt desc="customer report notice">
							Lorsque vous validez des tâches pendant votre
							journée, un rapport est envoyé aux clients pour les
							informer de l'avancement du projet ou des tâches sur
							lesquels ils sont concernés.
						</fbt>
					</P>
					<P>
						<fbt desc="customer report notice">
							Si vous ne souhaitez pas que ce client reçoive un
							rapport, vous pouvez désactiver les notifications du
							projet.
						</fbt>
					</P>
				</NoticeModal>
			)}
		</ReminderList>
	);
}

TaskRemindersList.defaultProps = {
	onOpenSubPortal: () => {},
};

export default withRouter(TaskRemindersList);
