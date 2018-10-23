import React, {Component} from 'react';
import styled from 'react-emotion';
import {Mutation} from 'react-apollo';

import {FINISH_ITEM} from '../../utils/mutations.js';
import {GET_QUOTE_DATA} from '../../utils/queries.js';

const TaskStatusMain = styled('div')`
	width: 50px;
	height: 50px;
	background-image: url(${props => taskImageByStatus[props.status]});
`;

const taskImageByStatus = {
	PENDING: require('./pending.svg'),
	FINISHED: require('./finished.svg'),
	UPDATED: require('./updated.svg'),
	UPDATED_SENT: require('./updated_sent.svg'),
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
			status, sectionId, itemId, options,
		} = this.props;

		return (
			<Mutation mutation={FINISH_ITEM}>
				{finishItem => (
					<TaskStatusMain
						status={status}
						onClick={() => {
							if (!options.noValidation) {
								this.finishItem(itemId, sectionId, finishItem);
							}
						}}
					/>
				)}
			</Mutation>
		);
	}
}

TaskStatus.defaultProps = {
	options: {},
};

export default TaskStatus;
