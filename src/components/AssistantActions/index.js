import styled from '@emotion/styled';
import Portal from '@reach/portal';
import React, {useEffect, useRef, useState} from 'react';
import useOnClickOutside from 'use-onclickoutside';

import fbt from '../../fbt/fbt.macro';
import {useQuery} from '../../utils/apollo-hooks';
import {BREAKPOINTS} from '../../utils/constants';
import {
	darkGrey,
	primaryGrey,
	primaryRed,
	primaryWhite,
} from '../../utils/new/design-system';
import {GET_REMINDERS} from '../../utils/queries';
import IconButton from '../IconButton';
import SidebarDashboardInfos from '../SidebarDashboardInfos';
import Tooltip from '../Tooltip';

const Dropdown = styled('div')`
	display: flex;
	flex-direction: column;
	align-items: stretch;
	padding: 5px;
	position: absolute;
	width: 450px;
	box-shadow: 0 0 10px ${primaryGrey};
	border-radius: 3px;
	background: ${primaryWhite};

	@media (max-width: ${BREAKPOINTS.mobile}px) {
		width: calc(100% - 10px);
	}
`;

const Icon = styled('button')`
	position: relative;
	i {
		color: ${props => (props.someUnread ? primaryRed : '')} !important;
	}
`;

const AssistantActionsContainer = styled('div')`
	${props => (props.mobile
		? `
		display: none;
		@media (max-width: ${BREAKPOINTS.mobile}px) {
			display: block;
		}
	`
		: `
		display: block;
		@media (max-width: ${BREAKPOINTS.mobile}px) {
			display: none;
		}
	`)}
`;

const Number = styled('div')`
	border-radius: 50%;
	position: absolute;
	font-size: 0.45rem;
	font-weight: 600;
	color: ${primaryWhite};
	background-color: ${darkGrey}D7;
	bottom: 3px;
	right: 0;
	padding: 4px;
`;

const AssistantActions = ({mobile}) => {
	const icon = useRef();
	const dialogRef = useRef();
	const [isOpen, setOpen] = useState(false);
	const {data, refetch, loading} = useQuery(GET_REMINDERS, {
		suspend: false,
		pollInterval: 1000 * 60,
	});

	let pendingReminders = 0;

	if (!loading) {
		pendingReminders
			= data
			&& data.reminders.filter(reminder => reminder.status === 'PENDING')
				.length;
	}

	useOnClickOutside(dialogRef, () => {
		setOpen(false);
	});

	return (
		<AssistantActionsContainer mobile={mobile}>
			<Tooltip
				label={
					<fbt project="inyo" desc="assistant actions tooltip">
						Futures actions de votre assistant
					</fbt>
				}
			>
				<Icon
					ref={icon}
					onClick={() => {
						setOpen(!isOpen);

						if (!isOpen) {
							refetch();
						}
					}}
				>
					<IconButton icon="sentiment_very_satisfied" size="small" />
					<Number>{pendingReminders}</Number>
				</Icon>
			</Tooltip>
			{isOpen && (
				<Portal>
					<Dropdown
						ref={dialogRef}
						aria-modal="true"
						tabIndex="-1"
						style={{
							top:
								icon.current.getBoundingClientRect().top
								+ icon.current.getBoundingClientRect().height,
							left: mobile
								? 0
								: icon.current.getBoundingClientRect().left,
							height: mobile
								? `calc(100% - ${icon.current.getBoundingClientRect()
									.top
										+ icon.current.getBoundingClientRect()
											.height
										+ 20}px`
								: undefined,
						}}
					>
						<SidebarDashboardInfos />
					</Dropdown>
				</Portal>
			)}
		</AssistantActionsContainer>
	);
};

export default AssistantActions;
