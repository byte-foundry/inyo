import styled from '@emotion/styled';
import React, {forwardRef} from 'react';
import {Link, withRouter} from 'react-router-dom';

import {
	accentGrey,
	lightGrey,
	primaryBlack,
	primaryGrey,
	primaryRed,
} from '../../utils/new/design-system';
import Icon from '../MaterialIcon';
import Tooltip from '../Tooltip';

const Name = styled('div')`
	${props => props.done && 'text-decoration: line-through;'}
`;

const Label = styled('span')`
	color: ${primaryGrey};
	margin-right: 5px;
	display: flex;
	flex-direction: row;

	i {
		margin-right: 3px;
	}
`;

const TaskCardElem = styled(Link)`
	color: ${primaryGrey};
	padding: 5px;
	font-size: 0.75rem;
	line-height: 1;
	cursor: pointer;
	display: flex;
	flex-direction: row;
	text-decoration: none;

	transition: all 200ms ease;

	&:hover {
		color: ${primaryBlack};

		i {
			color: ${primaryRed};
		}
	}
`;

const ReminderCard = withRouter(
	({
		reminder, task, location, cardRef, ...rest
	}) => (
		<Tooltip label="Relance client">
			<TaskCardElem
				{...rest}
				done={reminder.status === 'SENT'}
				ref={cardRef}
				to={{
					pathname: `/app/dashboard/${task.id}`,
					state: {prevSearch: location.search},
				}}
			>
				<Label>
					<Icon icon="mail" size="micro" />
					{new Date(reminder.sendingDate).toLocaleTimeString(
						'default',
						{
							hour: '2-digit',
							minute: '2-digit',
						},
					)}
				</Label>
				<Name done={reminder.status === 'SENT'}>{task.name}</Name>
			</TaskCardElem>
		</Tooltip>
	),
);

export default forwardRef((props, ref) => (
	<ReminderCard {...props} cardRef={ref} />
));
