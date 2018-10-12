import React, {Component} from 'react';
import styled from 'react-emotion';
import AddTask from './add-task';
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
		const {data} = this.props;

		return (
			<QuoteSectionMain>
				<H4>{data.title}</H4>
				{data.tasks.map(task => (
					<Task justifyContent="space-between">
						<TaskName>{task.name}</TaskName>
						<span>{task.amount}</span>
						<span>{task.price}€</span>
					</Task>
				))}
				{this.state.shouldDisplayAddTask ? (
					<AddTask />
				) : (
					<QuoteAddItem
						onClick={() => {
							this.setState({shouldDisplayAddTask: true});
						}}
					>
						Add item
					</QuoteAddItem>
				)}
			</QuoteSectionMain>
		);
	}
}

export default QuoteSection;
