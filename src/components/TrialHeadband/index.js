import styled from '@emotion/styled';
import gql from 'graphql-tag';
import moment from 'moment';
import React, {useEffect, useState} from 'react';
import {Link} from 'react-router-dom';

import fbt from '../../fbt/fbt.macro';
import {useMutation, useQuery} from '../../utils/apollo-hooks';
import {STOP_CURRENT_TASK_TIMER} from '../../utils/mutations';
import {
	A,
	Button,
	mediumPurple,
	primaryPurple,
	primaryWhite,
} from '../../utils/new/design-system';
import IconButton from '../IconButton';

const TaskLink = styled(A.withComponent(Link))`
	color: ${primaryWhite};

	:hover {
		border-color: ${primaryWhite};
	}
`;

const Headband = styled('div')`
	text-align: center;
	background: ${primaryPurple};
	color: ${primaryWhite};
	margin: 0;
	min-height: 45px;
	display: flex;
	position: fixed;
	left: 0;
	top: 0;
	right: 0;
	z-index: 1;
`;

const Content = styled('div')`
	display: flex;
	justify-content: space-between;
	flex: 1;
	align-items: center;
	padding: 0 2.5rem;
`;

const Timer = styled('div')`
	align-self: center;
	margin-left: 75px;
`;

const PlayButton = styled(IconButton)`
	position: absolute;
	top: 22px;
	width: 3rem;
	height: 3rem;
	border-radius: 50%;

	::after {
		box-shadow: 0 0 0 5px ${primaryWhite};
		border: 1px solid ${primaryWhite};
	}

	:hover {
		cursor: pointer;
		i {
			color: ${primaryPurple};
		}
		::after {
			background-color: white !important;
			border: 1px solid ${mediumPurple};
		}
	}

	i {
		margin-top: 8px;
		font-size: 2rem !important;
	}
`;

const TimerText = styled('span')`
	display: inline-block;
	text-align: left;
	font-weight: bold;
	font-size: 1.2rem;
	padding-right: 1rem;
`;

const RefreshSeconds = ({children}) => {
	const [, forceUpdate] = useState();
	useEffect(() => {
		const id = setInterval(() => forceUpdate(new Date()), 1000);

		return () => clearInterval(id);
	});
	return children();
};

const TrialHeadband = ({history, location, setHeadband}) => {
	const {data, loading, error} = useQuery(
		gql`
			query getPaymentAndCurrentTask {
				me {
					id
					email
					signedUpAt
					lifetimePayment
					currentTask {
						id
						name
						workedTimes {
							start
							end
						}
					}
				}
			}
		`,
		{suspend: false},
	);
	const [stopCurrentTaskTimer] = useMutation(STOP_CURRENT_TASK_TIMER);

	useEffect(() => {
		if (data && data.me) {
			setHeadband(!(data.me.lifetimePayment && !data.me.currentTask));
		}
	}, [data]);

	if (loading || error) return null;

	const {lifetimePayment, signedUpAt, currentTask} = data.me;

	if (lifetimePayment && !currentTask) {
		return null;
	}

	const trialEndsAt = moment(signedUpAt)
		.add(15, 'days')
		.fromNow();

	const lastWorkedTime
		= currentTask && currentTask.workedTimes.length > 0
			? currentTask.workedTimes[currentTask.workedTimes.length - 1]
			: null;
	const previousTimesDiff = currentTask
		? currentTask.workedTimes
			.slice(0, -1)
			.reduce(
				(duration, {start, end}) => duration.add(moment(end).diff(start)),
				moment.duration(),
			)
		: null;

	return (
		<Headband>
			<Content>
				{currentTask && (
					<>
						<PlayButton
							icon="pause"
							current
							invert
							onClick={() => stopCurrentTaskTimer()}
						/>
						<Timer>
							<RefreshSeconds>
								{() => (
									<TimerText>
										{moment
											.duration(
												moment().diff(
													lastWorkedTime.start,
												),
											)
											.add(previousTimesDiff)
											.format('HH:mm:ss')}
									</TimerText>
								)}
							</RefreshSeconds>
							<TaskLink
								to={{
									pathname: `/app/${
										location.pathname.includes('dashboard')
											? 'dashboard'
											: 'tasks'
									}/${currentTask.id}`,
									state: {prevSearch: location.search},
								}}
							>
								{currentTask.name}
							</TaskLink>
						</Timer>
					</>
				)}
				{!lifetimePayment && (
					<p style={{marginLeft: 'auto'}}>
						<fbt project="inyo" desc="trial is ending message">
							La version d'essai s'arrête{' '}
							<fbt:param name="date">{trialEndsAt}</fbt:param>
						</fbt>{' '}
						<Button
							style={{display: 'inline'}}
							onClick={() => {
								window.Stripe(
									'pk_test_sQRzrgMJ5zlrmL6glhP4mKe600LVdPEqRU',
								);

								history.push('/pay-for-inyo');
							}}
						>
							<fbt project="inyo" desc="switch to paid version">
								Passer à la version payante
							</fbt>
						</Button>
					</p>
				)}
			</Content>
		</Headband>
	);
};

export default TrialHeadband;
