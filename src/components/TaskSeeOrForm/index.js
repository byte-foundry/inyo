import React, {Component} from 'react';
import styled from 'react-emotion';

import {GET_PROJECT_DATA} from '../../utils/queries.js';

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
		if (!this.props.project.noItemEdition) {
			this.setState({
				selected: true,
			});
		}
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
					query: GET_PROJECT_DATA,
					variables: {projectId: this.props.match.params.projectId},
				});
				const section = data.project.sections.find(
					e => e.id === sectionId,
				);
				const itemIndex = section.items.find(
					e => e.id === updateValidatedItem.id,
				);

				section.items[itemIndex] = updateValidatedItem;
				try {
					cache.writeQuery({
						query: GET_PROJECT_DATA,
						variables: {
							projectId: this.props.match.params.projectId,
						},
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
		const {task, sectionId, project} = this.props;
		const {selected} = this.state;

		const taskElem = selected ? (
			<TaskForm
				task={task}
				sectionId={sectionId}
				editItem={this.editItem}
				unselect={this.unselectTask}
			/>
		) : (
			<Task
				task={task}
				select={this.selectTask}
				sectionId={sectionId}
				project={project}
			/>
		);

		return <TaskSeeOrFormMain>{taskElem}</TaskSeeOrFormMain>;
	}
}

TaskSeeOrForm.defaultProps = {
	project: {},
};

export default TaskSeeOrForm;
