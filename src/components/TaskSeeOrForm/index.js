import React, {Component} from 'react';
import styled from 'react-emotion';

import {GET_QUOTE_DATA} from '../../utils/queries.js';

import Task from '../Task';
import TaskForm from '../TaskForm';

const TaskSeeOrFormMain = styled('div')`
	width: 70%;
`;

class TaskSeeOrForm extends Component {
	constructor(props) {
		super(props);
		this.state = {};
	}

	selectTask = (id) => {
		this.setState({
			selected: true,
		});
	};

	unselectTask = () => {
		this.setState({
			selected: false,
		});
	};

	editItem = async (itemId, sectionId, data, updateValidatedItem) => {
		const {name, unit, comment} = data;

		return updateValidatedItem({
			variables: {
				itemId,
				unit,
				comment: {text: comment},
			},
			optimisticResponse: {
				__typename: 'Mutation',
				updateValidatedItem: {
					id: itemId,
					status: 'UPDATED',
					name,
					unit,
					comment: {text: comment},
					__typename: 'Item',
				},
			},
			update: (cache, {data: {updateValidatedItem}}) => {
				const data = cache.readQuery({
					query: GET_QUOTE_DATA,
					variables: {quoteId: this.props.match.params.quoteId},
				});
				const section = data.quote.options[0].sections.find(
					e => e.id === sectionId,
				);
				const itemIndex = section.items.find(
					e => e.id === updateValidatedItem.id,
				);

				section.items[itemIndex] = updateValidatedItem;
				try {
					cache.writeQuery({
						query: GET_QUOTE_DATA,
						variables: {quoteId: this.props.match.params.quoteId},
						data,
					});
				}
				catch (e) {
					console.log(e);
				}
				this.setState({apolloTriggerRenderTemporaryFix: true});
			},
		});
	};

	render() {
		const {task, sectionId} = this.props;
		const {selected} = this.state;

		const taskElem = selected ? (
			<TaskForm
				task={task}
				sectionId={sectionId}
				editItem={this.editItem}
				unselect={this.unselectTask}
			/>
		) : (
			<Task task={task} select={this.selectTask} sectionId={sectionId} />
		);

		return <TaskSeeOrFormMain>{taskElem}</TaskSeeOrFormMain>;
	}
}

export default TaskSeeOrForm;
