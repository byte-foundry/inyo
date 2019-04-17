import React from 'react';
import styled from '@emotion/styled/macro';
import moment from 'moment';

import {REMINDER_TYPES_DATA} from '../../utils/constants';
import {primaryGrey, mediumGrey} from '../../utils/new/design-system';
import ReminderTestEmailButton from '../ReminderTestEmailButton';

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
`;

const ReminderText = styled('div')`
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

const TaskRemindersPreviewsList = ({
	taskId,
	remindersPreviews = [],
	customerName = '',
	small,
}) => (
	<ReminderList>
		{remindersPreviews
			.sort((a, b) => a.delay - b.delay)
			.map((reminder) => {
				const text = REMINDER_TYPES_DATA[reminder.type].text(
					customerName,
				);

				const dataTipProps = {};

				return (
					<ReminderContainer>
						<ReminderText
							small={small}
							canceled={false}
							done={false}
							{...dataTipProps}
						>
							{text}
						</ReminderText>
						<ReminderLine />
						<ReminderActions>
							<ReminderDate small={small}>
								Envoyé après{' '}
								{moment
									.duration(reminder.delay * 1000)
									.humanize()}
							</ReminderDate>
							<ReminderTestEmailButton
								taskId={taskId}
								reminder={reminder}
								preview
							/>
						</ReminderActions>
					</ReminderContainer>
				);
			})}
	</ReminderList>
);

export default TaskRemindersPreviewsList;
