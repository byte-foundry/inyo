import React from 'react';
import styled from '@emotion/styled/macro';
import {Mutation} from 'react-apollo';

import Plural from '../Plural';
import TaskIconSvg from '../../utils/icons/taskicon.svg';
import TaskCustomerIconSvg from '../../utils/icons/taskicon.svg';
import TaskIconUserFinishedSvg from '../../utils/icons/taskicon-user-validated.svg';
import TaskIconCustomerFinishedSvg from '../../utils/icons/taskicon-customer-validated.svg';
import ClockIconSvg from '../../utils/icons/clock.svg';
import HourglassIconSvg from '../../utils/icons/hourglass.svg';
import ClientIconSvg from '../../utils/icons/clienticon.svg';

import {
	Button,
	ButtonLink,
	TaskHeading,
	primaryPurple,
	CommentIcon,
	TaskIconText,
	TaskInfosItem,
	LayoutMainElem,
} from '../../utils/new/design-system';
import {itemStatuses} from '../../utils/constants';
import {FINISH_ITEM} from '../../utils/mutations';
import finishItem from '../../utils/mutateAndUpdate/finishItem';

const TaskContainer = styled('div')`
	display: flex;
	margin-bottom: 2rem;
	margin-top: 3rem;
	position: relative;
	cursor: grab;
`;

const TaskAdd = styled('div')``;

const TaskIcon = styled('div')`
	width: 26px;
	height: 26px;
	border-radius: 50%;
	margin-right: 30px;
	background: url(${(props) => {
		if (props.status === itemStatuses.FINISHED) {
			return TaskIconUserFinishedSvg;
		}
		return TaskIconSvg;
	}});
	margin-top: 30px;
	margin-bottom: 30px;

	&:after,
	&:before {
		content: '';
		display: block;
		border-left: 1px solid #ddd;
		position: absolute;
		left: 13px;
	}

	&:before {
		height: 30px;
		top: -17px;
	}

	&:after {
		top: 73px;
		height: 28px;
	}
`;

const TaskInfosIcon = styled('div')`
	width: 20px;
	height: 20px;
	background-repeat: no-repeat;
	background-image: url(${props => props.icon});
`;

const TaskContent = styled('div')`
	flex: 1;
`;

const TaskActions = styled('div')`
	opacity: 0;
	margin-right: -100px;
	pointer-events: none;
	transition: opacity 200ms ease-out, margin-right 200ms ease-out;
`;

const TaskHeader = styled('div')`
	display: flex;
	justify-content: space-between;
	align-items: baseline;

	&:hover ${TaskActions} {
		opacity: 1;
		margin-right: 0;
		pointer-events: all;
	}
`;

const TaskInfos = styled('div')`
	display: flex;
`;

const TasksListContainer = styled(LayoutMainElem)``;

function TasksList({items, projectId, sectionId}) {
	return (
		<TasksListContainer>
			{items.map(item => (
				<Task
					item={item}
					key={item.id}
					projectId={projectId}
					sectionId={sectionId}
				/>
			))}
		</TasksListContainer>
	);
}

function Task({
	item, sectionId, projectId, token,
}) {
	return (
		<TaskContainer>
			<TaskAdd />
			<TaskIcon status={item.status} />
			<TaskContent>
				<TaskHeader>
					<TaskHeading>{item.name}</TaskHeading>
					<TaskActions>
						<ButtonLink to={`/app/tasks/${item.id}`}>
							Modifier
						</ButtonLink>
						<Mutation mutation={FINISH_ITEM}>
							{itemMutation => (
								<Button
									icon="✓"
									onClick={finishItem({
										itemMutation,
										itemId: item.id,
										sectionId,
										projectId,
										token,
									})}
								>
									Fait
								</Button>
							)}
						</Mutation>
					</TaskActions>
				</TaskHeader>
				<TaskInfos>
					<TaskInfosItem>
						<CommentIcon>
							{item.comments.length > 0
								? item.comments.length
								: '+'}
						</CommentIcon>
					</TaskInfosItem>
					<TaskIconText
						icon={<TaskInfosIcon icon={ClockIconSvg} />}
						content={
							<>
								{item.unit}{' '}
								<Plural
									value={item.unit}
									singular="jour"
									plural="jours"
								/>
							</>
						}
					/>
					<TaskIconText
						icon={<TaskInfosIcon icon={HourglassIconSvg} />}
						content={
							<>
								{item.unit}{' '}
								<Plural
									value={item.unit}
									singular="jour"
									plural="jours"
								/>
							</>
						}
					/>
					<TaskIconText
						icon={<TaskInfosIcon icon={ClientIconSvg} />}
						content={<>Client A</>}
					/>
				</TaskInfos>
			</TaskContent>
		</TaskContainer>
	);
}

export default TasksList;
