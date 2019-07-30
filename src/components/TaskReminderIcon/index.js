import styled from '@emotion/styled/macro';
import React, {useMemo} from 'react';
import {Link} from 'react-router-dom';

import {isCustomerTask} from '../../utils/functions';
import {primaryPurple, primaryRed} from '../../utils/new/design-system';
import IconButton from '../IconButton';
import Tooltip from '../Tooltip';

const IconButtonLink = styled(Link)`
	text-decoration: none;
`;

function TaskReminderIcon({
	item,
	customerToken,
	taskUrlPrefix,
	baseUrl,
	locationSearch,
}) {
	const activableTask = !customerToken && item.status === 'PENDING';
	const customerTask = isCustomerTask(item.type);

	const activateLink = useMemo(
		() => ({
			pathname: `${taskUrlPrefix}/${baseUrl}/${item.id}`,
			state: {
				prevSearch: locationSearch,
				isActivating: true,
			},
		}),
		[taskUrlPrefix, baseUrl, item.id, locationSearch],
	);
	const taskLink = useMemo(
		() => ({
			pathname: `${taskUrlPrefix}/${baseUrl}/${item.id}`,
			state: {
				prevSearch: locationSearch,
			},
		}),
		[taskUrlPrefix, baseUrl, item.id, locationSearch],
	);

	return (
		customerTask && (
			<>
				{activableTask && item.linkedCustomer && !item.isFocused && (
					<Tooltip
						key={`task-focus-icon-${item.id}`}
						label="Les rappels clients ne sont pas activés pour cette tâche"
					>
						<IconButtonLink
							isFocused={item.isFocused}
							to={activateLink}
						>
							<IconButton icon="notifications_off" size="tiny" />
						</IconButtonLink>
					</Tooltip>
				)}
				{activableTask && item.linkedCustomer && item.isFocused && (
					<Tooltip
						key={`task-focused-icon-${item.id}`}
						label="Les rappels client sont activés pour cette tâche"
					>
						<IconButtonLink
							isFocused={item.isFocused}
							to={taskLink}
						>
							<IconButton
								icon="notifications_active"
								size="tiny"
								color={primaryPurple}
							/>
						</IconButtonLink>
					</Tooltip>
				)}
				{activableTask && !item.linkedCustomer && (
					<Tooltip
						key={`task-noCustomer-icon-${item.id}`}
						label="Aucun client n’est lié à cette tâche"
					>
						<IconButtonLink to={taskLink}>
							<IconButton
								icon="warning"
								size="tiny"
								color={primaryRed}
							/>
						</IconButtonLink>
					</Tooltip>
				)}
			</>
		)
	);
}

export default TaskReminderIcon;
