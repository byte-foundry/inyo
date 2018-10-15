import React, {Component} from 'react';
import styled from 'react-emotion';

import {FlexRow} from '../../utils/content.js';

const TaskMain = styled(FlexRow)`
	border: solid 1px;
`;
const TaskStatus = styled('div')`
	width: 50px;
	height: 50px;
	background: ${props => (props.finished ? 'lightgreen' : 'grey')};
`;
const TaskName = styled('label')`
	flex: 1;
`;
const TaskTime = styled('label')``;
const TaskPrice = styled('label')``;

class Task extends Component {
	render() {
		const {
			name, time, price, finished,
		} = this.props.task;

		return (
			<TaskMain>
				<TaskStatus finished={finished} />
				<TaskName>{name}</TaskName>
				<TaskTime>{time}</TaskTime>
				<TaskPrice>
					{price.toLocaleString(undefined, {
						currency: 'EUR',
						minimumFractionDigits: 2,
					})}
				</TaskPrice>
			</TaskMain>
		);
	}
}

export default Task;
