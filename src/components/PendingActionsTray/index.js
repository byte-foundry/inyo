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
import Plural from '../Plural';
import TimeItTookForm from '../TimeItTookForm';

const Tray = styled('div')`
	width: 700px;
	position: fixed;
	bottom: 0;
	right: 100px;
	box-shadow: 0 1px 5px 0 rgba(0, 0, 0, 0.2), 0 2px 2px 0 rgba(0, 0, 0, 0.14),
		0 3px 1px -2px rgba(0, 0, 0, 0.12);
	transition: transform 400ms cubic-bezier(0.4, 0, 0.2, 1);
	background: ${primaryWhite};
	transform: ${props => (!props.isVisible
		? 'translateY(calc(100%))'
		: !props.isOpen && 'translateY(calc(100% - 4rem + 10px))')};

	@media (max-width: ${BREAKPOINTS}px) {
		width: 100%;
		right: 0px;
	}
`;

const TitleBar = styled('div')`
	display: flex;
	background: ${primaryPurple};
	align-items: center;
	color: ${primaryWhite};
	cursor: pointer;
`;

const Title = styled(P)`
	flex: 1;
	margin: 1rem;
	padding-left: 10px;
	color: currentColor;
	font-weight: 600;
	font-size: 1rem;
`;

const TitleBarIcon = styled('div')`
	margin-right: 1rem;
`;

const Content = styled('div')`
	padding: 10px;
	margin: 0 2rem;
	overflow-y: auto;
	max-height: 90vh;

	@media (max-width: ${BREAKPOINTS}px) {
		max-height: 100%;
	}
`;

const PendingAction = styled('div')`
	display: grid;
	grid-template-columns: 1fr 28px;
	margin-top: 2rem;
`;

const TimeItTookHeading = styled('h3')`
	margin-top: 0;
	font-size: 18px;
	font-weight: 400;
	text-transform: capitalize;
`;

const PendingActionsTray = ({projectId}) => {
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
			&& task.status === 'FINISHED'
			&& (!projectId
				|| (task.section && task.section.project.id === projectId)),
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
						{pendingTimeItTookTasks.length}{' '}
						<Plural
							plural="Actions requises"
							singular="Action requise"
							value={pendingTimeItTookTasks.length}
						/>
					</Title>
					<TitleBarIcon>
						<IconButton
							icon={isOpen ? 'expand_more' : 'expand_less'}
							invert={true}
						/>
					</TitleBarIcon>
				</TitleBar>
				<Content>
					{pendingTimeItTookTasks.map(task => (
						<PendingAction key={task.id}>
							<TimeItTookHeading>{task.name}</TimeItTookHeading>
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
						<MaterialIcon
							icon="done_all"
							size="tiny"
							color="inherit"
						/>
						Valider
					</Button>
				</Content>
			</Tray>
		</Portal>
	);
};

export default PendingActionsTray;
