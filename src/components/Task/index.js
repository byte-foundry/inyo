import React, {Component} from 'react';
import styled from 'react-emotion';

import {FlexRow} from '../../utils/content.js';

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

class Task extends Component {
	select = () => {
		this.props.select(this.props.task.id);
	};

	render() {
		const {
			selected,
			task: {
				name, unit, unitPrice, status, pendingUnit, id,
			},
			sectionId,
		} = this.props;

		return (
			<TaskMain>
				<TaskStatus status={status} itemId={id} sectionId={sectionId} />
				<TaskInfo onClick={this.select}>
					<TaskName>{name}</TaskName>
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

export default Task;
