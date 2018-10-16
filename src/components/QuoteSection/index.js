import React, {Component} from 'react';
import styled from 'react-emotion';
import InlineEditable from '../InlineEditable';
import Task from './see-task';
import {H4, H5, FlexRow} from '../../utils/content';

const QuoteSectionMain = styled('div')``;
const QuoteAddItem = styled('button')``;
const TaskName = styled(H5)`
	margin: 0;
`;

class QuoteSection extends Component {
	constructor(props) {
		super(props);
		this.state = {
			shouldDisplayAddTask: false,
		};
	}

	render() {
		const {
			data,
			addTask,
			editSectionTitle,
			editTask,
			sectionIndex,
		} = this.props;

		return (
			<QuoteSectionMain>
				<H4>
					<InlineEditable
						value={data.title}
						type="text"
						placeholder="Section name"
						onFocusOut={(value) => {
							editSectionTitle(sectionIndex, value);
						}}
					/>
				</H4>
				{data.tasks.map((task, index) => (
					<Task
						task={task}
						sectionIndex={sectionIndex}
						taskIndex={index}
						editTask={editTask}
					/>
				))}
				<QuoteAddItem onClick={addTask}>Add item</QuoteAddItem>
			</QuoteSectionMain>
		);
	}
}

export default QuoteSection;
