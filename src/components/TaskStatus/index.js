import React, {Component} from 'react';
import styled, {css} from 'react-emotion';
import {Mutation} from 'react-apollo';

import {FINISH_ITEM} from '../../utils/mutations.js';
import {GET_QUOTE_DATA} from '../../utils/queries.js';

import {ReactComponent as TaskIcon} from '../../utils/icons/task.svg';
import {ReactComponent as PendingIcon} from '../../utils/icons/pendingTask.svg';

import {primaryNavyBlue, primaryBlue} from '../../utils/content';

const TaskStatusMain = styled('div')`
	position: relative;
	width: 25px;
	height: 25px;
	margin-right: 20px;
`;

const getTaskIconByStatus = (status) => {
	switch (status) {
	case 'PENDING':
		return <TaskIcon />;
	case 'FINISHED':
		return <TaskIcon />;
	case 'UPDATED':
		return <PendingIcon />;
	case 'UPDATED_SENT':
		return <PendingIcon />;
	case 'ADDED':
		return <PendingIcon />;
	case 'ADDED_SENT':
		return <PendingIcon />;
	default:
		break;
	}
};

const getTaskIconStylesByStatus = (props) => {
	switch (props.status) {
	case 'PENDING':
		return css``;
	case 'FINISHED':
		return css`
				.cls-1 {
					stroke: ${primaryNavyBlue};
				}
				.cls-2 {
					stroke: ${primaryBlue};
				}
			`;
	case 'UPDATED':
		return css``;
	case 'UPDATED_SENT':
		return css`
				.cls-2 {
					stroke: ${primaryBlue};
				}
				.cls-1 {
					stroke: ${primaryNavyBlue};
				}
			`;
	case 'ADDED':
		return css``;
	case 'ADDED_SENT':
		return css`
				.cls-2 {
					stroke: ${primaryBlue};
				}
				.cls-1 {
					stroke: ${primaryNavyBlue};
				}
			`;
	default:
		return css`
				.cls-1,
				.cls-2 {
					stroke: pink !important;
				}
			`;
	}
};

const hoverState = css`
	&:hover {
		.hover {
			&.cls-1 {
				stroke: ${primaryNavyBlue};
			}
			&.cls-2 {
				stroke: ${primaryBlue};
			}
		}
	}
`;

const Status = styled('div')`
	width: 30px;
	height: auto;
	position: absolute;
	top: calc(50% + 4px);
	left: 50%;
	transform: translate(-50%, -50%);
	cursor: ${props => (props.status === 'PENDING'
		&& !props.customer
		&& props.quoteStatus !== 'SENT'
		? 'pointer'
		: 'initial')};

	svg {
		width: 30px;
		${getTaskIconStylesByStatus};
	}

	${props => props.status === 'PENDING'
		&& !props.customer
		&& props.quoteStatus !== 'SENT'
		&& hoverState};
`;

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
			window.$crisp.push([
				'set',
				'session:event',
				[[['item_finished', {}, 'yellow']]],
			]);
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
			status,
			sectionId,
			itemId,
			mode,
			customerViewMode,
			quoteStatus,
		} = this.props;

		return (
			<Mutation mutation={FINISH_ITEM}>
				{finishItem => (
					<TaskStatusMain
						onClick={() => {
							if (
								mode === 'see'
								&& !customerViewMode
								&& status === 'PENDING'
								&& quoteStatus !== 'SENT'
							) {
								this.finishItem(itemId, sectionId, finishItem);
							}
						}}
					>
						<Status
							status={status}
							customer={customerViewMode}
							quoteStatus={quoteStatus}
						>
							{getTaskIconByStatus(status)}
						</Status>
					</TaskStatusMain>
				)}
			</Mutation>
		);
	}
}

export default TaskStatus;
