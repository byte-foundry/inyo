import React, {Component} from 'react';
import styled from 'react-emotion';
import Autocomplete from 'react-autocomplete';
import {Query} from 'react-apollo';
import {H4, H5, FlexRow} from '../../utils/content';
import {templates} from '../../utils/quote-templates';

import {GET_TASK_ITEMS} from '../../utils/queries';

const AddTaskMain = styled('div')`
	background: #ddd;
	padding: 10px 20px;
`;

const TaskComment = styled('textarea')`
	width: 100%;
`;

const ActionButton = styled('button')``;

class AddTask extends Component {
	constructor(props) {
		super(props);
		this.state = props.task;
	}

	render() {
		const {
			name, amount, price, comment,
		} = this.state;
		const {
			task, cancel, done, remove,
		} = this.props;

		return (
			<AddTaskMain>
				<FlexRow justifyContent="space-between">
					<Query query={GET_TASK_ITEMS}>
						{({loading, error, data}) => {
							if (loading) return <p>Loading...</p>;
							if (!loading && data && data.taskTemplate) {
								const {taskItems} = data.taskTemplate;

								return (
									<Autocomplete
										getItemValue={task => task}
										items={taskItems}
										shouldItemRender={(task, value) => task.includes(value)
										}
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
										value={name}
										onChange={(e) => {
											this.setState({
												name: e.target.value,
											});
										}}
										onSelect={(value) => {
											this.setState({
												name: value,
											});
										}}
									/>
								);
							}
						}}
					</Query>
					<input
						type="number"
						placeholder="1"
						value={amount}
						onChange={e => this.setState({amount: parseInt(e.target.value)})
						}
					/>
					<input
						type="number"
						placeholder="500"
						value={price}
						onChange={e => this.setState({price: parseInt(e.target.value)})
						}
					/>
				</FlexRow>
				<FlexRow>
					<TaskComment
						placeholder="Add comments or description"
						value={comment}
						onChange={e => this.setState({comment: e.target.value})}
					/>
				</FlexRow>
				<FlexRow>
					<ActionButton
						onClick={() => {
							remove();
						}}
					>
						Remove task
					</ActionButton>
					<ActionButton
						onClick={() => {
							cancel();
						}}
					>
						Cancel
					</ActionButton>
					<ActionButton
						onClick={() => {
							done(this.state);
						}}
					>
						Done
					</ActionButton>
				</FlexRow>
			</AddTaskMain>
		);
	}
}

export default AddTask;
