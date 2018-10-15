import React, {Component} from 'react';
import styled from 'react-emotion';
import Autocomplete from 'react-autocomplete';
import {H4, H5, FlexRow} from '../../utils/content';

const AddTaskMain = styled('div')`
	background: #ddd;
	padding: 10px 20px;
`;

const TaskComment = styled('textarea')`
	width: 100%;
`;
const sampleTasks = [
	'moodboard',
	'benchmark',
	'visual research',
	'wireframes',
	'development',
	'review',
];

class AddTask extends Component {
	constructor(props) {
		super(props);
		this.state = {
			selectedTask: '',
		};
	}

	render() {
		const {selectedTask} = this.state;

		return (
			<AddTaskMain>
				<FlexRow justifyContent="space-between">
					<Autocomplete
						getItemValue={task => task}
						items={sampleTasks}
						shouldItemRender={(task, value) => task.includes(value)}
						renderItem={(task, isHighlighted) => (
							<div
								style={{
									background: isHighlighted
										? 'lightgray'
										: 'white',
								}}
							>
								{task}
							</div>
						)}
						value={selectedTask}
						onChange={(e) => {
							this.setState({
								selectedTask: e.target.value,
							});
						}}
						onSelect={(value) => {
							this.setState({
								selectedTask: value,
							});
						}}
					/>
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
