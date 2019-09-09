import styled from '@emotion/styled/macro';
import React, {useMemo} from 'react';
import {Link, withRouter} from 'react-router-dom';

import fbt from '../../fbt/fbt.macro';
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
	location,
}) {
	const activableTask = !customerToken && item.status === 'PENDING';
	const customerTask = isCustomerTask(item.type);

	const activateLink = useMemo(
		() => ({
			pathname: `${taskUrlPrefix}/${baseUrl}/${item.id}`,
			state: {
				prevSearch: location.search,
				isActivating: true,
			},
		}),
		[taskUrlPrefix, baseUrl, item.id, location.search],
	);
	const taskLink = useMemo(
		() => ({
			pathname: `${taskUrlPrefix}/${baseUrl}/${item.id}`,
			state: {
				prevSearch: location.search,
			},
		}),
		[taskUrlPrefix, baseUrl, item.id, location.search],
	);

	return (
		customerTask && (
			<>
				{activableTask && item.linkedCustomer && !item.isFocused && (
					<Tooltip
						key={`task-focus-icon-${item.id}`}
						label={
							<fbt
								project="inyo"
								desc="customer reminder are not active"
							>
								Les rappels clients ne sont pas activés pour
								cette tâche
							</fbt>
						}
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
						label={
							<fbt
								project="inyo"
								desc="customer reminders are active"
							>
								Les rappels client sont activés pour cette tâche
							</fbt>
						}
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
						label={
							<fbt
								project="inyo"
								desc="there is no customer linked to this task"
							>
								Aucun client n’est lié à cette tâche
							</fbt>
						}
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

export default withRouter(TaskReminderIcon);
