import React, {Component} from 'react';
import styled, {css} from 'react-emotion';
import {Mutation} from 'react-apollo';
import {withRouter} from 'react-router-dom';

import {FINISH_ITEM} from '../../utils/mutations';

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
		return false;
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
		&& ((!props.customer && props.reviewer === 'USER')
			|| (props.customer && props.reviewer === 'CUSTOMER'))
		? 'pointer'
		: 'initial')};

	svg {
		width: 30px;
		${getTaskIconStylesByStatus};
	}

	${props => props.status === 'PENDING'
		&& ((!props.customer && props.reviewer === 'USER')
			|| (props.customer && props.reviewer === 'CUSTOMER'))
		&& hoverState};
`;

class TaskStatus extends Component {
	select = () => {
		this.props.select(this.props.task.id);
	};

	render() {
		const {
			status,
			sectionId,
			itemId,
			mode,
			customerViewMode,
			projectStatus,
			reviewer,
			finishItem,
		} = this.props;

		const {customerToken} = this.props.match.params;

		return (
			<Mutation mutation={FINISH_ITEM}>
				{finishItemMutation => (
					<TaskStatusMain
						onClick={() => {
							if (
								(mode === 'see'
									&& (!customerViewMode
										&& reviewer === 'USER'
										&& status === 'PENDING'))
								|| (customerViewMode
									&& reviewer === 'CUSTOMER'
									&& status === 'PENDING')
							) {
								finishItem(
									itemId,
									sectionId,
									finishItemMutation,
									customerToken,
								);
							}
						}}
					>
						<Status
							status={status}
							customer={customerViewMode}
							reviewer={reviewer}
							projectStatus={projectStatus}
						>
							{getTaskIconByStatus(status)}
						</Status>
					</TaskStatusMain>
				)}
			</Mutation>
		);
	}
}

export default withRouter(TaskStatus);
