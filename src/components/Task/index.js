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

class Task extends Component {
	select = () => {
		this.props.select(this.props.task.id);
	};

	render() {
		const {
			selected,
			task: {
				name, unit, unitPrice, status,
			},
		} = this.props;

		return (
			<TaskMain onClick={this.select}>
				<TaskStatus status={status} />
				<TaskName>{name}</TaskName>
				<TaskTime>{unit}</TaskTime>
				<TaskPrice>
					{unitPrice.toLocaleString(undefined, {
						currency: 'EUR',
						minimumFractionDigits: 2,
					})}
				</TaskPrice>
			</TaskMain>
		);
	}
}

export default Task;
