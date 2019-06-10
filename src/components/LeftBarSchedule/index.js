import React, {useState} from 'react';
import styled from '@emotion/styled';
import {useQuery} from 'react-apollo-hooks';
import moment from 'moment';
import {useSpring, animated} from 'react-spring';

import {GET_ALL_TASKS, GET_USER_INFOS} from '../../utils/queries';
import usePrevious from '../../utils/usePrevious';
import {primaryPurple} from '../../utils/new/design-system';
import {Loading} from '../../utils/content';

const LeftBarContainer = styled('div')`
	position: fixed;
	top: 0;
	left: 0;
	height: 100%;
	z-index: 2;
`;

const LeftBarElem = styled(animated.div)`
	position: absolute;
	top: 0;
	left: 0;
	width: ${props => (props.open ? '100px' : '0px')};
	transition: width 0.2s ease-out;
	height: 100%;
	background: ${primaryPurple};
	overflow: hidden;
`;

const LeftBarContent = styled('div')`
	width: 100px;
`;

function LeftBarSchedule({isDragging}) {
	const [startDay, setStartDay] = useState(moment().startOf('week'));
	const wasOpen = usePrevious(isDragging);
	const animatedProps = useSpring({
		to: async (next) => {
			if (isDragging) {
				await next({
					width: 100,
				});
				await next({opacity: 100});
			}
			else {
				if (wasOpen) {
					await next({
						width: 100,
					});
				}
				await next({width: 0});
			}
		},
		from: {width: 0},
		config: {
			mass: 0.1,
			tension: 500,
			friction: 10,
			clamp: true,
		},
	});
	const {
		data: allTasksData,
		loading: loadingAllTasks,
		error: errorAllTasks,
	} = useQuery(GET_ALL_TASKS, {suspend: true});
	const {
		data: userPrefsData,
		loading: loadingUserPrefs,
		error: errorUserPrefs,
	} = useQuery(GET_USER_INFOS, {suspend: true});

	if (loadingUserPrefs || loadingAllTasks) return <Loading />;
	if (errorUserPrefs) throw errorUserPrefs;
	if (errorAllTasks) throw errorAllTasks;

	const workingDays = userPrefsData.me.workingDays;
	const iteratorDate = moment(startDay).startOf('week');

	return (
		<LeftBarContainer>
			<LeftBarElem style={animatedProps}>
				<LeftBarContent>{workingDays.map(() => false)}</LeftBarContent>
			</LeftBarElem>
		</LeftBarContainer>
	);
}

export default LeftBarSchedule;
