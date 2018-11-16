import React, {Component} from 'react';
import {withRouter} from 'react-router-dom';
import styled from 'react-emotion';

import {FlexRow} from '../../utils/content';

import TaskStatus from '../TaskStatus';

const TaskMain = styled(FlexRow)`
	border: solid 1px;
	background: none;
`;
const TaskName = styled('label')`
	flex: 1;
`;
const TaskTime = styled('label')``;
const TaskPrice = styled('label')``;
const TaskInfo = styled(FlexRow)`
	width: 100%;
`;

const CommentsCount = styled('div')`
	background: red;
	color: white;
	padding: 5px;
`;

const ItemStatus = styled('div')`
	border: solid 1px purple;
	border-radius: 3px;
`;

class Task extends Component {
	select = () => {
		this.props.select(this.props.task.id);
	};

	seeComments = () => {
		const {projectId, customerToken} = this.props.match.params;
		const {
			task: {id},
		} = this.props;

		this.props.history.push(
			`/app/projects/${projectId}/view/${customerToken}/comments/${id}`,
		);
	};

	render() {
		const {
			task: {
				name, unit, unitPrice, status, pendingUnit, id, comments,
			},
			sectionId,
			project,
		} = this.props;

		const commentsCountElem
			= project.seeCommentsNotification
			&& status === 'UPDATED_SENT'
			&& comments.length > 0 ? (
					<CommentsCount onClick={this.seeComments}>
						{comments.length}
					</CommentsCount>
				) : (
					false
				);
		const itemStatus
			= project.seeCommentsNotification && status === 'UPDATED_SENT' ? (
				<ItemStatus>UPDATED</ItemStatus>
			) : (
				false
			);

		return (
			<TaskMain>
				<TaskStatus
					status={status}
					itemId={id}
					sectionId={sectionId}
					project={project}
				/>
				<TaskInfo onClick={this.select}>
					<TaskName>{name}</TaskName>
					{itemStatus}
					{commentsCountElem}
					<TaskTime>{pendingUnit || unit}</TaskTime>
					<TaskPrice>
						{unitPrice.toLocaleString(undefined, {
							currency: 'EUR',
							minimumFractionDigits: 2,
						})}
					</TaskPrice>
				</TaskInfo>
			</TaskMain>
		);
	}
}

export default withRouter(Task);
