import styled from '@emotion/styled/macro';
import React, {useEffect, useState} from 'react';
import {Link} from 'react-router-dom';

import {BREAKPOINTS} from '../../utils/constants';
import {isCustomerTask} from '../../utils/functions';
import {
	accentGrey,
	TaskIconText,
	TaskInfosItemLink,
} from '../../utils/new/design-system';
import MaterialIcon from '../MaterialIcon';
import Plural from '../Plural';
import TaskCollaboratorList from '../TaskCollaboratorList';
import TaskComment from '../TaskComment';
import TaskCustomerInput from '../TaskCustomerInput';
import TaskDueDate from '../TaskDueDate';
import TaskReminderIcon from '../TaskReminderIcon';
import TaskUnitInfo from '../TaskUnitInfo';
import Tooltip from '../Tooltip';

const TaskInfos = styled('div')`
	display: flex;
	letter-spacing: 0.05em;
	margin-top: -0.25rem;

	@media (max-width: ${BREAKPOINTS}px) {
		display: none;
	}
`;

const IconsWrap = styled('div')`
	display: flex;
	margin-right: 1rem;

	${TaskInfosItemLink} {
		margin-right: 0;
	}
`;

const Tag = styled(Link)`
	background-color: ${props => props.bg};
	color: ${props => props.color};
	border-radius: 2px;
	padding: 0 3px;
	margin-right: 5px;
	text-decoration: none;

	&:hover {
		text-decoration: none;
	}
`;

function TaskInfosInputs({
	item,
	noComment,
	noAttachment,
	onDueDateSubmit,
	onUnitSubmit,
	onCustomerSubmit,
	startOpen,
	switchOnSelect,
	location,
	customerToken,
	taskUrlPrefix,
	baseUrl,
}) {
	const [editCustomer, setEditCustomer] = useState(false);
	const [editDueDate, setEditDueDate] = useState(false);
	const [taskIsCustomer, setTaskIsCustomer] = useState(
		isCustomerTask(item.type),
	);

	useEffect(() => {
		setTaskIsCustomer(isCustomerTask(item.type));
	}, [item.type]);

	return (
		<TaskInfos>
			<IconsWrap>
				{!noComment && (
					<TaskComment
						key={`TaskComment-${item.id}`}
						taskUrlPrefix={taskUrlPrefix}
						baseUrl={baseUrl}
						item={item}
						noComment={noComment}
						customerToken={customerToken}
						locationSearch={location.search}
					/>
				)}
				<TaskReminderIcon
					item={item}
					customerToken={customerToken}
					taskUrlPrefix={taskUrlPrefix}
					baseUrl={baseUrl}
					locationSearch={location.search}
				/>
			</IconsWrap>
			<TaskUnitInfo
				customerToken={customerToken}
				item={item}
				onUnitSubmit={onUnitSubmit}
				startOpen={startOpen}
				switchOnSelect={switchOnSelect}
				setEditDueDate={setEditDueDate}
			/>
			<TaskDueDate
				editDueDate={editDueDate}
				customerToken={customerToken}
				setEditDueDate={setEditDueDate}
				item={item}
				onDueDateSubmit={onDueDateSubmit}
				switchOnSelect={switchOnSelect}
				setEditCustomer={setEditCustomer}
			/>
			{taskIsCustomer && (
				<TaskCustomerInput
					editCustomer={editCustomer}
					setEditCustomer={setEditCustomer}
					onCustomerSubmit={onCustomerSubmit}
					item={item}
					disabled={!!customerToken}
				/>
			)}
			{!taskIsCustomer && !customerToken && <TaskCollaboratorList />}
			{!noAttachment && !!item.attachments.length && (
				<Tooltip label="Fichiers joints">
					<TaskIconText
						inactive={editDueDate}
						icon={
							<MaterialIcon
								icon="attach_file"
								size="tiny"
								color={accentGrey}
							/>
						}
						content={
							<>
								{item.attachments.length}{' '}
								<Plural
									singular="fichier"
									plural="fichiers"
									value={item.attachments.length}
								/>
							</>
						}
					/>
				</Tooltip>
			)}
			{!customerToken && item.tags && item.tags.length > 0 && (
				<Tooltip label="Tags">
					<TaskIconText
						inactive={true}
						icon={
							<MaterialIcon
								icon="label"
								size="tiny"
								color={accentGrey}
							/>
						}
						content={
							<>
								{item.tags.map(tag => (
									<Tag
										to={{search: `?tags=${tag.id}`}}
										bg={tag.colorBg}
										color={tag.colorText}
									>
										{tag.name}
									</Tag>
								))}
							</>
						}
					/>
				</Tooltip>
			)}
		</TaskInfos>
	);
}

export default TaskInfosInputs;
