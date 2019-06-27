import React, {forwardRef} from 'react';
import {withRouter, Link} from 'react-router-dom';
import styled from '@emotion/styled';

import {primaryBlack, primaryGrey} from '../../utils/new/design-system';
import Icon from '../MaterialIcon';

const TaskCardElem = styled(Link)`
	color: ${primaryGrey};
	padding: 5px;
	font-size: 0.75rem;
	line-height: 1;
	cursor: pointer;

	transition: all 300ms ease;

	${props => props.done && 'text-decoration: line-through;'}

	&:hover {
		color: ${primaryBlack};
		${props => !props.done && 'text-decoration: underline;'}
	}
`;

const ReminderCard = withRouter(
	({
		reminder, task, location, cardRef, ...rest
	}) => (
		<TaskCardElem
			{...rest}
			done={reminder.status === 'SENT'}
			ref={cardRef}
			to={{
				pathname: `/app/dashboard/${task.id}`,
				state: {prevSearch: location.search},
			}}
		>
			<Icon icon="alarm" size="micro" />
			{new Date(reminder.sendingDate).toLocaleTimeString('default', {
				hour: '2-digit',
				minute: '2-digit',
			})}{' '}
			: {task.name}
		</TaskCardElem>
	),
);

export default forwardRef((props, ref) => (
	<ReminderCard {...props} cardRef={ref} />
));
