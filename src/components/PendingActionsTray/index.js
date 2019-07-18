import styled from '@emotion/styled';
import Portal from '@reach/portal';
import React, {useEffect, useState} from 'react';
import {useQuery} from 'react-apollo-hooks';

import {BREAKPOINTS} from '../../utils/constants';
import {P, primaryPurple, primaryWhite} from '../../utils/new/design-system';
import {GET_ALL_TASKS} from '../../utils/queries';
import MaterialIcon from '../MaterialIcon';

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
	overflow-y: auto;
	max-height: 90vh;
	cursor: pointer;

	@media (max-width: ${BREAKPOINTS}px) {
		max-height: 100%;
	}
`;

const Title = styled(P)`
	flex: 1;
	margin: 0;
	padding-left: 10px;
	color: currentColor;
`;

const TitleBarIcon = styled('div')``;

const Content = styled('div')``;

const PendingActionsTray = () => {
	const [isOpen, setIsOpen] = useState(false);
	const {
		data: {
			me: {tasks},
		},
	} = useQuery(GET_ALL_TASKS, {suspend: true});

	const pendingTimeItTookTasks = tasks.filter(
		task => task.timeItTook === null && task.status === 'FINISHED',
	);
	const isVisible = pendingTimeItTookTasks.length > 0;

	useEffect(() => {
		if (!isVisible) {
			setIsOpen(false);
		}
	}, [isVisible]);

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
				<Content>Content</Content>
			</Tray>
		</Portal>
	);
};

export default PendingActionsTray;
