import React, {Component} from 'react';
import styled from 'react-emotion';
import InlineEditable from '../InlineEditable';
import {H4, H5, FlexRow} from '../../utils/content';

const QuoteSectionMain = styled('div')``;
const QuoteAddItem = styled('button')``;
const TaskName = styled(H5)`
	margin: 0;
`;
const Task = styled(FlexRow)`
	padding: 10px 20px;
	margin-bottom: 5px;
	border: 1px solid black;
`;

class QuoteSection extends Component {
	constructor(props) {
		super(props);
		this.state = {
			shouldDisplayAddTask: false,
		};
	}

	render() {
		const {data, addTask} = this.props;

		return (
			<QuoteSectionMain>
				<H4>
					<InlineEditable
						value={data.title}
						type="text"
						placeholder="Section name"
					/>
				</H4>
				{data.tasks.map(task => (
					<Task
						justifyContent="space-between"
						onClick={() => {
							console.log(task);
						}}
					>
						<TaskName>
							<InlineEditable
								value={task.name}
								type="text"
								placeholder="your task name"
							/>
						</TaskName>
						<InlineEditable
							value={task.amount}
							type="number"
							placeholder="1"
						/>
						<InlineEditable
							value={task.price}
							type="number"
							placeholder="1"
						/>
					</Task>
				))}
				<QuoteAddItem onClick={addTask}>Add item</QuoteAddItem>
			</QuoteSectionMain>
		);
	}
}

export default QuoteSection;
