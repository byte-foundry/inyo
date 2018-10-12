import React, {Component} from 'react';
import styled from 'react-emotion';
import {H4, H5, FlexRow} from '../../utils/content';

const AddTaskMain = styled('div')`
	background: #ddd;
	padding: 10px 20px;
`;

const TaskComment = styled('textarea')`
	width: 100%;
`;

class AddTask extends Component {
	render() {
		return (
			<AddTaskMain>
				<FlexRow justifyContent="space-between">
					<input type="text" placeholder="autocompletion input" />
					<input type="number" placeholder="1" />
					<input type="text" placeholder="500€" />
				</FlexRow>
				<FlexRow>
					<TaskComment placeholder="Add comments or description" />
				</FlexRow>
			</AddTaskMain>
		);
	}
}

export default AddTask;
