import styled from '@emotion/styled';
import Portal from '@reach/portal';
import React, {useEffect, useState} from 'react';
import {useMutation, useQuery} from 'react-apollo-hooks';

import fbt from '../../fbt/fbt.macro';
import {BREAKPOINTS} from '../../utils/constants';
import {isCustomerTask} from '../../utils/functions';
import {FINISH_ITEM} from '../../utils/mutations';
import {
	Button,
	P,
	primaryGrey,
	primaryPurple,
	primaryWhite,
} from '../../utils/new/design-system';
import {GET_ALL_TASKS} from '../../utils/queries';
import useUserInfos from '../../utils/useUserInfos';
import IconButton from '../IconButton';
import MaterialIcon from '../MaterialIcon';
import Plural from '../Plural';
import Tooltip from '../Tooltip';
import UnitWithSuggestionsForm from '../UnitWithSuggestionsForm';

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
	font-weight: 500;
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
	margin-top: 1.6rem;
`;

const TimeItTookHeading = styled('h3')`
	margin-top: 0;
	font-size: 14px;
	font-weight: 400;
	text-transform: capitalize;
`;

const PendingActionsTray = ({projectId}) => {
	const {id: userId} = useUserInfos();
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
				|| (task.section && task.section.project.id === projectId))
			&& (!task.assignee || task.assignee.id === userId),
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
						<fbt project="inyo" desc="time spent">
							Temps réellement{' '}
							<fbt:plural
								name="spent"
								many="passés"
								count={pendingTimeItTookTasks.length}
							>
								passé
							</fbt:plural>{' '}
							à définir
						</fbt>
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
							<Tooltip
								label={
									<fbt
										project="inyo"
										desc="Confirm time spent for this task"
									>
										Valider le temps passé pour cette tâche
									</fbt>
								}
							>
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
							</Tooltip>
							<UnitWithSuggestionsForm
								isTimeItTook
								style={{gridColumn: '1 / 3'}}
								defaultValue={task.unit}
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
					<Tooltip
						label={
							<fbt project="inyo" desc="confirm all time spent">
								Valider tous les temps passés
							</fbt>
						}
					>
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
							<fbt project="inyo" desc="Confirm all time spent">
								Tout valider
							</fbt>
						</Button>
					</Tooltip>
				</Content>
			</Tray>
		</Portal>
	);
};

export default PendingActionsTray;
