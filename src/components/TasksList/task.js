import React, {useState} from 'react';
import styled from '@emotion/styled/macro';
import {useMutation, useQuery} from 'react-apollo-hooks';

import Plural from '../Plural';
import ClockIconSvg from '../../utils/icons/clock.svg';
import HourglassIconSvg from '../../utils/icons/hourglass.svg';
import ClientIconSvg from '../../utils/icons/clienticon.svg';
import {FINISH_ITEM} from '../../utils/mutations';
import {GET_ALL_CUSTOMERS} from '../../utils/queries';
import {ITEM_TYPES, itemStatuses} from '../../utils/constants';

import {
	Button,
	ButtonLink,
	TaskHeading,
	CommentIcon,
	TaskIconText,
	TaskInfosItem,
} from '../../utils/new/design-system';

import {ArianneElem} from '../ArianneThread';

export const TaskContainer = styled('div')`
	display: flex;
	position: relative;
	margin-bottom: calc(2rem - 16px);
	cursor: grab;
`;

const TaskAdd = styled('div')``;

const TaskIcon = styled('div')`
	width: 26px;
	height: 26px;
	border-radius: 50%;
	margin-right: 30px;
	background: url(${(props) => {
		const typeInfos = ITEM_TYPES.find(t => t.type === props.type);

		let icon = typeInfos.iconUrl;

		if (props.status === itemStatuses.FINISHED) {
			icon = typeInfos.iconUrlValidated || typeInfos.iconUrl;
		}
		return icon;
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
	margin-top: 16px;
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

export default function Task({
	item, sectionId, projectId, token,
}) {
	const finishItem = useMutation(FINISH_ITEM);
	const updateItem = useMutation(FINISH_ITEM);
	const {
		data: {
			me: {customers},
		},
		errors: errorsCustomers,
	} = useQuery(GET_ALL_CUSTOMERS);
	const [modifyCustomer, setModifyCustomer] = useState(false);

	const clientName = item.linkedCustomer && item.linkedCustomer.name;

	return (
		<TaskContainer>
			<TaskAdd />
			<TaskIcon status={item.status} type={item.type} />
			<TaskContent>
				<TaskHeader>
					<TaskHeading>{item.name}</TaskHeading>
					<TaskActions>
						<ButtonLink to={`/app/tasks/${item.id}`}>
							Modifier
						</ButtonLink>
						<Button
							icon="✓"
							onClick={() => finishItem({
								variables: {
									itemId: item.id,
									sectionId,
									projectId,
									token,
								},
							})
							}
						>
							Fait
						</Button>
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
						content={
							modifyCustomer ? (
								<ArianneElem
									id="projects"
									list={customers}
									open={true}
									defaultValue={{
										value: item.linkedCustomer.id,
										label: item.linkedCustomer.name,
									}}
									onChange={() => {
										setModifyCustomer(false);
									}}
									onBlur={() => {
										setModifyCustomer(false);
									}}
								/>
							) : (
								<div
									onClick={() => {
										setModifyCustomer(true);
									}}
								>
									{clientName}
								</div>
							)
						}
					/>
				</TaskInfos>
			</TaskContent>
		</TaskContainer>
	);
}