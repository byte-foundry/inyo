import React, {Component} from 'react';
import styled from 'react-emotion';
import {Mutation} from 'react-apollo';

import {FINISH_ITEM} from '../../utils/mutations.js';
import {GET_QUOTE_DATA} from '../../utils/queries.js';

import PENDING from './pending.svg';
import FINISHED from './finished.svg';
import UPDATED from './updated.svg';
import UPDATED_SENT from './updated_sent.svg';

const TaskStatusMain = styled('div')`
	position: relative;
	width: 25px;
	height: 25px;
	margin-right: 20px;
`;

const Status = styled('img')`
	width: 30px;
	height: auto;
	position: absolute;
	top: 60%;
	left: 50%;
	transform: translate(-50%, -50%);
`;

const taskImageByStatus = {
	PENDING,
	FINISHED,
	UPDATED,
	UPDATED_SENT,
};

class TaskStatus extends Component {
	select = () => {
		this.props.select(this.props.task.id);
	};

	finishItem = async (itemId, sectionId, finishItem) => finishItem({
		variables: {
			itemId,
		},
		optimisticResponse: {
			__typename: 'Mutation',
			finishItem: {
				id: itemId,
				status: 'FINISHED',
			},
		},
		update: (cache, {data: {finishItem}}) => {
			const data = cache.readQuery({
				query: GET_QUOTE_DATA,
				variables: {quoteId: this.props.match.params.quoteId},
			});
			const section = data.quote.options[0].sections.find(
				e => e.id === sectionId,
			);
			const itemIndex = section.items.find(
				e => e.id === finishItem.id,
			);

			section.items[itemIndex].status = finishItem.status;
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

	render() {
		const {
			status, sectionId, itemId, mode,
		} = this.props;

		return (
			<Mutation mutation={FINISH_ITEM}>
				{finishItem => (
					<TaskStatusMain
						onClick={() => {
							if (mode === 'see') {
								this.finishItem(itemId, sectionId, finishItem);
							}
						}}
					>
						<Status src={taskImageByStatus[status]} />
					</TaskStatusMain>
				)}
			</Mutation>
		);
	}
}

export default TaskStatus;
