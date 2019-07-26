import styled from '@emotion/styled';
import Portal from '@reach/portal';
import React, {useEffect, useState} from 'react';
import {useMutation, useQuery} from 'react-apollo-hooks';

import {BREAKPOINTS} from '../../utils/constants';
import {isCustomerTask} from '../../utils/functions';
import {FINISH_ITEM} from '../../utils/mutations';
import {
	Button,
	P,
	primaryGrey,
	primaryPurple,
	primaryWhite,
	SubHeading,
} from '../../utils/new/design-system';
import {GET_ALL_TASKS} from '../../utils/queries';
import IconButton from '../IconButton';
import MaterialIcon from '../MaterialIcon';
import TimeItTookForm from '../TimeItTookForm';

const Tray = styled('div')`
	width: 600px;
	position: fixed;
	bottom: 0;
	right: 20px;
	box-shadow: 0 1px 5px 0 rgba(0, 0, 0, 0.2), 0 2px 2px 0 rgba(0, 0, 0, 0.14),
		0 3px 1px -2px rgba(0, 0, 0, 0.12);
	transition: transform 400ms cubic-bezier(0.4, 0, 0.2, 1);
	background: ${primaryWhite};
	transform: ${props => (!props.isVisible
		? 'translateY(calc(100%))'
		: !props.isOpen && 'translateY(calc(100% - 2rem))')};

	@media (max-width: ${BREAKPOINTS}px) {
		width: 100%;
		right: 0px;
	}
`;

const TitleBar = styled('div')`
	display: flex;
	height: 2rem;
	background: ${primaryPurple};
	align-items: center;
	color: ${primaryWhite};
	cursor: pointer;
`;

const Title = styled(P)`
	flex: 1;
	margin: 0;
	padding-left: 10px;
	color: currentColor;
`;

const TitleBarIcon = styled('div')``;

const Content = styled('div')`
	padding: 10px;
	overflow-y: auto;
	max-height: 90vh;

	@media (max-width: ${BREAKPOINTS}px) {
		max-height: 100%;
	}
`;

const PendingAction = styled('div')`
	display: grid;
	grid-template-columns: 1fr 28px;
`;

const PendingActionsTray = () => {
	const [finishItem] = useMutation(FINISH_ITEM, {suspend: true});
	const [isOpen, setIsOpen] = useState(false);
	const {
		data: {
			me: {tasks},
		},
	} = useQuery(GET_ALL_TASKS, {suspend: true});

	const pendingTimeItTookTasks = tasks.filter(
		task => !isCustomerTask(task.type)
			&& task.timeItTook === null
			&& task.status === 'FINISHED',
	);
	const isVisible = pendingTimeItTookTasks.length > 0;

	useEffect(() => {
		if (!isVisible) {
			setIsOpen(false);
		}
	}, [isVisible]);

	const [valuesMap, setValuesMap] = useState(
		pendingTimeItTookTasks.reduce((map, {id, unit}) => {
			map[id] = unit;
			return map;
		}, {}),
	);

	return (
		<Portal>
			<Tray isOpen={isOpen} isVisible={isVisible}>
				<TitleBar onClick={() => setIsOpen(!isOpen)}>
					<Title>
						Actions requises ({pendingTimeItTookTasks.length})
					</Title>
					<TitleBarIcon>
						<MaterialIcon
							icon={isOpen ? 'expand_more' : 'expand_less'}
							color={primaryWhite}
						/>
					</TitleBarIcon>
				</TitleBar>
				<Content>
					{pendingTimeItTookTasks.map(task => (
						<PendingAction key={task.id}>
							<SubHeading>{task.name}</SubHeading>
							<IconButton
								icon="check_circle"
								size="tiny"
								color={primaryGrey}
								onClick={() => finishItem({
									variables: {
										itemId: task.id,
										timeItTook: valuesMap[task.id],
									},
									optimisticResponse: {
										...task,
										timeItTook: valuesMap[task.id],
									},
								})
								}
							/>
							<TimeItTookForm
								style={{gridColumn: '1 / 3'}}
								estimation={task.unit}
								onChange={timeItTook => setValuesMap({
									...valuesMap,
									[task.id]: timeItTook,
								})
								}
								onSubmit={timeItTook => finishItem({
									variables: {
										itemId: task.id,
										timeItTook,
									},
									optimisticResponse: {
										...task,
										timeItTook,
									},
								})
								}
							/>
						</PendingAction>
					))}
					<Button
						big
						style={{margin: '5px 5px 5px auto'}}
						onClick={() => {
							pendingTimeItTookTasks.forEach(task => finishItem({
								variables: {
									itemId: task.id,
									timeItTook:
											valuesMap[task.id] || task.unit,
								},
								optimisticResponse: {
									...task,
									timeItTook:
											valuesMap[task.id] || task.unit,
								},
							}));
						}}
					>
						Valider
					</Button>
				</Content>
			</Tray>
		</Portal>
	);
};

export default PendingActionsTray;
